module.exports = {
  networks: {
    mainnet: {
      rpcUrl: "https://rpc.qubic.li",
      wsUrl: "wss://ws.qubic.li",
      chainId: 1,
      explorer: "https://explorer.qubic.li",
    },
    testnet: {
      rpcUrl: "https://testnet.rpc.qubic.li",
      wsUrl: "wss://testnet.ws.qubic.li",
      chainId: 1337,
      explorer: "https://testnet.explorer.qubic.li",
    },
    devnet: {
      rpcUrl: "https://devnet.rpc.qubic.li",
      wsUrl: "wss://devnet.ws.qubic.li",
      chainId: 1338,
      explorer: "https://devnet.explorer.qubic.li",
    },
  },

  contracts: {
    aiComputation: "0x0000000000000000000000000000000000001001",
    staking: "0x0000000000000000000000000000000000001002",
  },

  economics: {
    minStake: "1000000000000000000",
    computationPrice: "100000000000000000",
    gasPrice: "1000000000",
  },
};

