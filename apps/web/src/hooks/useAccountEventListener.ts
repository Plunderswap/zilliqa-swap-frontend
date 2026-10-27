import replaceBrowserHistory from '@dex/utils/replaceBrowserHistory'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { ExtendEthereum } from 'global'
import { useEffect, useMemo, useRef } from 'react'
import { useAccount, useAccountEffect } from 'wagmi'
import { useAppDispatch } from '../state'
import { clearUserStates } from '../utils/clearUserStates'
import { useActiveChainId } from './useActiveChainId'
import { useSessionChainId } from './useSessionChainId'

export const useAccountEventListener = () => {
  const { chainId } = useActiveChainId()
  const { address, chainId: connectedChainId } = useAccount()
  const previousChainId = useRef<number | undefined>(undefined)
  const [, setSessionChainId] = useSessionChainId()
  const dispatch = useAppDispatch()

  const isBloctoMobileApp = useMemo(
    () => typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto),
    [],
  )

  useEffect(() => {
    if (address && connectedChainId && previousChainId.current && previousChainId.current !== connectedChainId) {
      replaceBrowserHistory('chain', CHAIN_QUERY_NAME[connectedChainId])
      setSessionChainId(connectedChainId)
      if (!isBloctoMobileApp) {
        clearUserStates(dispatch, { chainId, newChainId: connectedChainId })
      }
    }
    previousChainId.current = connectedChainId
  }, [address, chainId, connectedChainId, dispatch, isBloctoMobileApp, setSessionChainId])

  useAccountEffect({
    onDisconnect() {
      clearUserStates(dispatch, { chainId })
    },
  })
}
