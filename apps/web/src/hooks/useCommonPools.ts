/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition, no-console */
import { Currency } from '@dex/sdk'
import { Pool } from '@dex/smart-router'
import { useMemo, useCallback } from 'react'

import {
  useV3CandidatePools,
  useV3CandidatePoolsWithoutTicks,
  useV3PoolsWithTicksOnChain,
  V3PoolsHookParams,
  V3PoolsResult,
} from './useV3Pools'
import { useV2CandidatePools } from './useV2Pools'

interface FactoryOptions {
  // use to identify hook
  key: string

  useV3Pools: (currencyA?: Currency, currencyB?: Currency, params?: V3PoolsHookParams) => V3PoolsResult
}

export interface PoolsWithState {
  refresh: () => Promise<unknown>
  pools: Pool[] | undefined
  loading: boolean
  syncing: boolean
  blockNumber?: number
  dataUpdatedAt?: number
}

export interface CommonPoolsParams {
  blockNumber?: number
  allowInconsistentBlock?: boolean
  enabled?: boolean
}

function commonPoolsHookCreator({ useV3Pools }: FactoryOptions) {
  return function useCommonPools(
    currencyA?: Currency,
    currencyB?: Currency,
    { blockNumber, allowInconsistentBlock = false, enabled = true }: CommonPoolsParams = {},
  ): PoolsWithState {
    const {
      pools: v3Pools,
      loading: v3Loading,
      syncing: v3Syncing,
      blockNumber: v3BlockNumber,
      refresh: v3Refresh,
      dataUpdatedAt: v3PoolsUpdatedAt,
    } = useV3Pools(currencyA, currencyB, { blockNumber, enabled })
    const {
      pools: v2Pools,
      loading: v2Loading,
      syncing: v2Syncing,
      blockNumber: v2BlockNumber,
      refresh: v2Refresh,
      dataUpdatedAt: v2PoolsUpdatedAt,
    } = useV2CandidatePools(currencyA, currencyB, { blockNumber, enabled })
    const consistentBlockNumber = useMemo(
      () => (v2BlockNumber && v3BlockNumber && v2BlockNumber === v3BlockNumber ? v2BlockNumber : undefined),
      [v2BlockNumber, v3BlockNumber],
    )
    // FIXME: allow inconsistent block not working as expected
    const poolsData: [Pool[], number] | undefined = useMemo(
      () =>
        (!v2Loading || v2Pools) && (!v3Loading || v3Pools) && (allowInconsistentBlock || !!consistentBlockNumber)
          ? [[...(v2Pools || []), ...(v3Pools || [])], Math.max(v2PoolsUpdatedAt || 0, v3PoolsUpdatedAt || 0)]
          : undefined,
      [
        v2Loading,
        v2Pools,
        v3Loading,
        v3Pools,
        allowInconsistentBlock,
        consistentBlockNumber,
        v3PoolsUpdatedAt,
        v2PoolsUpdatedAt,
      ],
    )

    const refresh = useCallback(async () => {
      return Promise.all([v3Refresh(), v2Refresh()])
    }, [v3Refresh, v2Refresh])

    const loading = v2Loading || v3Loading
    const syncing = v2Syncing || v3Syncing
    return {
      refresh,
      pools: poolsData?.[0],
      blockNumber: consistentBlockNumber,
      loading,
      syncing,
      dataUpdatedAt: poolsData?.[1],
    }
  }
}

// Get v3 pools data from on chain
export const useCommonPoolsOnChain = commonPoolsHookCreator({
  key: 'useCommonPoolsOnChain',
  useV3Pools: useV3PoolsWithTicksOnChain,
})

export const useCommonPools = commonPoolsHookCreator({ key: 'useCommonPools', useV3Pools: useV3CandidatePools })

export const useCommonPoolsLite = commonPoolsHookCreator({
  key: 'useCommonPoolsLite',
  useV3Pools: useV3CandidatePoolsWithoutTicks,
})
