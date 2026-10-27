import { ChainId } from '@dex/chains'

import { StableSwapPair } from './types'

export function getStableSwapPairs(chainId: ChainId): StableSwapPair[] {
  return []
}

export const stableSwapPairsByChainId: Record<number, StableSwapPair[]> = {}
