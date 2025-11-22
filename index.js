console.log("🚀 Starting BIFlowQ Server...");
console.log("📁 Loading configuration...");

require("dotenv").config();

const mode = process.env.REAL_QUBIC === "true" ? "REAL" : "PROTOTYPE";
console.log(`🔧 Mode: ${mode}`);
console.log(`🌐 Network: ${process.env.QUBIC_NETWORK || "testnet"}`);

require("./server.js");
