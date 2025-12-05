require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Socket.io
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));
app.use("/assets", express.static("assets"));

// Mode dynamique
let currentMode = process.env.REAL_QUBIC === "true" ? "real" : "prototype";

// Route principale
app.get("/", (req, res) => {
  const requestedMode = req.query.mode || req.query.real ? "real" : "prototype";
  if (requestedMode !== currentMode) {
    currentMode = requestedMode;
    console.log(`🔄 Mode changed to: ${currentMode.toUpperCase()}`);
  }
  res.sendFile(path.join(__dirname, "frontend/index.html"));
});

// API mode
app.get("/api/mode", (req, res) => {
  res.json({
    mode: currentMode,
    supportedModes: ["prototype", "real"],
    config: {
      network: process.env.QUBIC_NETWORK || "testnet",
      hasPrivateKey: !!process.env.QUBIC_PRIVATE_KEY,
      hasContract: !!process.env.QUBIC_CONTRACT_ADDRESS,
    },
  });
});

app.post("/api/mode", (req, res) => {
  const { mode } = req.body;
  if (mode === "real" || mode === "prototype") {
    currentMode = mode;
    io.emit("mode-changed", { mode: currentMode });
    res.json({ success: true, mode: currentMode });
  } else {
    res
      .status(400)
      .json({ success: false, error: 'Use "real" or "prototype"' });
  }
});

// Agents simulés
const simulatedAgents = {
  analytics: {
    name: "Analytics Agent",
    description: "Performs data analysis",
    icon: "📊",
    availableActions: ["run-report", "generate-summary"],
  },
  helper: {
    name: "Helper Agent",
    description: "Assists with tasks",
    icon: "🤖",
    availableActions: ["assist", "notify"],
  },
};

// Socket.io
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Envoyer config initiale immédiatement
  socket.emit("config-update", {
    mode: currentMode,
    agents: simulatedAgents,
    timestamp: new Date().toISOString(),
  });

  socket.on("change-mode", (data) => {
    const { mode } = data;
    if (mode === "real" || mode === "prototype") {
      currentMode = mode;
      io.emit("mode-changed", { mode: currentMode });
    } else {
      socket.emit("mode-change-error", { error: 'Use "real" or "prototype"' });
    }
  });

  socket.on("agent-request", (data) => {
    console.log(
      `🤖 [${currentMode}] Agent ${data.agentType} requested: ${data.action}`
    );
    // Simuler une réponse
    socket.emit("agent-response", {
      success: true,
      data: { message: `Executed ${data.action} on ${data.agentType}` },
      requestId: data.requestId,
    });
  });

  socket.on("disconnect", () =>
    console.log("🔌 Client disconnected:", socket.id)
  );
});

// PORT dynamique pour CodeSandbox
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎉 Server running on port ${PORT}`);
  console.log(`👉 Frontend: https://8x425h-${PORT}.csb.app`);
});
