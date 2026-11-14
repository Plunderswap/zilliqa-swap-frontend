import { SmartRouter } from '@dex/smart-router'
import throttle from 'lodash/throttle'
import { useMemo } from 'react'

import { FormHeader, FormMain, PricingAndSlippage, TradeDetails } from './containers'
import { SwapCommitButton } from './containers/SwapCommitButton'
import { useSwapBestTrade } from './hooks'

export function V3SwapForm() {
  const { isLoading, trade, refresh, syncing, isStale, error } = useSwapBestTrade()
  const throttledHandleRefresh = useMemo(() => throttle(refresh, 3000), [refresh])
  const tradeLoaded = !isLoading
  const price = useMemo(() => trade && SmartRouter.getExecutionPrice(trade), [trade])

  return (
    <>
      <FormHeader onRefresh={throttledHandleRefresh} refreshDisabled={!tradeLoaded || syncing || !isStale} />
      <FormMain
        tradeLoading={!tradeLoaded}
        pricingAndSlippage={<PricingAndSlippage priceLoading={isLoading} price={price ?? undefined} showSlippage />}
        inputAmount={trade?.inputAmount}
        outputAmount={trade?.outputAmount}
        swapCommitButton={<SwapCommitButton trade={trade} tradeError={error} tradeLoading={!tradeLoaded} />}
      />
      <TradeDetails loaded={tradeLoaded} trade={trade} />
    </>
  )
}
