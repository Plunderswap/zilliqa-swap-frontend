import { Currency, CurrencyAmount, ERC20Token, Native, Pair, TradeType, Trade as V2Trade } from '@dex/sdk'
import { RouteType, SmartRouterTrade, V2Pool, V3Pool } from '@dex/smart-router'
import { Pool, Trade as V3Trade } from '@dex/v3-sdk'
import { convertPairToV2Pool, convertPoolToV3Pool } from '../fixtures/address'

export const buildV2Trade = (
  v2Trade: V2Trade<Currency, Currency, TradeType>,
  v2Pools: V2Pool[],
): SmartRouterTrade<TradeType> => {
  return {
    tradeType: v2Trade.tradeType,
    inputAmount: v2Trade.inputAmount,
    outputAmount: v2Trade.outputAmount,
    routes: [
      {
        type: RouteType.V2,
        path: v2Trade.route.path,
        inputAmount: v2Trade.inputAmount,
        outputAmount: v2Trade.outputAmount,
        percent: 100,
        pools: v2Pools,
      },
    ],
    gasEstimate: 0n,
    gasEstimateInUSD: CurrencyAmount.fromRawAmount(v2Trade.route.input, 0),
  }
}

export const buildV3Trade = (
  trade: V3Trade<Currency, Currency, TradeType>,
  pools: V3Pool[],
): SmartRouterTrade<TradeType> => {
  return {
    tradeType: trade.tradeType,
    inputAmount: trade.inputAmount,
    outputAmount: trade.outputAmount,
    routes: [
      {
        type: RouteType.V3,
        path: trade.swaps[0].route.tokenPath,
        inputAmount: trade.inputAmount,
        outputAmount: trade.outputAmount,
        percent: 100,
        pools,
      },
    ],
    gasEstimate: 0n,
    gasEstimateInUSD: CurrencyAmount.fromRawAmount(trade.route.input, 0),
  }
}

export const buildMixedRouteTrade = async <
  TInput extends Currency,
  TOutput extends Currency,
  TTradeType extends TradeType,
>(
  tokenIn: TInput,
  amount: CurrencyAmount<TTradeType extends TradeType.EXACT_INPUT ? TInput : TOutput>,
  tradeType: TTradeType,
  pools: Array<Pair | Pool>,
  isOutputNative = true,
): Promise<SmartRouterTrade<TradeType>> => {
  const path: Currency[] = [tokenIn.wrapped]
  const outputPools = pools.map((pool) => {
    return pool instanceof Pair ? convertPairToV2Pool(pool) : convertPoolToV3Pool(pool)
  })

  const amounts: CurrencyAmount<Currency>[] = []

  amounts.push(amount.wrapped)

  for (const pool of pools) {
    const input = amounts[amounts.length - 1]
    // eslint-disable-next-line no-await-in-loop
    const [outputAmount] = await pool.getOutputAmount(input as CurrencyAmount<ERC20Token>)
    path.push(outputAmount.currency)
    amounts.push(outputAmount)
  }

  // mixed Router support exactIn only
  const inputAmount = amount
  let outputAmount = amounts[amounts.length - 1]
  const nativeCurrency = Native.onChain(outputAmount.currency.chainId)
  // is wrapped token
  if (outputAmount.currency.wrapped.equals(nativeCurrency.wrapped) && isOutputNative) {
    outputAmount = CurrencyAmount.fromFractionalAmount(nativeCurrency, outputAmount.numerator, outputAmount.denominator)
  }
  return {
    tradeType,
    inputAmount: amount,
    outputAmount: isOutputNative ? outputAmount : outputAmount.wrapped,
    routes: [
      {
        type: RouteType.MIXED,
        path,
        pools: outputPools,
        inputAmount,
        outputAmount,
        percent: 100,
      },
    ],
    gasEstimate: 0n,
    gasEstimateInUSD: CurrencyAmount.fromRawAmount(tokenIn, 0),
  }
}
