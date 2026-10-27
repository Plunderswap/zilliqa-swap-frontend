import { useTranslation } from '@dex/localization'
import { WalletModalV2 } from '@dex/ui-wallets'
import { Button, ButtonProps } from '@dex/uikit'
import { createWallets } from 'config/wallet'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'

import { ChainId } from '@dex/chains'
import { useMemo, useState } from 'react'
import { logGTMWalletConnectEvent } from 'utils/customGTMEventTracking'
import { useConnect } from 'wagmi'
import Trans from './Trans'

const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const handleActive = useActiveHandle()
  const { login } = useAuth()
  const { t } = useTranslation()
  const { connectAsync } = useConnect()
  const { chainId } = useActiveChainId()
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined' && !window.ethereum) {
      handleActive()
    } else {
      setOpen(true)
    }
  }

  const wallets = useMemo(() => createWallets(chainId || ChainId.ZILLIQA, connectAsync), [chainId, connectAsync])

  return (
    <>
      <Button onClick={handleClick} {...props}>
        {children || <Trans>Connect Wallet</Trans>}
      </Button>
      <WalletModalV2
        docText={t('Learn How to Connect')}
        docLink="https://ethereum.org/en/wallets/find-wallet/"
        isOpen={open}
        wallets={wallets}
        login={login}
        onDismiss={() => setOpen(false)}
        onWalletConnectCallBack={logGTMWalletConnectEvent}
      />
    </>
  )
}

export default ConnectWalletButton
