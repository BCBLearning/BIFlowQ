class BIFlowQApp {
  constructor() {
    this.socket = null;
    this.currentAgent = "analytics";
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
      this.currentMode = config.mode;
      this.agentsMetadata = config.agents;
      this.updateUIMode();
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
      // Revenir au mode précédent
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
    document
      .getElementById("prototype-mode-btn")
      .addEventListener("click", () => {
        this.changeMode("prototype");
      });

    document.getElementById("real-mode-btn").addEventListener("click", () => {
      this.changeMode("real");
    });

    // Bouton d'exécution
    document.getElementById("execute-btn").addEventListener("click", () => {
      this.executeAgentAction();
    });
  }

  changeMode(newMode) {
    if (newMode === this.currentMode) {
      console.log(`ℹ️ Already in ${newMode} mode`);
      return;
    }

    console.log(`🔄 Requesting mode change to: ${newMode}`);

    // Afficher un indicateur de chargement
    this.showLoading(`Switching to ${newMode} mode...`);

    // Désactiver les boutons pendant le changement
    this.setModeButtonsEnabled(false);

    // Envoyer la demande de changement de mode au serveur
    this.socket.emit("change-mode", { mode: newMode });
  }

  setModeButtonsEnabled(enabled) {
    const prototypeBtn = document.getElementById("prototype-mode-btn");
    const realBtn = document.getElementById("real-mode-btn");

    if (prototypeBtn && realBtn) {
      prototypeBtn.disabled = !enabled;
      realBtn.disabled = !enabled;

      if (!enabled) {
        prototypeBtn.style.opacity = "0.6";
        realBtn.style.opacity = "0.6";
      } else {
        prototypeBtn.style.opacity = "1";
        realBtn.style.opacity = "1";
      }
    }
  }

  updateModeButtons(activeMode) {
    const prototypeBtn = document.getElementById("prototype-mode-btn");
    const realBtn = document.getElementById("real-mode-btn");

    if (!prototypeBtn || !realBtn) return;

    // Réactiver les boutons
    this.setModeButtonsEnabled(true);

    // Mettre à jour les styles actifs
    prototypeBtn.classList.remove("active");
    realBtn.classList.remove("active");

    if (activeMode === "prototype") {
      prototypeBtn.classList.add("active");
    } else {
      realBtn.classList.add("active");
    }
  }

  checkServerMode() {
    // Récupérer le mode actuel du serveur
    fetch("/api/mode")
      .then((response) => response.json())
      .then((data) => {
        console.log("📡 Server mode:", data.mode);
        this.currentMode = data.mode;
        this.updateUIMode();
        this.updateConfigStatus(data.config);
      })
      .catch((error) => {
        console.error("Failed to get server mode:", error);
      });
  }

  updateConfigStatus(config) {
    const statusElement = document.getElementById("mode-config-status");
    if (!statusElement) return;

    if (this.currentMode === "real") {
      if (config && config.hasPrivateKey && config.hasContract) {
        statusElement.textContent = "✅ Configuration OK";
        statusElement.className = "config-status valid";
      } else {
        statusElement.textContent = "⚠️ Configuration needed";
        statusElement.className = "config-status warning";
      }
    } else {
      statusElement.textContent = "🔧 Using simulated data";
      statusElement.className = "config-status info";
    }
  }

  updateUIMode() {
    // Mettre à jour la classe du body
    document.body.className = this.currentMode + "-mode";

    // Mettre à jour les boutons de mode
    this.updateModeButtons(this.currentMode);

    // Mettre à jour l'affichage du mode actuel
    const modeDisplay = document.getElementById("current-mode-display");
    if (modeDisplay) {
      modeDisplay.textContent = `Current: ${
        this.currentMode === "real" ? "Real Mode ⛓️" : "Prototype Mode 🔧"
      }`;
    }

    // Mettre à jour le badge de mode
    this.updateModeBadge();

    console.log(`🎨 UI updated for ${this.currentMode} mode`);
  }

  updateModeBadge() {
    let badge = document.getElementById("mode-badge");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "mode-badge";
      document.body.appendChild(badge);
    }

    if (this.currentMode === "real") {
      badge.textContent = "⛓️ REAL MODE - Live Qubic Network";
      badge.style.background = "#27ae60";
    } else {
      badge.textContent = "🔧 PROTOTYPE MODE - Simulated Data";
      badge.style.background = "#667eea";
    }

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

      button.addEventListener("click", () => {
        this.selectAgent(agentId);
      });

      agentButtonsContainer.appendChild(button);
    });

    // Load actions for default agent
    this.loadAgentActions(this.currentAgent);
  }

  selectAgent(agentId) {
    this.currentAgent = agentId;

    document.querySelectorAll(".agent-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    const activeBtn = document.querySelector(`[data-agent="${agentId}"]`);
    if (activeBtn) {
      activeBtn.classList.add("active");
    }

    this.loadAgentActions(agentId);
  }

  loadAgentActions(agentId) {
    const actionButtonsContainer = document.getElementById("action-buttons");
    const agentMeta = this.agentsMetadata[agentId];

    if (!agentMeta || !actionButtonsContainer) return;

    actionButtonsContainer.innerHTML = "";

    agentMeta.availableActions.forEach((action) => {
      const button = document.createElement("button");
      button.className = "action-btn";
      button.textContent = this.formatActionName(action);
      button.dataset.action = action;

      button.addEventListener("click", () => {
        this.selectAction(action);
      });

      actionButtonsContainer.appendChild(button);
    });

    if (agentMeta.availableActions.length > 0) {
      this.selectAction(agentMeta.availableActions[0]);
    }
  }

  selectAction(action) {
    this.currentAction = action;

    document.querySelectorAll(".action-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    const activeBtn = document.querySelector(`[data-action="${action}"]`);
    if (activeBtn) {
      activeBtn.classList.add("active");
    }
  }

  formatActionName(action) {
    return action
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  executeAgentAction() {
    if (!this.isConnected || !this.currentAction) {
      this.showError("Please connect and select an action first");
      return;
    }

    const parametersInput = document.getElementById("parameters-input");
    if (!parametersInput) {
      this.showError("Parameters input not found");
      return;
    }

    const parametersText = parametersInput.value;
    let parameters = {};

    try {
      if (parametersText.trim()) {
        parameters = JSON.parse(parametersText);
      }
    } catch (e) {
      this.showError("Invalid JSON parameters");
      return;
    }

    const requestData = {
      agentType: this.currentAgent,
      action: this.currentAction,
      parameters: parameters,
      requestId: "req_" + Date.now(),
    };

    this.showLoading("Executing agent action...");
    this.socket.emit("agent-request", requestData);
  }

  handleAgentResponse(response) {
    const resultsDisplay = document.getElementById("results-display");
    const lastUpdate = document.getElementById("last-update");

    if (lastUpdate) {
      lastUpdate.textContent = `Last update: ${new Date().toLocaleTimeString()}`;
    }

    if (resultsDisplay) {
      if (response.success) {
        resultsDisplay.textContent = JSON.stringify(response.data, null, 2);
      } else {
        resultsDisplay.textContent = `Error: ${response.error}`;
        this.showError(response.error);
      }
    }
  }

  updateConnectionStatus(connected) {
    this.isConnected = connected;
    const statusElement = document.getElementById("connection-status");
    const executeBtn = document.getElementById("execute-btn");

    if (statusElement) {
      if (connected) {
        statusElement.textContent = "🟢 Connected to BIFlowQ";
        statusElement.className = "status connected";
      } else {
        statusElement.textContent = "🔴 Disconnected";
        statusElement.className = "status disconnected";
      }
    }

    if (executeBtn) {
      executeBtn.disabled = !connected;
    }
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
    console.log("💡", message);
    // Créer une notification temporaire
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

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
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

