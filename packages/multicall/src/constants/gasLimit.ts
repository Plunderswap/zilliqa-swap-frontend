import { ChainId } from '@dex/chains'

export const DEFAULT_GAS_LIMIT = 1500000n

export const DEFAULT_GAS_LIMIT_BY_CHAIN: { [key in ChainId]?: bigint } = {
  [ChainId.BSC]: 100000000n,
  [ChainId.ZKSYNC]: 500000000n,
  [ChainId.POLYGON_ZKEVM]: 1500000n,
  [ChainId.BASE]: 60000000n,
  [ChainId.OPBNB]: 100_000_000n,
  [ChainId.OPBNB_TESTNET]: 100_000_000n,
  [ChainId.ZILLIQA]: 500_000_000n, // 100M gas limit total
  [ChainId.ZILLIQA_TESTNET]: 500_000_000n, // Same fo
}

export const DEFAULT_GAS_BUFFER = 0n

export const DEFAULT_GAS_BUFFER_BY_CHAIN: { [key in ChainId]?: bigint } = {
  [ChainId.BSC]: DEFAULT_GAS_BUFFER,
  [ChainId.POLYGON_ZKEVM]: 0n,
}
