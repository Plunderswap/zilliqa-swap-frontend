/* eslint-disable no-param-reassign */
import { ChainId } from '@dex/chains'
import { ERC20Token } from '@dex/sdk'
import { Currency, NativeCurrency } from '@dex/swap-sdk-core'

import { TokenAddressMap } from '@dex/token-lists'
import { UnsafeCurrency } from 'config/constants/types'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import {
  combinedTokenMapFromActiveUrlsAtom,
  combinedTokenMapFromOfficialsUrlsAtom,
  useUnsupportedTokenList,
  useWarningTokenList,
} from 'state/lists/hooks'
import { safeGetAddress } from 'utils'
import { erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'
import useUserAddedTokens from '../state/user/hooks/useUserAddedTokens'
import { useActiveChainId } from './useActiveChainId'
import useNativeCurrency from './useNativeCurrency'

const mapWithoutUrls = (tokenMap?: TokenAddressMap<ChainId>, chainId?: number) => {
  if (!tokenMap || !chainId) return {}
  return Object.keys(tokenMap[chainId] || {}).reduce<{ [address: string]: ERC20Token }>((newMap, address) => {
    const checksumAddress = safeGetAddress(address)

    if (checksumAddress && !newMap[checksumAddress]) {
      newMap[checksumAddress] = tokenMap[chainId][address].token
    }

    return newMap
  }, {})
}

/**
 * Returns all tokens that are from active urls and user added tokens
 */
export function useAllTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useActiveChainId()
  const tokenMap = useAtomValue(combinedTokenMapFromActiveUrlsAtom)
  const userAddedTokens = useUserAddedTokens()
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: ERC20Token }>(
          (tokenMap_, token) => {
            const checksumAddress = safeGetAddress(token.address)

            if (checksumAddress) {
              tokenMap_[checksumAddress] = token
            }

            return tokenMap_
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          mapWithoutUrls(tokenMap, chainId),
        )
    )
  }, [userAddedTokens, tokenMap, chainId])
}

/**
 * Returns all tokens that are from officials token list and user added tokens
 */
export function useOfficialsAndUserAddedTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useActiveChainId()
  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom)

  const userAddedTokens = useUserAddedTokens()
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: ERC20Token }>(
          (tokenMap_, token) => {
            const checksumAddress = safeGetAddress(token.address)

            if (checksumAddress) {
              tokenMap_[checksumAddress] = token
            }

            return tokenMap_
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          mapWithoutUrls(tokenMap, chainId),
        )
    )
  }, [userAddedTokens, tokenMap, chainId])
}

export function useUnsupportedTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useActiveChainId()
  const unsupportedTokensMap = useUnsupportedTokenList()
  return useMemo(() => mapWithoutUrls(unsupportedTokensMap, chainId), [unsupportedTokensMap, chainId])
}

export function useWarningTokens(): { [address: string]: ERC20Token } {
  const warningTokensMap = useWarningTokenList()
  const { chainId } = useActiveChainId()
  return useMemo(() => mapWithoutUrls(warningTokensMap, chainId), [warningTokensMap, chainId])
}

export function useIsTokenActive(token: ERC20Token | undefined | null): boolean {
  const activeTokens = useAllTokens()

  if (!activeTokens || !token) {
    return false
  }

  const tokenAddress = safeGetAddress(token.address)

  return Boolean(tokenAddress && !!activeTokens[tokenAddress])
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens()

  if (!currency?.equals) {
    return false
  }

  return !!userAddedTokens.find((token) => currency?.equals(token))
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): ERC20Token | undefined | null {
  const { chainId } = useActiveChainId()
  const unsupportedTokens = useUnsupportedTokens()
  const tokens = useAllTokens()

  const address = safeGetAddress(tokenAddress)

  const token: ERC20Token | undefined = address ? tokens[address] : undefined

  const { data, isLoading } = useReadContracts({
    contracts: [
      { address, abi: erc20Abi, functionName: 'decimals', chainId },
      { address, abi: erc20Abi, functionName: 'symbol', chainId },
      { address, abi: erc20Abi, functionName: 'name', chainId },
    ],
    query: { enabled: Boolean(!!address && !token) },
  })

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (unsupportedTokens[address]) return undefined
    if (isLoading) return null
    if (data) {
      const decimals = data[0].status === 'success' ? data[0].result : undefined
      const symbol = data[1].status === 'success' ? data[1].result : undefined
      const name = data[2].status === 'success' ? data[2].result : undefined
      if (decimals === undefined) return undefined

      return new ERC20Token(chainId, address, decimals, symbol ?? 'UNKNOWN', name ?? 'Unknown Token')
    }
    return undefined
  }, [token, chainId, address, isLoading, data, unsupportedTokens])
}

export function useCurrency(currencyId: string | undefined): UnsafeCurrency {
  const native: NativeCurrency = useNativeCurrency()
  const isNative = currencyId?.toUpperCase() === native.symbol?.toUpperCase()

  const token = useToken(isNative ? undefined : currencyId)
  return isNative ? native : token
}
