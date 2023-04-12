require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const MNEMONIC_KEY = process.env.MNEMONIC_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: {
        mnemonic: MNEMONIC_KEY,
        path: "m/44'/52752'/0'/0",
      },
      chainId: 44787,
    },
  },
  solidity: "0.8.18",
};
