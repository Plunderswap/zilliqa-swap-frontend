import { useTranslation } from '@dex/localization'
import {
  BinanceChainIcon,
  Button,
  ButtonProps,
  CoinbaseWalletIcon,
  MetamaskIcon,
  OperaIcon,
  TokenPocketIcon,
  TrustWalletIcon,
} from '@dex/uikit'
import { useAccount, useWatchAsset } from 'wagmi'
import { BAD_SRCS } from '../Logo/constants'

export enum AddToWalletTextOptions {
  NO_TEXT,
  TEXT,
  TEXT_WITH_ASSET,
}

export interface AddToWalletButtonProps {
  tokenAddress?: string
  tokenSymbol?: string
  tokenDecimals?: number
  tokenLogo?: string
  textOptions?: AddToWalletTextOptions
  marginTextBetweenLogo?: string
}

const Icons = {
  // TODO: Brave
  Binance: BinanceChainIcon,
  'Coinbase Wallet': CoinbaseWalletIcon,
  Opera: OperaIcon,
  TokenPocket: TokenPocketIcon,
  'Trust Wallet': TrustWalletIcon,
  MetaMask: MetamaskIcon,
}

const getWalletText = (textOptions: AddToWalletTextOptions, tokenSymbol: string | undefined, t: any) => {
  return (
    textOptions !== AddToWalletTextOptions.NO_TEXT &&
    (textOptions === AddToWalletTextOptions.TEXT
      ? t('Add to Wallet')
      : t('Add %asset% to Wallet', { asset: tokenSymbol }))
  )
}

const getWalletIcon = (marginTextBetweenLogo: string, name?: string) => {
  const iconProps = {
    width: '16px',
    ...(marginTextBetweenLogo && { ml: marginTextBetweenLogo }),
  }
  if (name && Icons[name]) {
    const Icon = Icons[name]
    return <Icon {...iconProps} />
  }
  if (window?.ethereum?.isTrust) {
    return <TrustWalletIcon {...iconProps} />
  }
  if (window?.ethereum?.isCoinbaseWallet) {
    return <CoinbaseWalletIcon {...iconProps} />
  }
  if (window?.ethereum?.isTokenPocket) {
    return <TokenPocketIcon {...iconProps} />
  }
  if (window?.ethereum?.isMetaMask) {
    return <MetamaskIcon {...iconProps} />
  }
  return <MetamaskIcon {...iconProps} />
}

const AddToWalletButton: React.FC<AddToWalletButtonProps & ButtonProps> = ({
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenLogo,
  textOptions = AddToWalletTextOptions.NO_TEXT,
  marginTextBetweenLogo = '0px',
  ...props
}) => {
  const { t } = useTranslation()
  const { connector, isConnected } = useAccount()
  const { watchAssetAsync } = useWatchAsset()

  if (connector && connector.name === 'Binance') return null
  if (!isConnected) return null

  const handleAddToken = async () => {
    const image = tokenLogo ? (BAD_SRCS[tokenLogo] ? undefined : tokenLogo) : undefined

    if (!tokenAddress || !tokenSymbol) return

    try {
      if (connector) {
        await watchAssetAsync({
          type: 'ERC20',
          connector,
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            image,
            decimals: tokenDecimals ?? 18,
          },
        })
      }
      // Fallback to window.ethereum if connector doesn't support watchAsset
      else if (window?.ethereum?.request) {
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
              image,
            },
          } as any,
        })
      } else {
        console.error('No method available to add token to wallet')
      }
    } catch (error) {
      console.error('Error adding token to wallet:', error)
    }
  }

  return (
    <Button {...props} onClick={handleAddToken}>
      {getWalletText(textOptions, tokenSymbol, t)}
      {getWalletIcon(marginTextBetweenLogo, connector?.name)}
    </Button>
  )
}

export default AddToWalletButton
