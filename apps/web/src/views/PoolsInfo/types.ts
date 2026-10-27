import { Address } from 'viem'

export interface TokenInfo {
  address: Address
  symbol: string
  decimals: number
}

export interface PoolData {
  address: Address
  version: 'v2' | 'v3'
  // v3 fee in hundredths of a bip, e.g. 2500 = 0.25%
  fee?: number
  token0: TokenInfo
  token1: TokenInfo
  reserve0: number
  reserve1: number
  // amount of token1 for 1 token0
  price01: number
  tvlZIL: number
}

export interface PairData {
  key: string
  token0: TokenInfo
  token1: TokenInfo
  pools: PoolData[]
  price01: number
  tvlZIL: number
}

export interface PoolsInfoResponse {
  pairs: PairData[]
  // CoinGecko ZIL price, null when unavailable
  zilUsd: number | null
  updatedAt: string
}
