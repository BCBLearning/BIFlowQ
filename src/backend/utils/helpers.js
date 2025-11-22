class Helpers {
  static formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
  }

  static generateId(prefix = "") {
    return prefix + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  static formatTimestamp(timestamp = null) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.toISOString();
  }

  static validateJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }
}

module.exports = Helpers;

