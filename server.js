require("dotenv").config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));
app.use("/assets", express.static("assets"));

// Stockage en mémoire du mode (peut être changé dynamiquement)
let currentMode = process.env.REAL_QUBIC === "true" ? "real" : "prototype";

// Route principale avec paramètre de mode
app.get("/", (req, res) => {
  const requestedMode = req.query.mode || req.query.real ? "real" : "prototype";

  // Mettre à jour le mode si demandé via l'URL
  if (requestedMode !== currentMode) {
    currentMode = requestedMode;
    console.log(`🔄 Mode changed to: ${currentMode.toUpperCase()}`);
  }

  res.sendFile(path.join(__dirname, "frontend/index.html"));
});

// API pour changer le mode dynamiquement
app.post("/api/mode", (req, res) => {
  const { mode } = req.body;

  if (mode === "real" || mode === "prototype") {
    currentMode = mode;
    console.log(`🔄 Mode changed to: ${currentMode.toUpperCase()} via API`);

    // Notifier tous les clients connectés du changement de mode
    io.emit("mode-changed", { mode: currentMode });

    res.json({
      success: true,
      mode: currentMode,
      message: `Mode changed to ${currentMode}`,
    });
  } else {
    res.status(400).json({
      success: false,
      error: 'Invalid mode. Use "real" or "prototype"',
    });
  }
});

// API pour obtenir le mode actuel
app.get("/api/mode", (req, res) => {
  res.json({
    mode: currentMode,
    supportedModes: ["prototype", "real"],
    config: {
      network: process.env.QUBIC_NETWORK || "testnet",
      hasPrivateKey: !!(
        process.env.QUBIC_PRIVATE_KEY &&
        !process.env.QUBIC_PRIVATE_KEY.includes("your_private_key")
      ),
      hasContract: !!(
        process.env.QUBIC_CONTRACT_ADDRESS &&
        !process.env.QUBIC_CONTRACT_ADDRESS.includes("0xYourDeployedContract")
      ),
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    version: "1.0.0",
    mode: currentMode,
    timestamp: new Date().toISOString(),
  });
});

// Import des agents
const AgentCore = require("./backend/agents/agent-core");

console.log("🚀 BIFlowQ Server Starting...");
console.log(`🔧 Initial Mode: ${currentMode.toUpperCase()}`);
console.log(`🌐 Network: ${process.env.QUBIC_NETWORK || "testnet"}`);

// Socket.io avec gestion dynamique du mode
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);
  console.log(`🔧 Current mode: ${currentMode.toUpperCase()}`);

  // Fonction pour envoyer la configuration actuelle
  const sendCurrentConfig = () => {
    const agentCore = new AgentCore(currentMode === "real");
    socket.emit("config-update", {
      mode: currentMode,
      agents: agentCore.getAgentMetadata(),
      timestamp: new Date().toISOString(),
    });
  };

  // Envoyer la configuration initiale
  sendCurrentConfig();

  // Écouter les demandes de changement de mode
  socket.on("change-mode", (data) => {
    const { mode } = data;

    if (mode === "real" || mode === "prototype") {
      if (mode === "real") {
        // Vérifier la configuration pour le mode réel
        const hasValidConfig =
          process.env.QUBIC_PRIVATE_KEY &&
          !process.env.QUBIC_PRIVATE_KEY.includes("your_private_key") &&
          process.env.QUBIC_CONTRACT_ADDRESS &&
          !process.env.QUBIC_CONTRACT_ADDRESS.includes(
            "0xYourDeployedContract"
          );

        if (!hasValidConfig) {
          socket.emit("mode-change-error", {
            error:
              "Real mode requires valid QUBIC_PRIVATE_KEY and QUBIC_CONTRACT_ADDRESS in .env file",
            suggestion:
              "Run: npm run generate:wallet and update your .env file",
          });
          return;
        }
      }

      currentMode = mode;
      console.log(
        `🔄 Mode changed to: ${currentMode.toUpperCase()} by client ${
          socket.id
        }`
      );

      // Notifier tous les clients du changement
      io.emit("mode-changed", { mode: currentMode });

      // Renvoyer la configuration mise à jour
      sendCurrentConfig();

      socket.emit("mode-change-success", {
        mode: currentMode,
        message: `Mode successfully changed to ${currentMode}`,
      });
    }
  });

  socket.on("agent-request", async (data) => {
    console.log(
      `🤖 [${currentMode.toUpperCase()}] [${data.agentType}] ${data.action}`
    );

    try {
      const agent = new AgentCore(currentMode === "real");
      const result = await agent.processRequest(data);

      socket.emit("agent-response", {
        success: true,
        data: result,
        requestId: data.requestId,
      });
    } catch (error) {
      console.error("❌ Agent error:", error.message);
      socket.emit("agent-response", {
        success: false,
        error: error.message,
        requestId: data.requestId,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎉 BIFlowQ Server running on port ${PORT}`);
  console.log(`👉 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 API Mode: http://localhost:${PORT}/api/mode`);
  console.log("💡 Use URL parameters: ?mode=prototype or ?mode=real");
});

