import { ChainId } from '@dex/chains'
/* eslint-disable consistent-return */
import { useTranslation } from '@dex/localization'
import { useToast } from '@dex/uikit'
import replaceBrowserHistory from '@dex/utils/replaceBrowserHistory'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useCallback, useMemo } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { useSessionChainId } from './useSessionChainId'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

export function useSwitchNetworkLocal() {
  const [, setSessionChainId] = useSessionChainId()
  return useCallback(
    (chainId: number) => {
      setSessionChainId(chainId)
      replaceBrowserHistory('chain', chainId === ChainId.ZILLIQA ? null : CHAIN_QUERY_NAME[chainId])
    },
    [setSessionChainId],
  )
}

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const { switchChainAsync, isPending: _isLoading, switchChain, ...switchNetworkArgs } = useSwitchChain()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { isConnected } = useAccount()

  const switchNetworkLocal = useSwitchNetworkLocal()
  const isLoading = _isLoading || loading

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (isConnected) {
        if (isLoading) return
        setLoading(true)
        return switchChainAsync({ chainId })
          .then((c) => {
            // well token pocket
            if (window.ethereum?.isTokenPocket === true) {
              switchNetworkLocal(chainId)
              window.location.reload()
            }
            return c
          })
          .catch(() => {
            // TODO: review the error
            toastError(t('Error connecting, please retry and confirm in wallet!'))
          })
          .finally(() => setLoading(false))
      }
      return new Promise(() => {
        switchNetworkLocal(chainId)
      })
    },
    [isConnected, isLoading, setLoading, switchChainAsync, switchNetworkLocal, t, toastError],
  )

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected) {
        return switchChain({ chainId })
      }
      return switchNetworkLocal(chainId)
    },
    [isConnected, switchChain, switchNetworkLocal],
  )

  const canSwitch = useMemo(
    () =>
      isConnected
        ? !!switchChainAsync &&
          !(
            typeof window !== 'undefined' &&
            // @ts-ignore // TODO: add type later
            window.ethereum?.isMathWallet
          )
        : true,
    [isConnected, switchChainAsync],
  )

  return {
    ...switchNetworkArgs,
    pendingChainId: switchNetworkArgs.variables?.chainId,
    switchNetwork,
    switchNetworkAsync,
    isLoading,
    canSwitch,
  }
}
