import { ChainId } from '@dex/chains'
import { Currency, CurrencyAmount, ERC20Token, Percent, Price, Token, TradeType } from '@dex/sdk'

// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]?: T
}

export type ChainTokenList = ChainMap<Token[]>

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export const FetchStatus = {
  Idle: 'idle',
  Fetching: 'pending',
  Fetched: 'success',
  Failed: 'error',
} as const

export interface StableTrade {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  executionPrice: Price<Currency, Currency>
  priceImpact: null
  maximumAmountIn: (slippaged: Percent) => CurrencyAmount<Currency>
  minimumAmountOut: (slippaged: Percent) => CurrencyAmount<Currency>
}

export enum Bound {
  LOWER = 'LOWER',
  UPPER = 'UPPER',
}

export type UnsafeCurrency = Currency | ERC20Token | null | undefined
