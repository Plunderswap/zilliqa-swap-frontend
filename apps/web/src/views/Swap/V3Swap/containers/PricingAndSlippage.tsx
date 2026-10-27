import { useModal } from '@dex/uikit'
import { Swap as SwapUI } from '@dex/widgets-internal'

import { useTranslation } from '@dex/localization'
import { Price, Currency } from '@dex/sdk'
import { useUserSlippage } from '@dex/utils/user'
import { memo } from 'react'

import SettingsModal from '../../../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../../../components/Menu/GlobalSettings/types'
import { useIsWrapping } from '../hooks'

interface Props {
  showSlippage?: boolean
  priceLoading?: boolean
  price?: Price<Currency, Currency>
}

export const PricingAndSlippage = memo(function PricingAndSlippageComponent({
  priceLoading,
  price,
  showSlippage = true,
}: Props) {
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippage()
  const isWrapping = useIsWrapping()
  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

  if (isWrapping) {
    return null
  }

  const priceNode = price ? (
    <>
      <SwapUI.InfoLabel>{t('Price')}</SwapUI.InfoLabel>
      <SwapUI.TradePrice price={price} loading={priceLoading} />
    </>
  ) : null

  return (
    <SwapUI.Info
      price={priceNode}
      allowedSlippage={showSlippage ? allowedSlippage : undefined}
      onSlippageClick={onPresentSettingsModal}
    />
  )
})
