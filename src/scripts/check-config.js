require("dotenv").config();

function checkConfiguration() {
  console.log("🔍 Checking BIFlowQ Configuration...\n");

  const config = {
    REAL_QUBIC: process.env.REAL_QUBIC,
    QUBIC_NETWORK: process.env.QUBIC_NETWORK,
    QUBIC_PRIVATE_KEY: process.env.QUBIC_PRIVATE_KEY,
    QUBIC_CONTRACT_ADDRESS: process.env.QUBIC_CONTRACT_ADDRESS,
    PORT: process.env.PORT,
  };

  console.log("📋 CONFIGURATION STATUS:");
  console.log("════════════════════════════════════════");

  let allValid = true;

  Object.entries(config).forEach(([key, value]) => {
    const isValid =
      value &&
      !value.includes("your_private_key") &&
      !value.includes("0xYourDeployedContract");

    console.log(
      `${key}: ${isValid ? "✅" : "❌"} ${isValid ? "SET" : "NOT SET"}`
    );

    if (!isValid && key !== "COINGECKO_API_KEY") {
      allValid = false;
    }
  });

  console.log("════════════════════════════════════════");

  if (allValid) {
    console.log("🎉 Configuration is VALID!");
    console.log(
      `🔧 Mode: ${process.env.REAL_QUBIC === "true" ? "REAL" : "PROTOTYPE"}`
    );
  } else {
    console.log("❌ Configuration INCOMPLETE.");
    console.log("💡 Run: npm run generate:wallet");
  }
}

if (require.main === module) {
  checkConfiguration();
}

module.exports = checkConfiguration;

