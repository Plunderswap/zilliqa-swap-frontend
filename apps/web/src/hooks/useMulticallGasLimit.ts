import { ChainId } from '@dex/chains'
import { getGasLimitOnChain } from '@dex/multicall'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { getViemClients } from 'utils/viem'

export function useMulticallGasLimit(chainId?: ChainId) {
  const client = useMemo(() => getViemClients({ chainId }), [chainId])

  const { data: gasLimitOnChain } = useQuery({
    queryKey: [chainId],
    queryFn: async () => {
      if (!chainId) {
        throw new Error('chainId is not defined')
      }
      return getGasLimitOnChain({ chainId, client })
    },
    enabled: Boolean(chainId && client),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  })

  return gasLimitOnChain
}
