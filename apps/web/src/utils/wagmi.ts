import memoize from 'lodash/memoize'
import { createConfig, createStorage } from 'wagmi'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { APP_NAME } from 'config/constants'
import { chains, publicClient, transports } from './client'

export { chains, publicClient }

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string

export const injectedConnector = injected({
  shimDisconnect: false,
})

export const coinbaseConnector = coinbaseWallet({
  appName: APP_NAME,
  appLogoUrl: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : undefined,
  preference: { options: 'all', telemetry: false },
})

const walletConnectConnector = walletConnect({
  showQrModal: true,
  projectId: walletConnectProjectId,
})

export const metaMaskConnector = injected({
  target: 'metaMask',
  shimDisconnect: false,
})

export const noopStorage = {
  getItem: (_key: string) => '',
  setItem: (_key: string, _value: string) => undefined,
  removeItem: (_key: string) => undefined,
}

export const wagmiConfig = createConfig({
  chains,
  transports,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : noopStorage,
    key: 'wagmi_v2',
  }),
  connectors: [metaMaskConnector, injectedConnector, coinbaseConnector, walletConnectConnector],
})

export const walletConnectNoQrCodeConnector = wagmiConfig._internal.connectors.setup(
  walletConnect({
    showQrModal: false,
    projectId: walletConnectProjectId,
  }),
)

export const CHAIN_IDS = chains.map((chain) => chain.id)

export const isChainSupported = memoize((chainId: number) => (CHAIN_IDS as number[]).includes(chainId))
export const isChainTestnet = memoize(
  (chainId: number) => chains.find((chain) => chain.id === chainId)?.testnet ?? false,
)
