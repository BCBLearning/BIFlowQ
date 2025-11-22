require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function setupRealMode() {
  console.log("🚀 BIFlowQ Real Mode Setup");
  console.log("════════════════════════════════════════\n");

  const envPath = path.join(__dirname, "../.env");

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, "");
  }

  let envContent = fs.readFileSync(envPath, "utf8");

  // Ensure REAL_QUBIC is true
  if (!envContent.includes("REAL_QUBIC=true")) {
    if (envContent.includes("REAL_QUBIC=")) {
      envContent = envContent.replace(/REAL_QUBIC=.*/, "REAL_QUBIC=true");
    } else {
      envContent += "\nREAL_QUBIC=true\n";
    }
  }

  // Ensure network is set
  if (!envContent.includes("QUBIC_NETWORK=")) {
    envContent += "QUBIC_NETWORK=testnet\n";
  }

  fs.writeFileSync(envPath, envContent);

  console.log("✅ Real mode configured!");
  console.log("🎯 Next steps:");
  console.log("   1. Run: npm run generate:wallet");
  console.log("   2. Run: npm run check:config");
  console.log("   3. Run: npm run start:real");
}

if (require.main === module) {
  setupRealMode().catch(console.error);
}

module.exports = setupRealMode;

