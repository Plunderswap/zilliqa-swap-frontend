import { BIG_ZERO } from '@dex/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Address, erc20Abi as erc20ABI } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

const useTokenBalance = (tokenAddress: Address) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, status, ...rest } = useReadContract({
    chainId,
    abi: erc20ABI,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [account || '0x'],
    query: { enabled: !!account },
  })

  return {
    ...rest,
    fetchStatus: status,
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
  }
}

export default useTokenBalance
