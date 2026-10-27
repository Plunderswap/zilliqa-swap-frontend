import { OnChainProvider, PoolProvider } from '../../types'
import { createPoolProviderWithCache } from './poolProviderWithCache'
import { getCandidatePools } from './getCandidatePools'

export interface HybridPoolProviderConfig {
  onChainProvider?: OnChainProvider
}

export function createHybridPoolProvider({ onChainProvider }: HybridPoolProviderConfig): PoolProvider {
  const hybridPoolProvider: PoolProvider = {
    getCandidatePools: async (params) => {
      return getCandidatePools({ ...params, onChainProvider })
    },
  }

  return createPoolProviderWithCache(hybridPoolProvider)
}
