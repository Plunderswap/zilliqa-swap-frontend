import { Currency, CurrencyAmount } from '@dex/sdk'

export interface GasCost {
  gasEstimate: bigint
  // The gas cost in terms of the quote token.
  gasCostInToken: CurrencyAmount<Currency>
  gasCostInUSD: CurrencyAmount<Currency>
}
