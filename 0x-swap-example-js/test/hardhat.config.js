require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      chainId: 31337, // ✅ Add this line
      forking: {
        url: "https://arbitrum-mainnet.infura.io/v3/c616a0840d4b4a8ebc088f29d56fefe1", // Add your Infura project URL
        blockNumber: 22433471, // Optional: fork from a specific block
      },
    },
  },
};
