import { useName } from 'hooks/useName'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

export const useDomainNameForAddress = (address?: Address | string, fetchData = true) => {
  const { chain } = useAccount()
  const { data: domainName, isLoading } = useName({
    address: address as Address,
    chain,
    enabled: fetchData && Boolean(address),
  })

  return { domainName, isLoading }
}
