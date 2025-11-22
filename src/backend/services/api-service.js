const axios = require("axios");

class ApiService {
  constructor() {
    this.coingeckoBaseURL = "https://api.coingecko.com/api/v3";
  }

  async getCoinGeckoPrice(symbol = "qubic") {
    try {
      const response = await axios.get(
        `${this.coingeckoBaseURL}/simple/price?ids=${symbol}&vs_currencies=usd&include_24hr_change=true`,
        { timeout: 10000 }
      );
      return response.data[symbol];
    } catch (error) {
      console.error("CoinGecko API error:", error.message);
      return null;
    }
  }

  async getMultiplePrices(symbols = ["qubic", "bitcoin", "ethereum"]) {
    try {
      const response = await axios.get(
        `${this.coingeckoBaseURL}/simple/price?ids=${symbols.join(
          ","
        )}&vs_currencies=usd&include_24hr_change=true`,
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.error("CoinGecko multi-price error:", error.message);
      return {};
    }
  }
}

module.exports = ApiService;

