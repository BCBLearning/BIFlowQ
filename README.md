
# 🚀 BIFlowQ - AI Agent Platform for Qubic

<div align="center">

![BIFlowQ Banner](src/frontend/assets/logo-biflowq.svg)

**Revolutionizing Decentralized AI Computation on Qubic Network**

[![Qubic Hackathon](https://img.shields.io/badge/Qubic-Hackathon-blue.svg)](https://lablab.ai/event/qubic-hack-the-future)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen.svg)]([https://your-codesandbox-url.csb.app](https://8x425h-3000.csb.app/))

*Multi-Agent AI Platform Leveraging Qubic's Decentralized Computational Power*

</div>

## 🌟 Overview

BIFlowQ is a groundbreaking **AI Agent Platform** that harnesses the power of Qubic's decentralized network to provide intelligent trading, analytics, monitoring, and research capabilities. Our platform enables users to interact with specialized AI agents that can process complex tasks on the Qubic blockchain, bringing decentralized AI computation to the masses.

Built specifically for the **Qubic Hack The Future** hackathon, BIFlowQ demonstrates real Qubic blockchain integration with a dual-mode architecture for both prototyping and production use.

## ✨ Key Features

### 🤖 Multi-Agent Intelligence
- **5 Specialized AI Agents** working in synergy
- **Agent-specific capabilities** for different use cases
- **Real-time communication** via WebSocket
- **Extensible architecture** for adding new agents

### 🔧 Dual Mode Operation
- **🔧 Prototype Mode**: Simulated data for rapid development and testing
- **⛓️ Real Mode**: Live Qubic network interaction with real blockchain data
- **Seamless switching** between modes without restart
- **Unified interface** across both modes

### 📊 Advanced Capabilities
- **Real-time market analysis** and trend prediction
- **Automated trading** and portfolio management
- **Network health monitoring** and alert systems
- **Research intelligence** and report generation
- **Qubic blockchain interaction** for AI task submission

### 🎨 User Experience
- **Modern, responsive interface**
- **Real-time WebSocket communication**
- **Interactive agent selection**
- **JSON parameter configuration**
- **Live results display**

## 🏗️ Architecture

### System Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    Frontend     │ ◄──►│   Backend API    │ ◄──►│  Qubic Network  │
│   (Modern UI)   │     │    (Node.js)     │     │   (Blockchain)  │
│                 │     │                  │     │                 │
│ • Real-time UI  │     │ • Express Server │     │ • Smart Contracts│
│ • Socket.io     │     │ • Socket.io      │     │ • AI Computation│
│ • Responsive    │     │ • Agent Core     │     │ • Transactions  │
└─────────────────┘     └──────────────────┘     └─────────────────┘

                ┌──────────────────┐
                │     AI Agents    │
                │                  │
                │ • Analytics      │
                │ • Trading        │
                │ • Monitoring     │
                │ • Research       │
                │ • Qubic Network  │
                └──────────────────┘


```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16.0 or higher
- **npm** or **yarn** package manager

### Installation & Running
```bash
# Clone the repository
git clone https://github.com/BCBLearning/BIFlowQ.git
cd BIFlowQ

# Install dependencies
npm install

# Start in prototype mode (recommended for first-time users)
npm start

# Access the application: http://localhost:3000
🤖 AI Agents
Agent	Icon	Description	Key Actions
Analytics	📊	Market analysis and trend prediction	analyze-market, predict-trend
Trading	💹	Automated trading and portfolio management	execute-trade, get-portfolio
Monitoring	🔍	Network health and system alerts	monitor-network, alert-system
Research	🔬	Market research and intelligence reports	research-topic, generate-report
Qubic Network	⛓️	Direct Qubic blockchain interaction	get-network-stats, submit-ai-task
Agent Usage Examples
javascript
// Market Analysis
{
  "agentType": "analytics",
  "action": "analyze-market",
  "parameters": {
    "market": "QUBIC",
    "timeframe": "24h"
  }
}

// Trade Execution
{
  "agentType": "trading", 
  "action": "execute-trade",
  "parameters": {
    "pair": "QUBIC/USDT",
    "side": "BUY",
    "amount": 1
  }
}
⚡ Dual Mode Operation
🔧 Prototype Mode (Default)
Simulated data for rapid development and testing

No blockchain connection required

Perfect for demonstrations and initial testing

All agents available with realistic mock data

⛓️ Real Mode (Qubic Network)
Live Qubic blockchain interaction

Real market data from external APIs

AI task submission to Qubic network

Transaction verification and tracking

Switching Between Modes
bash
# Switch to Real Mode
npm run setup:real
npm run generate:wallet
npm run start:real

# Or use the UI toggle in the application header
📥 Installation
Method 1: Local Development
bash
git clone https://github.com/BCBLearning/BIFlowQ.git
cd BIFlowQ
npm install
npm start
Method 2: CodeSandbox (Recommended for Hackathon)
Fork the CodeSandbox template

The application starts automatically

Access via provided CodeSandbox URL

⚙️ Configuration
Environment Variables
Create a .env file:

env
# Operation Mode (prototype/real)
REAL_QUBIC=false

# Qubic Network Configuration
QUBIC_NETWORK=testnet
QUBIC_PRIVATE_KEY=your_private_key_here
QUBIC_CONTRACT_ADDRESS=0xYourDeployedContractAddress

# External API Keys
COINGECKO_API_KEY=your_coingecko_api_key

# Server Configuration
PORT=3000
NODE_ENV=development
Configuration Scripts
bash
# Generate a new Qubic wallet
npm run generate:wallet

# Check configuration status
npm run check:config

# Setup real mode
npm run setup:real
📡 API Documentation
REST API Endpoints
Endpoint	Method	Description
/api/health	GET	System health check
/api/mode	GET	Get current operation mode
/api/mode	POST	Change operation mode
WebSocket Events
Event	Direction	Description
config-update	Server → Client	System configuration update
agent-request	Client → Server	Execute agent action
agent-response	Server → Client	Agent action result
mode-changed	Server → Client	Mode change notification
Example API Usage
javascript
// Get current mode
fetch('/api/mode')
  .then(response => response.json())
  .then(data => console.log('Current mode:', data.mode));

// Change to real mode
fetch('/api/mode', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ mode: 'real' })
});
🚀 Deployment
CodeSandbox (Recommended)
Import repository to CodeSandbox

