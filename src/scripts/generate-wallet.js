const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

function generateWallet() {
  console.log("🔐 Generating Qubic wallet...\n");

  const wallet = ethers.Wallet.createRandom();

  console.log("✅ WALLET GENERATED SUCCESSFULLY!");
  console.log("════════════════════════════════════════");
  console.log("📧 Address:", wallet.address);
  console.log("🔑 Private Key:", wallet.privateKey);
  console.log("📝 Mnemonic:", wallet.mnemonic.phrase);
  console.log("════════════════════════════════════════\n");

  const envPath = path.join(__dirname, "../.env");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
    envContent = envContent.replace(
      /QUBIC_PRIVATE_KEY=.*/,
      `QUBIC_PRIVATE_KEY=${wallet.privateKey}`
    );
    envContent = envContent.replace(
      /QUBIC_CONTRACT_ADDRESS=.*/,
      `QUBIC_CONTRACT_ADDRESS=${wallet.address}`
    );
  } else {
    envContent = `REAL_QUBIC=true
QUBIC_NETWORK=testnet
QUBIC_PRIVATE_KEY=${wallet.privateKey}
QUBIC_CONTRACT_ADDRESS=${wallet.address}
PORT=3000
NODE_ENV=development`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("💾 Configuration saved to .env");

  return wallet;
}

if (require.main === module) {
  generateWallet();
}

module.exports = generateWallet;

