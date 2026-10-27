import { ChainId } from '@dex/chains'
import { Native, NativeCurrency } from '@dex/sdk'
import { useMemo } from 'react'
import { useActiveChainId } from './useActiveChainId'

export default function useNativeCurrency(overrideChainId?: ChainId): NativeCurrency {
  const { chainId } = useActiveChainId()
  return useMemo(() => {
    try {
      return Native.onChain(overrideChainId ?? chainId ?? ChainId.ZILLIQA)
    } catch {
      return Native.onChain(ChainId.ZILLIQA)
    }
  }, [overrideChainId, chainId])
}
