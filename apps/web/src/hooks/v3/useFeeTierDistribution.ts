import { Currency } from '@dex/sdk'
import { FeeAmount } from '@dex/v3-sdk'

interface FeeTierDistribution {
  isPending: boolean
  isError: boolean
  largestUsageFeeTier?: FeeAmount
  largestUsageFeeTierTvl?: [number, number]
  distributions?: Record<FeeAmount, number | undefined>
}

export function useFeeTierDistribution(
  _currencyA: Currency | undefined | null,
  _currencyB: Currency | undefined | null,
): FeeTierDistribution {
  return {
    isPending: false,
    isError: false,
  }
}
