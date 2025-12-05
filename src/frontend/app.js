class BIFlowQApp {
  constructor() {
    this.socket = null;
    this.currentAgent = null;
    this.currentAction = null;
    this.isConnected = false;
    this.currentMode = "prototype";
    this.agentsMetadata = {};

    this.initializeApp();
  }

  initializeApp() {
    this.connectSocket();
    this.setupEventListeners();
    this.initializeUI();
  }

  connectSocket() {
    this.socket = io();

    this.socket.on("connect", () => {
      console.log("✅ Connected to BIFlowQ server");
      this.updateConnectionStatus(true);

      // Vérifier le mode actuel du serveur
      this.checkServerMode();
    });

    this.socket.on("config-update", (config) => {
      console.log("⚙️ Received configuration:", config);
      this.currentMode = config.mode || "prototype";
      this.agentsMetadata = config.agents || {};
      this.updateUIMode();

      // Définir l’agent courant par défaut
      const agentIds = Object.keys(this.agentsMetadata);
      this.currentAgent = agentIds.length ? agentIds[0] : null;

      this.loadAgentButtons();
    });

    this.socket.on("mode-changed", (data) => {
      console.log("🔄 Mode changed by server:", data.mode);
      this.currentMode = data.mode;
      this.updateUIMode();
      this.showNotification(`Mode changed to ${data.mode.toUpperCase()}`);
    });

    this.socket.on("mode-change-success", (data) => {
      console.log("✅ Mode change successful:", data.mode);
      this.currentMode = data.mode;
      this.updateUIMode();
      this.showNotification(data.message);
    });

    this.socket.on("mode-change-error", (data) => {
      console.error("❌ Mode change failed:", data.error);
      this.showError(data.error);
      this.updateModeButtons(this.currentMode);
    });

    this.socket.on("agent-response", (response) => {
      this.handleAgentResponse(response);
    });

    this.socket.on("disconnect", () => {
      console.log("🔌 Disconnected from server");
      this.updateConnectionStatus(false);
    });
  }

  setupEventListeners() {
    // Boutons de mode
    const prototypeBtn = document.getElementById("prototype-mode-btn");
    const realBtn = document.getElementById("real-mode-btn");
    if (prototypeBtn) {
      prototypeBtn.addEventListener("click", () =>
        this.changeMode("prototype")
      );
    }
    if (realBtn) {
      realBtn.addEventListener("click", () => this.changeMode("real"));
    }

    // Bouton d'exécution
    const executeBtn = document.getElementById("execute-btn");
    if (executeBtn) {
      executeBtn.addEventListener("click", () => this.executeAgentAction());
    }
  }

  changeMode(newMode) {
    if (newMode === this.currentMode) {
      console.log(`ℹ️ Already in ${newMode} mode`);
      return;
    }
    console.log(`🔄 Requesting mode change to: ${newMode}`);
    this.showLoading(`Switching to ${newMode} mode...`);
    this.setModeButtonsEnabled(false);
    this.socket.emit("change-mode", { mode: newMode });
  }

  setModeButtonsEnabled(enabled) {
    const prototypeBtn = document.getElementById("prototype-mode-btn");
    const realBtn = document.getElementById("real-mode-btn");
    [prototypeBtn, realBtn].forEach((btn) => {
      if (btn) {
        btn.disabled = !enabled;
        btn.style.opacity = enabled ? "1" : "0.6";
      }
    });
  }

  updateModeButtons(activeMode) {
    const prototypeBtn = document.getElementById("prototype-mode-btn");
    const realBtn = document.getElementById("real-mode-btn");
    if (!prototypeBtn || !realBtn) return;

    this.setModeButtonsEnabled(true);
    prototypeBtn.classList.remove("active");
    realBtn.classList.remove("active");

    if (activeMode === "prototype") prototypeBtn.classList.add("active");
    else realBtn.classList.add("active");
  }

  checkServerMode() {
    fetch("/api/mode")
      .then((res) => res.json())
      .then((data) => {
        console.log("📡 Server mode:", data.mode);
        this.currentMode = data.mode || "prototype";
        this.updateUIMode();
      })
      .catch((err) => console.error("Failed to get server mode:", err));
  }

  updateUIMode() {
    document.body.className = this.currentMode + "-mode";
    this.updateModeButtons(this.currentMode);

    const modeDisplay = document.getElementById("current-mode-display");
    if (modeDisplay) {
      modeDisplay.textContent =
        this.currentMode === "real"
          ? "Current: Real Mode ⛓️"
          : "Current: Prototype Mode 🔧";
    }

    this.updateModeBadge();
  }

  updateModeBadge() {
    let badge = document.getElementById("mode-badge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "mode-badge";
      document.body.appendChild(badge);
    }

    badge.textContent =
      this.currentMode === "real"
        ? "⛓️ REAL MODE - Live Qubic Network"
        : "🔧 PROTOTYPE MODE - Simulated Data";

    badge.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 8px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      color: white;
      background: ${this.currentMode === "real" ? "#27ae60" : "#667eea"};
    `;
  }

  loadAgentButtons() {
    const agentButtonsContainer = document.querySelector(".agent-buttons");
    if (!agentButtonsContainer) return;

    agentButtonsContainer.innerHTML = "";

    if (!this.agentsMetadata || Object.keys(this.agentsMetadata).length === 0) {
      agentButtonsContainer.innerHTML = "<p>No agents available</p>";
      return;
    }

    Object.entries(this.agentsMetadata).forEach(([agentId, agentMeta]) => {
      const button = document.createElement("button");
      button.className = `agent-btn ${
        this.currentAgent === agentId ? "active" : ""
      }`;
      button.innerHTML = `
        <span class="agent-icon">${agentMeta.icon}</span>
        <div class="agent-info">
          <div class="agent-name">${agentMeta.name}</div>
          <div class="agent-desc">${agentMeta.description}</div>
        </div>
      `;
      button.dataset.agent = agentId;
      button.addEventListener("click", () => this.selectAgent(agentId));
      agentButtonsContainer.appendChild(button);
    });

    if (this.currentAgent) this.loadAgentActions(this.currentAgent);
  }

  selectAgent(agentId) {
    this.currentAgent = agentId;
    document
      .querySelectorAll(".agent-btn")
      .forEach((btn) => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`[data-agent="${agentId}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    this.loadAgentActions(agentId);
  }

  loadAgentActions(agentId) {
    const actionButtonsContainer = document.getElementById("action-buttons");
    if (!actionButtonsContainer) return;

    const agentMeta = this.agentsMetadata[agentId];
    if (!agentMeta || !agentMeta.availableActions) return;

    actionButtonsContainer.innerHTML = "";

    agentMeta.availableActions.forEach((action) => {
      const button = document.createElement("button");
      button.className = "action-btn";
      button.textContent = this.formatActionName(action);
      button.dataset.action = action;
      button.addEventListener("click", () => this.selectAction(action));
      actionButtonsContainer.appendChild(button);
    });

    if (agentMeta.availableActions.length > 0) {
      this.selectAction(agentMeta.availableActions[0]);
    }
  }

  selectAction(action) {
    this.currentAction = action;
    document
      .querySelectorAll(".action-btn")
      .forEach((btn) => btn.classList.remove("active"));
    const activeBtn = document.querySelector(`[data-action="${action}"]`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  formatActionName(action) {
    return action
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  executeAgentAction() {
    if (!this.isConnected || !this.currentAction) {
      this.showError("Please connect and select an action first");
      return;
    }

    const parametersInput = document.getElementById("parameters-input");
    let parameters = {};
    try {
      if (parametersInput && parametersInput.value.trim()) {
        parameters = JSON.parse(parametersInput.value);
      }
    } catch {
      this.showError("Invalid JSON parameters");
      return;
    }

    this.showLoading("Executing agent action...");
    this.socket.emit("agent-request", {
      agentType: this.currentAgent,
      action: this.currentAction,
      parameters,
      requestId: "req_" + Date.now(),
    });
  }

  handleAgentResponse(response) {
    const resultsDisplay = document.getElementById("results-display");
    const lastUpdate = document.getElementById("last-update");

    if (lastUpdate) {
      lastUpdate.textContent = `Last update: ${new Date().toLocaleTimeString()}`;
    }

    if (resultsDisplay) {
      if (response.success)
        resultsDisplay.textContent = JSON.stringify(response.data, null, 2);
      else resultsDisplay.textContent = `Error: ${response.error}`;
    }
  }

  updateConnectionStatus(connected) {
    this.isConnected = connected;
    const statusElement = document.getElementById("connection-status");
    const executeBtn = document.getElementById("execute-btn");

    if (statusElement) {
      statusElement.textContent = connected
        ? "🟢 Connected to BIFlowQ"
        : "🔴 Disconnected";
      statusElement.className = connected
        ? "status connected"
        : "status disconnected";
    }
    if (executeBtn) executeBtn.disabled = !connected;
  }

  showLoading(message) {
    const resultsDisplay = document.getElementById("results-display");
    if (resultsDisplay) {
      resultsDisplay.innerHTML = `
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">${message}</div>
        </div>
      `;
    }
  }

  showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 50px;
      right: 10px;
      padding: 10px 15px;
      background: #3498db;
      color: white;
      border-radius: 5px;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  showError(message) {
    console.error("❌", message);
    alert("Error: " + message);
  }

  initializeUI() {
    this.updateConnectionStatus(false);
    this.updateModeButtons(this.currentMode);
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new BIFlowQApp();
});
