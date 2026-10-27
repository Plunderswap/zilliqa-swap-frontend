import { ChainId } from '@dex/chains'
import { WNATIVE, pairV2ABI } from '@dex/sdk'
import { nonfungiblePositionManagerABI } from '@dex/v3-sdk'
import { useMemo } from 'react'
import { Abi, Address, erc20Abi as erc20ABI, getContract } from 'viem'
import { useWalletClient } from 'wagmi'

import { multicallABI } from 'config/abi/Multicall'
import { wethABI } from 'config/abi/weth'
import addresses from 'config/constants/contracts'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getMulticallAddress } from 'utils/addressHelpers'
import { viemClients } from 'utils/viem'

type UseContractOptions = {
  chainId?: ChainId
}

export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | Partial<Record<ChainId, Address>>,
  abi?: TAbi,
  options?: UseContractOptions,
) {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = options?.chainId || currentChainId
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    const address = typeof addressOrAddressMap === 'string' ? addressOrAddressMap : addressOrAddressMap[chainId]
    if (!address) return null

    const contract = getContract({
      abi,
      address,
      client: {
        public: viemClients[chainId],
        wallet: walletClient ?? undefined,
      },
    })
    return {
      ...contract,
      account: walletClient?.account,
      chain: walletClient?.chain,
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20ABI)
}

export function useWNativeContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, wethABI)
}

export function usePairContract(pairAddress?: Address, options?: UseContractOptions) {
  return useContract(pairAddress, pairV2ABI, options)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}

export function useV3NFTPositionManagerContract() {
  return useContract(addresses.nftPositionManager, nonfungiblePositionManagerABI)
}
