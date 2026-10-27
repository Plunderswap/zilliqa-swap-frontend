import { ChainId } from '@dex/chains'
import { Currency } from '@dex/sdk'
import { TokenAddressMap } from '@dex/token-lists'
import memoize from 'lodash/memoize'
import { Address, getAddress } from 'viem'
import { chains } from './wagmi'

// returns the checksummed address if the address is valid, otherwise returns undefined
export const safeGetAddress = memoize((value: any): Address | undefined => {
  try {
    let value_ = value
    if (typeof value === 'string' && !value.startsWith('0x')) {
      value_ = `0x${value}`
    }
    return getAddress(value_)
  } catch {
    return undefined
  }
})

export function getBlockExploreLink(
  data: string | number | undefined | null,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainIdOverride?: number,
): string {
  const chainId = chainIdOverride || ChainId.ZILLIQA
  const chain = chains.find((c) => c.id === chainId)
  const explorerUrl = chain?.blockExplorers?.default.url
  if (!explorerUrl || !data) return ''
  switch (type) {
    case 'transaction': {
      return `${explorerUrl}/tx/${data}`
    }
    case 'token': {
      return `${explorerUrl}/token/${data}`
    }
    case 'block': {
      return `${explorerUrl}/block/${data}`
    }
    case 'countdown': {
      return `${explorerUrl}/block/countdown/${data}`
    }
    default: {
      return `${explorerUrl}/address/${data}`
    }
  }
}

export function getBlockExploreName(chainIdOverride?: number) {
  const chainId = chainIdOverride || ChainId.ZILLIQA
  const chain = chains.find((c) => c.id === chainId)

  return chain?.blockExplorers?.default.name || 'Zilliqa Explorer'
}

// add 10%
export function calculateGasMargin(value: bigint, margin = 1000n): bigint {
  return (value * (10000n + margin)) / 10000n
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap<ChainId>, currency?: Currency): boolean {
  if (currency?.isNative) return true
  return Boolean(currency?.isToken && defaultTokens[currency.chainId]?.[currency.address])
}
