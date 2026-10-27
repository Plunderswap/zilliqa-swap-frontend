import { useDebounce, usePropsChanged } from '@dex/hooks'
import { Currency, CurrencyAmount, TradeType } from '@dex/sdk'
import { PoolType, SmartRouter, SmartRouterTrade } from '@dex/smart-router'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useDeferredValue, useEffect, useMemo, useRef } from 'react'

import { POOLS_NORMAL_REVALIDATE } from 'config/pools'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useIsWrapping } from 'hooks/useWrapCallback'
import { useCurrentBlock } from 'state/block/hooks'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { createViemPublicClientGetter } from 'utils/viem'
import { publicClient } from 'utils/wagmi'

import { useCommonPoolsLite } from './useCommonPools'
import { useCurrencyUsdPrice } from './useCurrencyUsdPrice'
import { useMulticallGasLimit } from './useMulticallGasLimit'
import { useTokenFee } from './useTokenFee'

SmartRouter.logger.enable('error,log')

const QUERY_KEY = 'useBestAMMTrade'

interface Options {
  amount?: CurrencyAmount<Currency>
  baseCurrency?: Currency | null
  currency?: Currency | null
  tradeType?: TradeType
  maxHops?: number
  maxSplits?: number
  v2Swap?: boolean
  v3Swap?: boolean
  enabled?: boolean
  autoRevalidate?: boolean
}

