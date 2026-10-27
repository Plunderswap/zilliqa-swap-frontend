import { TradeType } from '@dex/sdk'
import tryParseAmount from '@dex/utils/tryParseAmount'
import { useUserSingleHopOnly } from '@dex/utils/user'

import { useCurrency } from 'hooks/Tokens'
import { useBestAMMTrade } from 'hooks/useBestAMMTrade'
import { useDeferredValue } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useUserSplitRouteEnable, useUserV2SwapEnable, useUserV3SwapEnable } from 'state/user/smartRouter'

interface Options {
  maxHops?: number
}

export function useSwapBestTrade({ maxHops }: Options = {}) {
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const isExactIn = independentField === Field.INPUT
  const independentCurrency = isExactIn ? inputCurrency : outputCurrency
  const dependentCurrency = isExactIn ? outputCurrency : inputCurrency
  const tradeType = isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT
  const amount = tryParseAmount(typedValue, independentCurrency ?? undefined)

  const [singleHopOnly] = useUserSingleHopOnly()
  const [split] = useUserSplitRouteEnable()
  const [v2Swap] = useUserV2SwapEnable()
  const [v3Swap] = useUserV3SwapEnable()

  const { isLoading, trade, refresh, syncing, isStale, error } = useBestAMMTrade({
    amount,
    currency: dependentCurrency,
    baseCurrency: independentCurrency,
    tradeType,
    maxHops: singleHopOnly ? 1 : maxHops,
    maxSplits: split ? undefined : 0,
    v2Swap,
    v3Swap,
  })

  return {
    refresh,
    syncing,
    isStale,
    error,
    isLoading: useDeferredValue(Boolean(isLoading || (typedValue && !trade && !error))),
    trade: typedValue ? trade : undefined,
  }
}
