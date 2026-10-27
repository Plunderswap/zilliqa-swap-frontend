import { ChainId } from '@dex/chains'
import { useTranslation } from '@dex/localization'
import { Button, Message, MessageText, Text } from '@dex/uikit'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

interface WalletWrongNetworkProps {
  onDismiss: () => void
}

const WalletWrongNetwork: React.FC<React.PropsWithChildren<WalletWrongNetworkProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { switchNetworkAsync, canSwitch } = useSwitchNetwork()

  const handleSwitchNetwork = async (): Promise<void> => {
    await switchNetworkAsync(ChainId.ZILLIQA)
    onDismiss?.()
  }

  return (
    <>
      <Text mb="24px">{t('You’re connected to the wrong network.')}</Text>
      {canSwitch ? (
        <Button onClick={handleSwitchNetwork} mb="24px">
          {t('Switch Network')}
        </Button>
      ) : (
        <Message variant="danger">
          <MessageText>{t('Unable to switch network. Please try it on your wallet')}</MessageText>
        </Message>
      )}
    </>
  )
}

export default WalletWrongNetwork