export function useBestAMMTrade({
  amount,
  baseCurrency,
  currency,
  tradeType = TradeType.EXACT_INPUT,
  maxHops,
  maxSplits,
  v2Swap = true,
  v3Swap = true,
  enabled = true,
  autoRevalidate = true,
}: Options) {
  const isWrapping = useIsWrapping(baseCurrency, currency, amount?.toExact())
  const quoteEnabled = Boolean(enabled && !isWrapping)

  const { gasPrice } = useFeeDataWithGasPrice()
  const gasLimit = useMulticallGasLimit(currency?.chainId)
  const currenciesUpdated = usePropsChanged(baseCurrency, currency)
  const queryClient = useQueryClient()

  const keepPreviousDataRef = useRef<boolean>(true)

  if (currenciesUpdated) {
    keepPreviousDataRef.current = false
  }

  const currentBlockNumber = useCurrentBlock()
  const blockNumber = useMemo(() => {
    // Only update every 5th block = 5-15 seconds between quotes
    return Math.floor(currentBlockNumber / 5) * 5
  }, [currentBlockNumber])

  const {
    refresh: refreshPools,
    pools: candidatePools,
    loading,
    syncing,
  } = useCommonPoolsLite(baseCurrency || amount?.currency, currency ?? undefined, {
    blockNumber,
    allowInconsistentBlock: true,
    enabled: quoteEnabled,
  })

  const { data: tokenInFee } = useTokenFee(baseCurrency && baseCurrency.isToken ? baseCurrency : undefined)
  const { data: tokenOutFee } = useTokenFee(currency && currency.isToken ? currency : undefined)

  const candidatePoolsWithoutV3WithFot = useMemo(() => {
    let pools = candidatePools
    if (tokenInFee && tokenInFee.result.sellFeeBps > 0n) {
      pools = pools?.filter(
        (pool) =>
          !(
            pool.type === PoolType.V3 &&
            baseCurrency &&
            (pool.token0.equals(baseCurrency) || pool.token1.equals(baseCurrency))
          ),
      )
    }

    if (tokenOutFee && tokenOutFee.result.buyFeeBps > 0n) {
      pools = pools?.filter(
        (pool) =>
          !(pool.type === PoolType.V3 && currency && (pool.token0.equals(currency) || pool.token1.equals(currency))),
      )
    }
    return pools
  }, [candidatePools, tokenInFee, tokenOutFee, baseCurrency, currency])

  const poolProvider = useMemo(
    () => SmartRouter.createStaticPoolProvider(candidatePoolsWithoutV3WithFot),
    [candidatePoolsWithoutV3WithFot],
  )
  const deferQuotientRaw = useDeferredValue(amount?.quotient?.toString())
  const deferQuotient = useDebounce(deferQuotientRaw, 300)
  const { data: quoteCurrencyUsdPrice } = useCurrencyUsdPrice(currency ?? undefined)
  const currencyNativeChain = useNativeCurrency(currency?.chainId)
  const { data: nativeCurrencyUsdPrice } = useCurrencyUsdPrice(currencyNativeChain)

  const poolTypes = useMemo(() => {
    const types: PoolType[] = []
    if (v2Swap) {
      types.push(PoolType.V2)
    }
    if (v3Swap) {
      types.push(PoolType.V3)
    }
    return types
  }, [v2Swap, v3Swap])

  const {
    data: trade,
    status,
    fetchStatus,
    isPlaceholderData,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      QUERY_KEY,
      currency?.chainId,
      amount?.currency?.symbol,
      currency?.symbol,
      tradeType,
      deferQuotient,
      maxHops,
      maxSplits,
      poolTypes,
    ],
    queryFn: async ({ signal }) => {
      if (!amount || !amount.currency || !currency || !deferQuotient) {
        return undefined
      }
      const onChainProvider = createViemPublicClientGetter({ transportSignal: signal })
      const quoteProvider = SmartRouter.createQuoteProvider({ onChainProvider, gasLimit })

      const deferAmount = CurrencyAmount.fromRawAmount(amount.currency, deferQuotient)
      const label = `[BEST_AMM] chain ${currency.chainId}, ${deferAmount.toExact()} ${
        amount.currency.symbol
      } -> ${currency.symbol}, tradeType ${tradeType}`
      SmartRouter.logger.log(label, candidatePools)
      SmartRouter.logger.metric(label, candidatePools)
      const res = await SmartRouter.getBestTrade(deferAmount, currency, tradeType, {
        gasPriceWei:
          typeof gasPrice === 'bigint'
            ? gasPrice
            : async () => publicClient({ chainId: amount.currency.chainId }).getGasPrice(),
        maxHops,
        poolProvider,
        maxSplits,
        quoteProvider,
        allowedPoolTypes: poolTypes,
        // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
        quoterOptimization: false,
        quoteCurrencyUsdPrice,
        nativeCurrencyUsdPrice,
        signal,
      })
      if (!res) {
        return undefined
      }
      SmartRouter.logger.metric(
        label,
        res.inputAmount.toExact(),
        res.inputAmount.currency.symbol,
        '->',
        res.outputAmount.toExact(),
        res.outputAmount.currency.symbol,
        res.routes,
      )
      SmartRouter.logger.log(label, res)
      return {
        ...res,
        blockNumber,
      } as SmartRouterTrade<TradeType>
    },
    enabled: !!(amount && currency && candidatePools && !loading && deferQuotient && quoteEnabled),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousDataRef.current ? keepPreviousData : undefined,
    retry: false,
    staleTime: autoRevalidate && amount?.currency.chainId ? POOLS_NORMAL_REVALIDATE[amount.currency.chainId] : 0,
    refetchInterval:
      autoRevalidate && amount?.currency.chainId ? POOLS_NORMAL_REVALIDATE[amount?.currency?.chainId] : 0,
  })

  useEffect(() => {
    if (!keepPreviousDataRef.current && trade) {
      keepPreviousDataRef.current = true
    }
  }, [trade, keepPreviousDataRef])

  const isValidating = fetchStatus === 'fetching'
  const isLoading = status === 'pending' || isPlaceholderData

  const refresh = useCallback(async () => {
    await refreshPools()
    await queryClient.invalidateQueries({
      queryKey: [QUERY_KEY],
      refetchType: 'none',
    })
    refetch()
  }, [refreshPools, queryClient, refetch])

  return {
    refresh,
    trade,
    isLoading: isLoading || loading,
    isStale: trade?.blockNumber !== blockNumber,
    error: error as Error | undefined,
    syncing: syncing || isValidating || (amount?.quotient?.toString() !== deferQuotient && deferQuotient !== undefined),
  }
}
