import { TradeType } from '@dex/sdk'
import { SmartRouterTrade } from '@dex/smart-router'
import { useUserSlippage } from '@dex/utils/user'
import { useMemo } from 'react'
import { computeSlippageAdjustedAmounts } from '../utils/exchange'

export function useSlippageAdjustedAmounts(trade?: SmartRouterTrade<TradeType> | null) {
  const [allowedSlippage] = useUserSlippage()
  return useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [allowedSlippage, trade])
}
