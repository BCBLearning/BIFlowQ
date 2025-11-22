const AnalyticsAgent = require("./analytics-agent");
const TradingAgent = require("./trading-agent");
const MonitoringAgent = require("./monitoring-agent");
const ResearchAgent = require("./research-agent");
const RealQubicAgent = require("./real-qubic-agent");
const QubicSimulator = require("../services/qubic-simulator");

class AgentCore {
  constructor(useRealQubic = false) {
    this.useRealQubic = useRealQubic;
    this.agents = {
      analytics: new AnalyticsAgent(),
      trading: new TradingAgent(),
      monitoring: new MonitoringAgent(),
      research: new ResearchAgent(),
    };

    if (useRealQubic) {
      try {
        this.agents.qubic = new RealQubicAgent();
        console.log("🔗 REAL Qubic Agent initialized");
      } catch (error) {
        console.error(
          "❌ Failed to initialize Real Qubic Agent:",
          error.message
        );
        this.useRealQubic = false;
        this.qubicSimulator = new QubicSimulator();
      }
    } else {
      this.qubicSimulator = new QubicSimulator();
      console.log("🔧 PROTOTYPE Mode - Simulated data");
    }
  }

  async processRequest(data) {
    const { agentType, action, parameters } = data;

    if (!this.agents[agentType]) {
      throw new Error(
        `Agent type '${agentType}' not found. Available: ${Object.keys(
          this.agents
        ).join(", ")}`
      );
    }

    console.log(`🎯 Processing: ${agentType}.${action}`);

    try {
      const result = await this.agents[agentType].execute(action, parameters);

      let qubicData;
      if (this.useRealQubic && this.agents.qubic) {
        qubicData = await this.agents.qubic.getNetworkStats();
      } else {
        qubicData = await this.qubicSimulator.getNetworkInfo();
      }

      return {
        ...result,
        metadata: {
          mode: this.useRealQubic ? "real" : "prototype",
          agent: agentType,
          action: action,
          timestamp: new Date().toISOString(),
        },
        qubicData: qubicData,
      };
    } catch (error) {
      console.error(`❌ ${agentType}.${action} failed:`, error.message);
      throw error;
    }
  }

  getAgentMetadata() {
    const baseMetadata = {
      analytics: {
        name: "Analytics Agent",
        description: "Market analysis and trend prediction",
        availableActions: ["analyze-market", "predict-trend"],
        icon: "📊",
      },
      trading: {
        name: "Trading Agent",
        description: "Automated trading and portfolio management",
        availableActions: ["execute-trade", "get-portfolio"],
        icon: "💹",
      },
      monitoring: {
        name: "Monitoring Agent",
        description: "Network health and system alerts",
        availableActions: ["monitor-network", "alert-system"],
        icon: "🔍",
      },
      research: {
        name: "Research Agent",
        description: "Market research and report generation",
        availableActions: ["research-topic", "generate-report"],
        icon: "🔬",
      },
    };

    if (this.useRealQubic && this.agents.qubic) {
      baseMetadata.qubic = {
        name: "Qubic Network Agent",
        description: "Direct Qubic blockchain interaction",
        availableActions: [
          "get-network-stats",
          "submit-ai-task",
          "get-market-data",
        ],
        icon: "⛓️",
      };
    }

    return baseMetadata;
  }
}

module.exports = AgentCore;

