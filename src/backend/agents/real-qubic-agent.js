const RealQubicService = require("../services/real-qubic-service");

class RealQubicAgent {
  constructor() {
    this.name = "Qubic Network Agent";
    this.qubic = new RealQubicService("testnet");
    this.connected = false;
  }

  async initialize() {
    try {
      await this.qubic.connect();
      this.connected = true;
    } catch (error) {
      console.error("❌ Failed to initialize Qubic agent:", error.message);
      this.connected = false;
    }
  }

  async execute(action, parameters) {
    if (!this.connected) {
      await this.initialize();
    }

    switch (action) {
      case "get-network-stats":
        return await this.getNetworkStats(parameters);
      case "submit-ai-task":
        return await this.submitAITask(parameters);
      case "get-market-data":
        return await this.getMarketData(parameters);
      default:
        throw new Error(`Action '${action}' not supported by Qubic Agent`);
    }
  }

  async getNetworkStats(params) {
    try {
      const networkInfo = await this.qubic.getRealNetworkInfo();
      const marketData = await this.qubic.getRealMarketData();

      return {
        network: networkInfo,
        market: marketData,
        health: await this.qubic.healthCheck(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to get network stats: ${error.message}`);
    }
  }

  async submitAITask(params) {
    const { taskType, inputData, reward } = params;

    try {
      const taskResult = await this.qubic.submitRealAITask({
        algorithm: taskType,
        input: inputData,
        reward: reward,
      });

      return {
        ...taskResult,
        message: "AI task submitted to Qubic network",
      };
    } catch (error) {
      throw new Error(`Failed to submit AI task: ${error.message}`);
    }
  }

  async getMarketData(params) {
    const { symbol = "QUBIC" } = params;

    try {
      return await this.qubic.getRealMarketData(symbol);
    } catch (error) {
      throw new Error(`Failed to get market data: ${error.message}`);
    }
  }
}

module.exports = RealQubicAgent;

