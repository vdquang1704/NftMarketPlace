const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

module.exports = {
  networks: {
  
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 8545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
   
    rinkeby: {
      provider: () => new HDWalletProvider(
        process.env.privateKeys,
        process.env.RINKEBY_INF_URL
      ),
      network_id: 4,
      skipDryRun: true
    },

    kovan: {
      provider: () => new HDWalletProvider(
        process.env.privateKeys,
        process.env.KOVAN_INF_URL
      ),
      network_id: 42,
      skipDryRun: true //true if you don't want to test run the migration locally before the actual migration
    },

    goerli: {
      provider: () => new
      HDWalletProvider(
        process.env.privateKeys,
        process.env.GOERLI_INF_URL
      ),
      network_id: 5,
      skipDryRun: true
    },
   
    bscTestnet: {
      provider: () => new HDWalletProvider(
        process.env.privateKeys,
        process.env.BSC_RPC_URL
    ),
    network_id: 97,
    skipDryRun: true
  }

},

  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    bscscan: process.env.BSCSCAN_API_KEY
    
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.16",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
};
