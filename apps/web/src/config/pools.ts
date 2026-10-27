import { ChainId } from '@dex/chains'

// Revalidate interval in milliseconds
export const POOLS_FAST_REVALIDATE = {
  [ChainId.ZILLIQA_TESTNET]: 10_000,
  [ChainId.ZILLIQA]: 10_000,
} as const satisfies Partial<Record<ChainId, number>>

// Revalidate interval in milliseconds
export const POOLS_NORMAL_REVALIDATE = {
  [ChainId.ZILLIQA_TESTNET]: 15_000,
  [ChainId.ZILLIQA]: 15_000,
} as const satisfies Partial<Record<ChainId, number>>

export const POOLS_SLOW_REVALIDATE = {
  [ChainId.ZILLIQA_TESTNET]: 20_000,
  [ChainId.ZILLIQA]: 20_000,
} as const satisfies Partial<Record<ChainId, number>>
