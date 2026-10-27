import { ChainId } from '@dex/chains'
import { BigintIsh, Currency, CurrencyAmount, TradeType, ZERO } from '@dex/sdk'
import { ROUTE_CONFIG_BY_CHAIN } from './constants'
import { computeAllRoutes, getBestRouteCombinationByQuotes } from './functions'
import { createGasModel } from './gasModel'
import { getRoutesWithValidQuote } from './getRoutesWithValidQuote'
import { BestRoutes, RouteConfig, RouteType, SmartRouterTrade, TradeConfig } from './types'
import { logger } from './utils/logger'

logger.enable('error,log')

export async function getBestTrade(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  config: TradeConfig,
): Promise<SmartRouterTrade<TradeType> | null> {
  const { blockNumber: blockNumberFromConfig } = config
  const blockNumber: BigintIsh | undefined =
    typeof blockNumberFromConfig === 'function' ? await blockNumberFromConfig() : blockNumberFromConfig
  const bestRoutes = await getBestRoutes(amount, currency, tradeType, {
    ...config,
    blockNumber,
  })
  if (!bestRoutes || bestRoutes.outputAmount.equalTo(ZERO)) {
    throw new Error('Cannot find a valid swap route')
  }

  const { routes, gasEstimateInUSD, gasEstimate, inputAmount, outputAmount } = bestRoutes
  // TODO restrict trade type to exact input if routes include one of the old
  // stable swap pools, which only allow to swap with exact input
  return {
    tradeType,
    routes,
    gasEstimate,
    gasEstimateInUSD,
    inputAmount,
    outputAmount,
    blockNumber,
  }
}

async function getBestRoutes(
  amount: CurrencyAmount<Currency>,
  currency: Currency,
  tradeType: TradeType,
  routeConfig: RouteConfig,
): Promise<BestRoutes | null> {
  const { chainId } = currency
  const {
    maxHops = 2,
    maxSplits = 2,
    distributionPercent: configuredDistributionPercent = 25,
    poolProvider,
    quoteProvider,
    blockNumber,
    gasPriceWei,
    allowedPoolTypes,
    quoterOptimization,
    quoteCurrencyUsdPrice,
    nativeCurrencyUsdPrice,
    signal,
  } = {
    ...routeConfig,
    ...(ROUTE_CONFIG_BY_CHAIN[chainId as ChainId] || {}),
  }

  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const inputCurrency = isExactIn ? amount.currency : currency
  const outputCurrency = isExactIn ? currency : amount.currency

  const candidatePools = await poolProvider?.getCandidatePools({
    currencyA: amount.currency,
    currencyB: currency,
    blockNumber,
    protocols: allowedPoolTypes,
    signal,
  })

  let baseRoutes = computeAllRoutes(inputCurrency, outputCurrency, candidatePools, maxHops)

  // Smart route filtering to reduce RPC calls - this was stopping a lot of the multi-hop routes from being found
  // if (baseRoutes.length > 8) {
  //   // Prioritize: 1) Direct routes, 2) Shorter routes, 3) Routes with known good pools
  //   const directRoutes = baseRoutes.filter(r => r.pools.length === 1)
  //   const multiHopRoutes = baseRoutes.filter(r => r.pools.length > 1)
  //     .sort((a, b) => a.pools.length - b.pools.length) // Prefer shorter routes
  //     .slice(0, Math.max(1, 8 - directRoutes.length)) // Keep best multi-hop routes

  //   baseRoutes = [...directRoutes, ...multiHopRoutes]

  //   logger.log('Filtered routes:', {
  //     original: baseRoutes.length + multiHopRoutes.length + directRoutes.length - baseRoutes.length,
  //     filtered: baseRoutes.length,
  //     direct: directRoutes.length,
  //       multiHop: multiHopRoutes.length,
  //     })
  //   }

  // Check if we have a direct route (single hop)
  const hasDirectRoute = baseRoutes.some((route) => route.pools.length === 1)

  // Try both distribution strategies when we have direct routes
  const distributions = hasDirectRoute
    ? [100, configuredDistributionPercent] // Try both full and split distributions
    : [configuredDistributionPercent] // Only try splits for multi-hop

  logger.log('Route distributions to try:', {
    hasDirectRoute,
    distributions,
    routeCount: baseRoutes.length,
    directRoutes: baseRoutes.filter((r) => r.pools.length === 1).length,
  })

  // Do not support mix route on exact output
  if (tradeType === TradeType.EXACT_OUTPUT) {
    baseRoutes = baseRoutes.filter(({ type }) => type !== RouteType.MIXED)
  }

  const gasModel = await createGasModel({
    gasPriceWei,
    poolProvider,
    quoteCurrency: currency,
    blockNumber,
    quoteCurrencyUsdPrice,
    nativeCurrencyUsdPrice,
  })

  // Get quotes for all distribution strategies
  const allQuotes = await Promise.all(
    distributions.map((dist) =>
      getRoutesWithValidQuote({
        amount,
        baseRoutes,
        distributionPercent: dist,
        quoteProvider,
        tradeType,
        blockNumber,
        gasModel,
        quoterOptimization,
        signal,
      }),
    ),
  )

  // Combine all quotes
  const routesWithValidQuote = allQuotes.flat()

  logger.log('Got quotes for all distributions:', {
    totalQuotes: routesWithValidQuote.length,
    byDistribution: distributions.map((dist, i) => ({
      distribution: dist,
      quotes: allQuotes[i].length,
    })),
  })

  return getBestRouteCombinationByQuotes(amount, currency, routesWithValidQuote, tradeType, { maxSplits })
}
