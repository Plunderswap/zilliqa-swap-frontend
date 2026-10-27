import { useQuery } from '@tanstack/react-query'
import { getName } from 'utils/getName'
import { Address, Chain } from 'viem'

export const useName = ({ address, chain, enabled }: { address: Address; chain?: Chain; enabled: boolean }) => {
  return useQuery({
    queryKey: ['zil-name', address, chain?.id],
    queryFn: () => getName({ address, chain: chain as Chain }),
    enabled: enabled && Boolean(address && chain),
    refetchOnWindowFocus: false,
  })
}
