import { Flex, HistoryIcon, IconButton, NotificationDot, useModal } from '@dex/uikit'
import { useExpertMode } from '@dex/utils/user'
import { Swap } from '@dex/widgets-internal'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import GlobalSettings from 'components/Menu/GlobalSettings'
import RefreshIcon from 'components/Svg/RefreshIcon'
import { CHAIN_REFRESH_TIME } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ReactElement, memo } from 'react'
import { useRoutingSettingChanged } from 'state/user/smartRouter'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'

interface Props {
  title: string | ReactElement
  subtitle: string
  noConfig?: boolean
  hasAmount: boolean
  onRefreshPrice: () => void
}

const CurrencyInputHeader: React.FC<React.PropsWithChildren<Props>> = memo(
  ({ subtitle, title, hasAmount, onRefreshPrice }) => {
    const { chainId } = useActiveChainId()

    const [expertMode] = useExpertMode()
    const [isRoutingSettingChange] = useRoutingSettingChanged()
    const [onPresentTransactionsModal] = useModal(<TransactionsModal />)

    const titleContent = (
      <Flex width="100%" alignItems="center" justifyContent="space-between" flexDirection="column">
        <Flex flexDirection="column" alignItems="flex-start" width="100%" marginBottom={15}>
          <Swap.CurrencyInputHeaderTitle>{title}</Swap.CurrencyInputHeaderTitle>
        </Flex>
        <Flex justifyContent="start" width="100%" height="17px" alignItems="center" mb="14px">
          <Swap.CurrencyInputHeaderSubTitle>{subtitle}</Swap.CurrencyInputHeaderSubTitle>
        </Flex>
        <Flex width="100%" justifyContent="end">
          <NotificationDot show={expertMode || isRoutingSettingChange}>
            <GlobalSettings
              color="textSubtle"
              mr="0"
              mode={SettingsMode.SWAP_LIQUIDITY}
              data-dd-action-name="Swap settings button"
            />
          </NotificationDot>
          <IconButton
            onClick={onPresentTransactionsModal}
            variant="text"
            scale="sm"
            data-dd-action-name="Swap history button"
          >
            <HistoryIcon color="textSubtle" width="24px" />
          </IconButton>
          <IconButton variant="text" scale="sm" onClick={onRefreshPrice} data-dd-action-name="Swap refresh button">
            <RefreshIcon
              disabled={!hasAmount}
              color="textSubtle"
              width="27px"
              duration={chainId && CHAIN_REFRESH_TIME[chainId] ? CHAIN_REFRESH_TIME[chainId] / 1000 : undefined}
            />
          </IconButton>
        </Flex>
      </Flex>
    )

    return <Swap.CurrencyInputHeader title={titleContent} subtitle={<></>} />
  },
)

export default CurrencyInputHeader
