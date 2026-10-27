import { ChainId } from '@dex/chains'
import { Token } from '@dex/sdk'
import {
  arbSepoliaTokens,
  arbitrumGoerliTokens,
  arbitrumTokens,
  baseSepoliaTokens,
  baseTestnetTokens,
  baseTokens,
  bscTestnetTokens,
  bscTokens,
  ethereumTokens,
  goerliTestnetTokens,
  lineaTestnetTokens,
  lineaTokens,
  opBnbTestnetTokens,
  opBnbTokens,
  polygonZkEvmTestnetTokens,
  polygonZkEvmTokens,
  scrollSepoliaTokens,
  zilliqaTestnetTokens,
  zilliqaTokens,
  zkSyncTestnetTokens,
  zksyncTokens,
} from '@dex/tokens'

export const usdGasTokensByChain = {
  [ChainId.ETHEREUM]: [ethereumTokens.usdt],
  [ChainId.GOERLI]: [goerliTestnetTokens.usdc],
  [ChainId.BSC]: [bscTokens.usdt],
  [ChainId.BSC_TESTNET]: [bscTestnetTokens.usdt],
  [ChainId.ARBITRUM_ONE]: [arbitrumTokens.usdc],
  [ChainId.ARBITRUM_GOERLI]: [arbitrumGoerliTokens.usdc],
  [ChainId.POLYGON_ZKEVM]: [polygonZkEvmTokens.usdt],
  [ChainId.POLYGON_ZKEVM_TESTNET]: [polygonZkEvmTestnetTokens.usdt],
  [ChainId.ZKSYNC]: [zksyncTokens.usdc],
  [ChainId.ZKSYNC_TESTNET]: [zkSyncTestnetTokens.usdc],
  [ChainId.LINEA]: [lineaTokens.usdc],
  [ChainId.LINEA_TESTNET]: [lineaTestnetTokens.usdc],
  [ChainId.OPBNB]: [opBnbTokens.usdt],
  [ChainId.OPBNB_TESTNET]: [opBnbTestnetTokens.usdc],
  [ChainId.BASE]: [baseTokens.usdc],
  [ChainId.BASE_TESTNET]: [baseTestnetTokens.usdc],
  [ChainId.SCROLL_SEPOLIA]: [scrollSepoliaTokens.usdc],
  [ChainId.SEPOLIA]: [scrollSepoliaTokens.usdc],
  [ChainId.ARBITRUM_SEPOLIA]: [arbSepoliaTokens.usdc],
  [ChainId.BASE_SEPOLIA]: [baseSepoliaTokens.usdc],
  [ChainId.ZILLIQA]: [zilliqaTokens.usdt],
  [ChainId.ZILLIQA_TESTNET]: [zilliqaTestnetTokens.usdc],
} satisfies Record<ChainId, Token[]>

export * from './stableSwap'
export * from './v2'
export * from './v3'
