import { BigintIsh, Currency } from '@dex/sdk'

import { OnChainProvider, Pool, PoolType } from '../../types'
import { getV2CandidatePools } from './getV2CandidatePools'
import { getV3CandidatePools } from './getV3CandidatePools'

export type GetCandidatePoolsParams = {
  currencyA?: Currency
  currencyB?: Currency

  // Only use this param if we want to specify pairs we want to get
  pairs?: [Currency, Currency][]

  onChainProvider?: OnChainProvider
  blockNumber?: BigintIsh
  protocols?: PoolType[]
}

export async function getCandidatePools({
  protocols = [PoolType.V3, PoolType.V2],
  ...rest
}: GetCandidatePoolsParams): Promise<Pool[]> {
  const { currencyA } = rest
  const chainId = currencyA?.chainId
  if (!chainId) {
    return []
  }

  const poolSets = await Promise.all(
    protocols.map((protocol) => {
      if (protocol === PoolType.V2) {
        return getV2CandidatePools(rest)
      }
      if (protocol === PoolType.V3) {
        return getV3CandidatePools(rest)
      }
      return []
    }),
  )

  return poolSets.reduce<Pool[]>((acc, cur) => [...acc, ...cur], [])
}
