import { WalletConfigV2 } from '@dex/ui-wallets'
import { WalletFilledIcon } from '@dex/uikit'
import type { ExtendEthereum } from 'global'
import { walletConnectNoQrCodeConnector } from '../utils/wagmi'

export enum ConnectorNames {
  MetaMask = 'metaMask',
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  WalletLink = 'coinbaseWallet',
}

const createQrCode = (chainId: number, connect) => async () => {
  connect({ connector: walletConnectNoQrCodeConnector, chainId })

  const r = (await walletConnectNoQrCodeConnector.getProvider()) as any
  return new Promise<string>((resolve) => {
    r.on('display_uri', (uri) => {
      resolve(String(uri))
    })
  })
}

const isMetamaskInstalled = () => {
  if (typeof window === 'undefined') {
    return false
  }

  if (window.ethereum?.isMetaMask) {
    return true
  }

  if (window.ethereum?.providers?.some((p) => p.isMetaMask)) {
    return true
  }

  return false
}

const walletsConfig = ({
  chainId,
  connect,
}: {
  chainId: number
  connect: (connectorID: ConnectorNames) => void
}): WalletConfigV2<ConnectorNames>[] => {
  const qrCode = createQrCode(chainId, connect)
  const metamaskDappLink = `https://metamask.app.link/dapp/${typeof window !== 'undefined' ? window.location.host : ''}/`
  return [
    {
      id: 'metamask',
      title: 'Metamask',
      icon: `/images/wallets/metamask.png`,
      get installed() {
        return isMetamaskInstalled()
      },
      connectorId: ConnectorNames.MetaMask,
      deepLink: metamaskDappLink,
      qrCode,
      downloadLink: metamaskDappLink,
    },
    {
      id: 'zilpay',
      title: 'ZilPay',
      icon: `/images/wallets/zilpay.png`,
      get installed() {
        return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isZilPay)
      },
      connectorId: ConnectorNames.Injected,
      guide: {
        desktop: 'https://zilpay.io/',
      },
      downloadLink: 'https://zilpay.io/',
    },
    {
      id: 'torch',
      title: 'Torch',
      icon: `/images/wallets/torch.png`,
      get installed() {
        return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isTorch)
      },
      connectorId: ConnectorNames.Injected,
      guide: {
        desktop: 'https://torchwallet.io/',
      },
      downloadLink: 'https://chromewebstore.google.com/detail/torch/bcpcfajkbagnicoppbogbgemdodphjne',
    },
    {
      id: 'walletconnect',
      title: 'WalletConnect',
      icon: `/images/wallets/walletconnect.png`,
      connectorId: ConnectorNames.WalletConnect,
    },
    {
      id: 'coinbase',
      title: 'Coinbase Wallet',
      icon: `/images/wallets/coinbase.png`,
      connectorId: ConnectorNames.WalletLink,
    },
    {
      id: 'brave',
      title: 'Brave Wallet',
      icon: `/images/wallets/brave.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet)
      },
      downloadLink: 'https://brave.com/wallet/',
    },
    {
      id: 'rabby',
      title: 'Rabby Wallet',
      icon: `/images/wallets/rabby.png`,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isRabby)
      },
      connectorId: ConnectorNames.Injected,
      guide: {
        desktop: 'https://rabby.io/',
      },
      downloadLink: {
        desktop: 'https://chrome.google.com/webstore/detail/rabby/acmacodkjbdgmoleebolmdjonilkdbch',
      },
    },
  ]
}

export const createWallets = (chainId: number, connect: any) => {
  const config = walletsConfig({ chainId, connect })
  return [
    ...config,
    {
      id: 'injected',
      title: 'Injected',
      icon: WalletFilledIcon,
      connectorId: ConnectorNames.Injected,
      installed: typeof window !== 'undefined' && Boolean(window.ethereum),
    },
  ]
}
