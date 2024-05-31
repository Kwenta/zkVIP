import '@nomiclabs/hardhat-ethers';
import '@nomicfoundation/hardhat-verify';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-contract-sizer';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';
import "@nomicfoundation/hardhat-foundry";

import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/types';

dotenv.config();

const DEFAULT_ENDPOINT = 'http://localhost:8545';
const DEFAULT_PRIVATE_KEY =
  process.env.DEFAULT_PRIVATE_KEY || 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const goerliEndpoint = process.env.GOERLI_ENDPOINT || DEFAULT_ENDPOINT;
const goerliPrivateKey = process.env.GOERLI_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
const sepoliaEndpoint = process.env.SEPOLIA_ENDPOINT || DEFAULT_ENDPOINT;
const sepoliaPrivateKey = process.env.SEPOLIA_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
const bscTestEndpoint = process.env.BSC_TEST_ENDPOINT || DEFAULT_ENDPOINT;
const bscTestPrivateKey = process.env.BSC_TEST_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
const avalancheTestEndpoint = process.env.AVALANCHE_TEST_ENDPOINT || DEFAULT_ENDPOINT;
const avalancheTestPrivateKey = process.env.AVALANCHE_TEST_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
const arbitrumSepoliaEndpoint = process.env.ARBITRUM_SEPOLIA_ENDPOINT || DEFAULT_ENDPOINT;
const arbitrumSepoliaPrivateKey = process.env.ARBITRUM_SEPOLIA_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
const holeskyEndpoint = process.env.HOLESKY_ENDPOINT || 'https://holesky.drpc.org';
const holeskyPrivateKey =  process.env.HOLESKY_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
const baseEndpoint = process.env.BASE_ENDPOINT || DEFAULT_ENDPOINT;
const basePrivateKey = process.env.BASE_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
const optimismEndpoint = process.env.OPTIMISM_ENDPOINT ||  process.env.DEFAULT_ENDPOINT;
const optimismPrivateKey = process.env.OPTIMISM_PRIVATE_KEY ||  process.env.DEFAULT_PRIVATE_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    // Testnets
    hardhat: {
      blockGasLimit: 120_000_000
    },
    localhost: { timeout: 600000 },
    goerli: {
      url: goerliEndpoint,
      accounts: [`0x${goerliPrivateKey}`]
    },
    sepolia: {
      url: sepoliaEndpoint,
      accounts: [`0x${sepoliaPrivateKey}`]
    },
    bscTest: {
      url: bscTestEndpoint,
      accounts: [`0x${bscTestPrivateKey}`]
    },
    avalancheTest: {
      url: avalancheTestEndpoint,
      accounts: [`0x${avalancheTestPrivateKey}`]
    },
    arbitrumSepolia: {
      url: arbitrumSepoliaEndpoint,
      accounts: [`0x${arbitrumSepoliaPrivateKey}`]
    },
    holesky:{
      url: holeskyEndpoint,
      accounts: [`0x${holeskyPrivateKey}`]
    },
    base: {
      url: baseEndpoint,
      accounts: [`0x${basePrivateKey}`]
    },
    optimism: {
      url: optimismEndpoint,
      accounts: [`0x${optimismPrivateKey}`]
    },
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 800
      },
      viaIR: true
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true' ? true : false,
    noColors: true,
    outputFile: 'reports/gas_usage/summary.txt'
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5'
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY as string,
      sepolia: process.env.ETHERSCAN_API_KEY as string,
      bscTestnet: process.env.BSCSCAN_API_KEY as string,
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY as string,
      arbitrumSepolia: process.env.ARBISCAN_API_KEY as string,
      holeskyTest: process.env.ETHERSCAN_API_KEY as string,
      base: process.env.BASESCAN_API_KEY as string,
      optimisticEthereum: process.env.OPSCAN_API_KEY as string,
    },
    customChains: [
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io"
        }
      },
      {
        network: "holeskyTest",
        chainId: 17000,
        urls: {
          apiURL: "https://api-holesky.etherscan.io/api",
          browserURL: "https://holesky.etherscan.io/"
        }
      }
    ]
  }
};

export default config;
