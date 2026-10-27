import { ChainId } from '@dex/chains'
import { ERC20Token } from '@dex/sdk'

export const USDC_BSC = new ERC20Token(
  ChainId.BSC,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://www.centre.io/usdc',
)

export const USDC_ZIL = new ERC20Token(
  ChainId.ZILLIQA,
  '0xe59f97Fac09ee00AEEF320485ee45D5CcfbBC1E9',
  6,
  'zUSDC',
  'zUSDC',
  'https://www.centre.io/usdc',
)

export const USDC_TESTNET = new ERC20Token(
  ChainId.BSC_TESTNET,
  '0x64544969ed7EBf5f083679233325356EbE738930',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://www.centre.io/usdc',
)

export const USDC_ZIL_TESTNET = new ERC20Token(
  ChainId.ZILLIQA_TESTNET,
  '0x1fD09F6701a1852132A649fe9D07F2A3b991eCfA',
  18,
  'USDC',
  'Zilliqa-peg USD Coin',
  'https://www.centre.io/usdc',
)

export const USDC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD Coin',
)

export const USDC_GOERLI = new ERC20Token(
  ChainId.GOERLI,
  '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  6,
  'tUSDC',
  'test USD Coin',
)

export const USDT_BSC = new ERC20Token(
  ChainId.BSC,
  '0x55d398326f99059fF775485246999027B3197955',
  18,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const USDT_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const USDT_ZIL = new ERC20Token(
  ChainId.ZILLIQA,
  '0x2274005778063684fbB1BfA96a2b725dC37D75f9',
  6,
  'zUSDT',
  'Tether USD',
  'https://tether.to/',
)

export const KUSD_ZIL = new ERC20Token(
  ChainId.ZILLIQA,
  '0xE9df5b4b1134A3aadf693Db999786699B016239e',
  6,
  'kUSD',
  'Kaliljo USD',
  'https://kalijo.io/',
)

export const KUSD_ZIL_TESTNET = new ERC20Token(
  ChainId.ZILLIQA_TESTNET,
  '0xaD581eC62eA08831c8FE2Cd7A1113473fE40A057',
  6,
  'kUSD',
  'Kaliljo USD',
  'https://kalijo.io/',
)

export const BUSD_BSC = new ERC20Token(
  ChainId.BSC,
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const BUSD_TESTNET = new ERC20Token(
  ChainId.BSC_TESTNET,
  '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const BUSD_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const BUSD_GOERLI = new ERC20Token(
  ChainId.GOERLI,
  '0xb809b9B2dc5e93CB863176Ea2D565425B03c0540',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const BUSD = {
  [ChainId.ETHEREUM]: BUSD_ETH,
  [ChainId.GOERLI]: BUSD_GOERLI,
  [ChainId.BSC]: BUSD_BSC,
  [ChainId.BSC_TESTNET]: BUSD_TESTNET,
  [ChainId.ZKSYNC]: new ERC20Token(
    ChainId.ZKSYNC,
    '0x2039bb4116B4EFc145Ec4f0e2eA75012D6C0f181',
    18,
    'BUSD',
    'Binance USD',
  ),
}

export const USDC = {
  [ChainId.BSC]: USDC_BSC,
  [ChainId.BSC_TESTNET]: USDC_TESTNET,
  [ChainId.ZILLIQA]: USDC_ZIL,
  [ChainId.ZILLIQA_TESTNET]: USDC_ZIL_TESTNET,
  [ChainId.ETHEREUM]: USDC_ETH,
  [ChainId.GOERLI]: USDC_GOERLI,
  [ChainId.ZKSYNC]: new ERC20Token(ChainId.ZKSYNC, '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4', 6, 'USDC', 'USD Coin'),
  [ChainId.ZKSYNC_TESTNET]: new ERC20Token(
    ChainId.ZKSYNC_TESTNET,
    '0x0faF6df7054946141266420b43783387A78d82A9',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.ARBITRUM_ONE]: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.ARBITRUM_GOERLI]: new ERC20Token(
    ChainId.ARBITRUM_GOERLI,
    '0x179522635726710Dd7D2035a81d856de4Aa7836c',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.POLYGON_ZKEVM]: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0xA8CE8aee21bC2A48a5EF670afCc9274C7bbbC035',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.LINEA]: new ERC20Token(ChainId.LINEA, '0x176211869cA2b568f2A7D4EE941E073a821EE1ff', 6, 'USDC', 'USD Coin'),
  [ChainId.LINEA_TESTNET]: new ERC20Token(
    ChainId.LINEA_TESTNET,
    '0xf56dc6695cF1f5c364eDEbC7Dc7077ac9B586068',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.BASE_TESTNET]: new ERC20Token(
    ChainId.BASE_TESTNET,
    '0x853154e2A5604E5C74a2546E2871Ad44932eB92C',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.BASE]: new ERC20Token(ChainId.BASE, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6, 'USDC', 'USD Coin'),
  [ChainId.OPBNB_TESTNET]: new ERC20Token(
    ChainId.OPBNB_TESTNET,
    '0x845E27B8A4ad1Fe3dc0b41b900dC8C1Bb45141C3',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.SCROLL_SEPOLIA]: new ERC20Token(
    ChainId.SCROLL_SEPOLIA,
    '0x02a3e7E0480B668bD46b42852C58363F93e3bA5C',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.SEPOLIA]: new ERC20Token(
    ChainId.SEPOLIA,
    '0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.ARBITRUM_SEPOLIA]: new ERC20Token(
    ChainId.ARBITRUM_SEPOLIA,
    '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.BASE_SEPOLIA]: new ERC20Token(
    ChainId.BASE_SEPOLIA,
    '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    6,
    'USDC',
    'USD Coin',
  ),
}

export const USDT = {
  [ChainId.BSC]: USDT_BSC,
  [ChainId.ETHEREUM]: USDT_ETH,
  [ChainId.ZILLIQA]: USDT_ZIL,
  [ChainId.ARBITRUM_ONE]: new ERC20Token(
    ChainId.ARBITRUM_ONE,
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    6,
    'USDT',
    'Tether USD',
  ),
  [ChainId.POLYGON_ZKEVM]: new ERC20Token(
    ChainId.POLYGON_ZKEVM,
    '0x1E4a5963aBFD975d8c9021ce480b42188849D41d',
    6,
    'USDT',
    'Tether USD',
  ),
  [ChainId.POLYGON_ZKEVM_TESTNET]: new ERC20Token(
    ChainId.POLYGON_ZKEVM_TESTNET,
    '0x7379a261bC347BDD445484A91648Abf4A2BDEe5E',
    6,
    'USDT',
    'Tether USD',
  ),
  [ChainId.ZKSYNC]: new ERC20Token(
    ChainId.ZKSYNC,
    '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
    6,
    'USDT',
    'Tether USD',
  ),
  [ChainId.OPBNB_TESTNET]: new ERC20Token(
    ChainId.OPBNB_TESTNET,
    '0xCF712f20c85421d00EAa1B6F6545AaEEb4492B75',
    6,
    'USDT',
    'Tether USD',
  ),
  [ChainId.OPBNB]: new ERC20Token(
    ChainId.OPBNB,
    '0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3',
    18,
    'USDT',
    'Tether USD',
  ),
  [ChainId.LINEA]: new ERC20Token(ChainId.LINEA, '0xA219439258ca9da29E9Cc4cE5596924745e12B93', 6, 'USDT', 'Tether USD'),
}

export const WBTC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const STABLE_COIN = {
  [ChainId.ETHEREUM]: USDT[ChainId.ETHEREUM],
  [ChainId.GOERLI]: USDC[ChainId.GOERLI],
  [ChainId.BSC]: USDT[ChainId.BSC],
  [ChainId.BSC_TESTNET]: BUSD[ChainId.BSC_TESTNET],
  [ChainId.ARBITRUM_ONE]: USDC[ChainId.ARBITRUM_ONE],
  [ChainId.ARBITRUM_GOERLI]: USDC[ChainId.ARBITRUM_GOERLI],
  [ChainId.ZKSYNC]: USDC[ChainId.ZKSYNC],
  [ChainId.ZKSYNC_TESTNET]: USDC[ChainId.ZKSYNC_TESTNET],
  [ChainId.POLYGON_ZKEVM]: USDT[ChainId.POLYGON_ZKEVM],
  [ChainId.POLYGON_ZKEVM_TESTNET]: USDT[ChainId.POLYGON_ZKEVM_TESTNET],
  [ChainId.LINEA]: USDC[ChainId.LINEA],
  [ChainId.LINEA_TESTNET]: USDC[ChainId.LINEA_TESTNET],
  [ChainId.OPBNB]: USDT[ChainId.OPBNB],
  [ChainId.OPBNB_TESTNET]: USDT[ChainId.OPBNB_TESTNET],
  [ChainId.BASE]: USDC[ChainId.BASE],
  [ChainId.BASE_TESTNET]: USDC[ChainId.BASE_TESTNET],
  [ChainId.SCROLL_SEPOLIA]: USDC[ChainId.SCROLL_SEPOLIA],
  [ChainId.SEPOLIA]: USDC[ChainId.SEPOLIA],
  [ChainId.ARBITRUM_SEPOLIA]: USDC[ChainId.ARBITRUM_SEPOLIA],
  [ChainId.BASE_SEPOLIA]: USDC[ChainId.BASE_SEPOLIA],
  [ChainId.ZILLIQA]: USDC[ChainId.ZILLIQA],
  [ChainId.ZILLIQA_TESTNET]: USDC[ChainId.ZILLIQA_TESTNET],
} satisfies Record<ChainId, ERC20Token>
