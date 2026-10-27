/* eslint-disable no-console */
import { useTranslation } from '@dex/localization'
import { useToast } from '@dex/uikit'
import { useCallback } from 'react'
import getWeb3Provider from 'utils/mpBridge'
import { useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

const miniProgram = injected({
  target: {
    id: 'miniProgram',
    name: 'Mini Program',
    provider: () => getWeb3Provider() as any,
  },
})

export const getAccount = async () => {
  const provider = getWeb3Provider()
  const accounts = await provider.request({ method: 'eth_accounts' })
  return (accounts as string[])[0]
}

const useActive = () => {
  const { connectAsync } = useConnect()
  return useCallback(() => connectAsync({ connector: miniProgram }), [connectAsync])
}

export const useEagerConnect = () => undefined

export const useActiveHandle = () => {
  const handleActive = useActive()
  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  return async (showToast = true) => {
    await handleActive()
    const address = await getAccount()
    if (address && showToast) {
      toastSuccess(t('Success'), 'Wallet connected')
    }
  }
}

export default useEagerConnect
