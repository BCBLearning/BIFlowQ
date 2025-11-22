class QubicSimulator {
  constructor() {
    this.connected = true;
    this.network = "testnet";
  }

  async getNetworkInfo() {
    return {
      currentEpoch: Math.floor(200 + Math.random() * 50),
      blockHeight: Math.floor(1000000 + Math.random() * 10000),
      network: this.network,
      activeComputors: Math.floor(600 + Math.random() * 76),
      simulated: true,
      message: "Prototype mode - simulated data",
      timestamp: new Date().toISOString(),
    };
  }

  async submitAITask(taskData) {
    return {
      taskId: `TASK_${Date.now()}`,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      status: "submitted",
      simulated: true,
      message: "Prototype mode - task simulation",
      timestamp: new Date().toISOString(),
    };
  }

  async getMarketData(symbol = "QUBIC") {
    return {
      symbol: symbol,
      price: (0.015 + Math.random() * 0.005).toFixed(6),
      change24h: (-5 + Math.random() * 10).toFixed(2),
      volume: Math.floor(1000000 + Math.random() * 2000000),
      marketCap: Math.floor(1500000000 + Math.random() * 500000000),
      timestamp: new Date().toISOString(),
      simulated: true,
    };
  }
}

module.exports = QubicSimulator;

