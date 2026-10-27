import { BigintIsh, Currency, CurrencyAmount, TradeType } from '@dex/sdk'
import { AbortControl } from '@dex/utils/abortControl'
import chunk from 'lodash/chunk.js'

import { getAmountDistribution } from './functions'
import { BaseRoute, GasModel, QuoteProvider, RouteWithQuote, RouteWithoutQuote } from './types'
import { logger } from './utils/logger'

logger.enable('error,log')

type Params = {
  blockNumber?: BigintIsh
  amount: CurrencyAmount<Currency>
  baseRoutes: BaseRoute[]
  distributionPercent: number
  quoteProvider: QuoteProvider
  tradeType: TradeType
  gasModel: GasModel
  quoterOptimization?: boolean
} & AbortControl

export async function getRoutesWithValidQuote({
  amount,
  baseRoutes,
  distributionPercent,
  quoteProvider,
  tradeType,
  blockNumber,
  gasModel,
  quoterOptimization = true,
  signal,
}: Params): Promise<RouteWithQuote[]> {
  const [percents, amounts] = getAmountDistribution(amount, distributionPercent)
  const routesWithoutQuote = amounts.reduce<RouteWithoutQuote[]>(
    (acc, curAmount, i) => [
      ...acc,
      ...baseRoutes.map((r) => ({
        ...r,
        amount: curAmount,
        percent: percents[i],
      })),
    ],
    [],
  )
  const getRoutesWithQuote =
    tradeType === TradeType.EXACT_INPUT
      ? quoteProvider.getRouteWithQuotesExactIn
      : quoteProvider.getRouteWithQuotesExactOut

  if (!quoterOptimization) {
    return getRoutesWithQuote(routesWithoutQuote, { blockNumber, gasModel, signal })
  }

  const requestCallback = typeof window === 'undefined' ? setTimeout : window.requestIdleCallback || window.setTimeout
  logger.log('Get quotes', 'from', routesWithoutQuote.length, 'routes', routesWithoutQuote)
  // Split into chunks so the calculation won't block the main thread
  const getQuotes = (routes: RouteWithoutQuote[]): Promise<RouteWithQuote[]> =>
    new Promise((resolve, reject) => {
      requestCallback(async () => {
        try {
          const result = await getRoutesWithQuote(routes, { blockNumber, gasModel, signal })
          resolve(result)
        } catch (e) {
          reject(e)
        }
      })
    })
  // With this more aggressive chunking:
  const maxChunkSize = Math.min(100, Math.max(25, routesWithoutQuote.length))
  const chunks = chunk(routesWithoutQuote, maxChunkSize)

  logger.log('Chunking quotes:', {
    totalRoutes: routesWithoutQuote.length,
    chunkSize: maxChunkSize,
    numberOfChunks: chunks.length,
  })
  const result = await Promise.all(chunks.map(getQuotes))
  const quotes = result.reduce<RouteWithQuote[]>((acc, cur) => [...acc, ...cur], [])
  logger.log('Get quotes', 'success, got', quotes.length, 'quoted routes', quotes)
  if (quotes.length === 0 && routesWithoutQuote.length > 0) {
    logger.log(
      'All quotes failed. Routes attempted:',
      routesWithoutQuote.map((r) => ({
        path: r.path.map((t) => t.symbol).join(' -> '),
        type: r.type,
        amount: r.amount.toExact(),
        pools: r.pools.map((p: any) => ({
          type: p.type,
          fee: p.fee,
          address: p.address,
          tick: p.tick,
          liquidity: p.liquidity?.toString(),
        })),
      })),
    )
  }
  return quotes
}