Automatic deployment and URL generation

Perfect for hackathon demonstrations

Traditional Hosting
bash
# Build for production
NODE_ENV=production npm start

# Use process manager
npm install -g pm2
pm2 start server.js --name "biflowq"
🛠️ Technology Stack
Backend Technologies
Node.js - Runtime environment

Express.js - Web application framework

Socket.io - Real-time bidirectional communication

Axios - HTTP client for API calls

Frontend Technologies
Vanilla JavaScript (ES6+) - No framework dependencies

Modern CSS3 - Responsive design with flexbox/grid

Socket.io Client - Real-time frontend communication

Blockchain Integration
Qubic Network - Decentralized computation platform

Ethers.js - Blockchain interaction library

Development Tools
Nodemon - Development auto-reload

npm scripts - Build and deployment automation

👥 Team
Core Contributors
Role	Name	Contributions
Lead Developer	BesmaInfo	Full-stack development, Architecture, Qubic integration
AI Specialist	[Your Name]	Agent algorithms, Market analysis, Trading logic
Contact Information
Email: bouchareb.learning@google.com

GitHub: @BCBLearning

Project Repository: BIFlowQ GitHub

🤝 Contributing
We welcome contributions from the community!

Development Setup
bash
# Fork and clone
git clone https://github.com/BCBLearning/BIFlowQ.git
cd BIFlowQ

# Install dependencies
npm install

# Start development server
npm run dev
How to Contribute
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for full details.

text
MIT License

Copyright (c) 2024 BIFlowQ Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
🙏 Acknowledgments
Organizations
Qubic Foundation - For the revolutionary decentralized computation platform

Lablab.ai - For organizing the amazing hackathon opportunity

Open Source Community - For the incredible tools and libraries

Technologies & Libraries
Node.js & Express - Robust backend foundation

Socket.io - Seamless real-time communication

Qubic Network - Decentralized AI computation infrastructure

Ethers.js - Blockchain interaction capabilities

🔮 Future Roadmap
Short-term Goals
Additional AI agents for specialized tasks

Enhanced Qubic smart contract integration

Mobile-responsive interface improvements

Advanced trading strategies and backtesting

Long-term Vision
Decentralized agent marketplace

Cross-chain compatibility

Advanced machine learning integration

Community governance features

<div align="center">
🏆 Hackathon Submission
Built with ❤️ for the Qubic Hack The Future Hackathon

View Official Submission •
Live Demo •
Video Presentation

Revolutionizing decentralized AI computation, one agent at a time

```
