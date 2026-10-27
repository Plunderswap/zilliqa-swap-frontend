import { SmartRouter } from '@dex/smart-router'
import throttle from 'lodash/throttle'
import { useMemo } from 'react'

import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'
import { useExperimentalFeatureEnabled } from 'hooks/useExperimentalFeatureEnabled'
import { FormHeader, FormMain, PricingAndSlippage, SwapCommitButtonV2, TradeDetails } from './containers'
import { SwapCommitButton } from './containers/SwapCommitButton'
import { useSwapBestTrade } from './hooks'

export function V3SwapForm() {
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade()
  const throttledHandleRefresh = useMemo(() => throttle(refresh, 3000), [refresh])
  const tradeLoaded = !isLoading
  const price = useMemo(() => trade && SmartRouter.getExecutionPrice(trade), [trade])
  const featureEnabled = useExperimentalFeatureEnabled(EXPERIMENTAL_FEATURES.UniversalRouter)
  const commitButton = featureEnabled ? (
    <SwapCommitButtonV2 trade={trade} tradeError={error} tradeLoading={!tradeLoaded} />
  ) : (
    <SwapCommitButton trade={trade} tradeError={error} tradeLoading={!tradeLoaded} />
  )

  return (
    <>
      <FormHeader onRefresh={throttledHandleRefresh} refreshDisabled={!tradeLoaded || syncing || !isStale} />
      <FormMain
        tradeLoading={!tradeLoaded}
        pricingAndSlippage={<PricingAndSlippage priceLoading={isLoading} price={price ?? undefined} showSlippage />}
        inputAmount={trade?.inputAmount}
        outputAmount={trade?.outputAmount}
        swapCommitButton={commitButton}
      />
      <TradeDetails loaded={tradeLoaded} trade={trade} />
    </>
  )
}
