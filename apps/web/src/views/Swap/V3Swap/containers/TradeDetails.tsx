import { TradeType } from '@dex/sdk'
import { SmartRouter, SmartRouterTrade } from '@dex/smart-router'
import { AutoColumn } from '@dex/uikit'
import { memo, useMemo } from 'react'

import { TradeSummary } from 'views/Swap/components/AdvancedSwapDetails'
import { AdvancedDetailsFooter } from 'views/Swap/components/AdvancedSwapDetailsDropdown'

import { RoutesBreakdown } from '../components'
import { useIsWrapping, useSlippageAdjustedAmounts } from '../hooks'
import { computeTradePriceBreakdown } from '../utils/exchange'

interface Props {
  loaded: boolean
  trade?: SmartRouterTrade<TradeType> | null
}

export const TradeDetails = memo(function TradeDetailsComponent({ loaded, trade }: Props) {
  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(trade ?? undefined)
  const isWrapping = useIsWrapping()
  const { priceImpactWithoutFee, lpFeeAmount } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const hasStablePool = useMemo(
    () => trade?.routes.some((route) => route.pools.some(SmartRouter.isStablePool)),
    [trade],
  )

  if (isWrapping || !loaded || !trade || !slippageAdjustedAmounts) {
    return null
  }

  const { inputAmount, outputAmount, tradeType, routes } = trade

  return (
    <AdvancedDetailsFooter show={loaded}>
      <AutoColumn gap="0px">
        <TradeSummary
          slippageAdjustedAmounts={slippageAdjustedAmounts}
          inputAmount={inputAmount}
          outputAmount={outputAmount}
          tradeType={tradeType}
          priceImpactWithoutFee={priceImpactWithoutFee ?? undefined}
          realizedLPFee={lpFeeAmount ?? undefined}
          hasStablePair={hasStablePool}
        />
        <RoutesBreakdown routes={routes} />
      </AutoColumn>
    </AdvancedDetailsFooter>
  )
})
