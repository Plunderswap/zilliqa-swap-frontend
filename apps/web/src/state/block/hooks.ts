import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
// eslint-disable-next-line camelcase
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { viemClients } from 'utils/viem'
import { useBlockNumber, usePublicClient } from 'wagmi'
import { useEffect } from 'react'

const REFRESH_BLOCK_INTERVAL = 6000

export const usePollBlockNumber = () => {
  const queryClient = useQueryClient()
  const { chainId } = useActiveChainId()
  const { data: blockNumber } = useBlockNumber({
    chainId,
    watch: true,
  })

  useEffect(() => {
    if (blockNumber !== undefined) {
      queryClient.setQueryData(['blockNumber', chainId], Number(blockNumber))
      if (
        !queryClient.getQueryCache().find({
          queryKey: ['initialBlockNumber', chainId],
        })?.state?.data
      ) {
        queryClient.setQueryData(['initialBlockNumber', chainId], Number(blockNumber))
      }
      if (
        !queryClient.getQueryCache().find({
          queryKey: ['initialBlockTimestamp', chainId],
        })?.state?.data
      ) {
        const fetchInitialBlockTimestamp = async () => {
          const provider = viemClients[chainId as keyof typeof viemClients]
          if (provider) {
            const block = await provider.getBlock({ blockNumber })
            queryClient.setQueryData(['initialBlockTimestamp', chainId], Number(block.timestamp))
          }
        }
        fetchInitialBlockTimestamp()
      }
    }
  }, [blockNumber, chainId, queryClient])

  useQuery({
    queryKey: ['blockNumberFetcher', chainId],

    queryFn: async () => {
      queryClient.setQueryData(['blockNumber', chainId], Number(blockNumber))
      return null
    },

    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  // Never store NaN (blockNumber not yet available): NaN !== NaN breaks
  // react-query result memoization and causes an infinite re-render loop
  // in every `enabled: false` subscriber until the next interval refetch.
  useQuery({
    queryKey: [FAST_INTERVAL, 'blockNumber', chainId],
    queryFn: async () => Number(blockNumber),
    enabled: Boolean(chainId && blockNumber !== undefined),
    refetchInterval: FAST_INTERVAL,
  })

  useQuery({
    queryKey: [SLOW_INTERVAL, 'blockNumber', chainId],
    queryFn: async () => Number(blockNumber),
    enabled: Boolean(chainId && blockNumber !== undefined),
    refetchInterval: SLOW_INTERVAL,
  })
}

export const useCurrentBlock = (): number => {
  const { chainId } = useActiveChainId()
  const queryClient = useQueryClient()
  const { data: currentBlock = 0 } = useQuery({
    queryKey: ['blockNumber', chainId],
    queryFn: () => queryClient.getQueryData<number>(['blockNumber', chainId]) ?? 0,
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  return Number(currentBlock)
}

export const useChainCurrentBlock = (chainId: number): number => {
  const { chainId: activeChainId } = useActiveChainId()
  const provider = usePublicClient({ chainId })

  const { data: currentBlock = 0 } = useQuery({
    queryKey: activeChainId === chainId ? ['blockNumber', chainId] : ['chainBlockNumber', chainId],

    queryFn: async () => {
      const blockNumber = await provider!.getBlockNumber()
      return Number(blockNumber)
    },
    enabled: activeChainId !== chainId,
    ...(activeChainId !== chainId && { refetchInterval: REFRESH_BLOCK_INTERVAL }),
  })
  return currentBlock
}

export const useInitialBlock = (): number => {
  const { chainId } = useActiveChainId()
  const queryClient = useQueryClient()
  const { data: initialBlock = 0 } = useQuery({
    queryKey: ['initialBlockNumber', chainId],
    queryFn: () => queryClient.getQueryData<number>(['initialBlockNumber', chainId]) ?? 0,
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  return Number(initialBlock)
}

export const useInitialBlockTimestamp = (): number => {
  const { chainId } = useActiveChainId()
  const queryClient = useQueryClient()
  const { data: initialBlockTimestamp = 0 } = useQuery({
    queryKey: ['initialBlockTimestamp', chainId],
    queryFn: () => queryClient.getQueryData<number>(['initialBlockTimestamp', chainId]) ?? 0,
    enabled: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
  return Number(initialBlockTimestamp)
}
