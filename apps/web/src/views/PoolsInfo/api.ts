import { ChainId } from '@dex/chains'
import { FACTORY_ADDRESS_MAP, WNATIVE } from '@dex/sdk'
import { FACTORY_ADDRESSES, FeeAmount } from '@dex/v3-sdk'
import { CHAINS } from 'config/chains'
import DEFAULT_TOKEN_LIST from 'config/constants/tokenLists/default.tokenlist.json'
import { getViemClients } from 'utils/viem'
import {
  Address,
  decodeEventLog,
  encodeEventTopics,
  erc20Abi,
  formatUnits,
  getAddress,
  Hex,
  parseAbi,
  zeroAddress,
} from 'viem'
import { PairData, PoolData, TokenInfo } from './types'

const v2FactoryAbi = parseAbi([
  'function allPairsLength() view returns (uint256)',
  'function allPairs(uint256) view returns (address)',
])
const v2PairAbi = parseAbi([
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
])
const v3PoolAbi = parseAbi([
  'function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint32 feeProtocol, bool unlocked)',
])
const v3FactoryAbi = parseAbi(['function getPool(address, address, uint24) view returns (address)'])
const V3_FEE_TIERS = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH]
const poolCreatedAbi = parseAbi([
  'event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)',
])
const [POOL_CREATED_TOPIC] = encodeEventTopics({ abi: poolCreatedAbi, eventName: 'PoolCreated' })

// Blockscout's etherscan-compatible getLogs returns at most 1000 logs per request
const BLOCKSCOUT_MAX_LOGS = 1000

interface RawPool {
  address: Address
  version: 'v2' | 'v3'
  fee?: number
  token0: Address
  token1: Address
  balance0: bigint
  balance1: bigint
  sqrtPriceX96?: bigint
}

interface BlockscoutLog {
  blockNumber: Hex
  data: Hex
  topics: [Hex, ...Hex[]]
}

const getClient = (chainId: ChainId) => getViemClients({ chainId })

async function getV2Pools(chainId: ChainId): Promise<RawPool[]> {
  const client = getClient(chainId)
  const factory = FACTORY_ADDRESS_MAP[chainId]
  const length = await client.readContract({ address: factory, abi: v2FactoryAbi, functionName: 'allPairsLength' })
  const addresses = (await client.multicall({
    allowFailure: false,
    contracts: Array.from(
      { length: Number(length) },
      (_, i) => ({ address: factory, abi: v2FactoryAbi, functionName: 'allPairs', args: [BigInt(i)] }) as const,
    ),
  })) as Address[]
  const pairCalls = <F extends 'token0' | 'token1' | 'getReserves'>(functionName: F) =>
    addresses.map((address) => ({ address, abi: v2PairAbi, functionName }) as const)
  const [token0s, token1s, reserves] = await Promise.all([
    client.multicall({ allowFailure: false, contracts: pairCalls('token0') }),
    client.multicall({ allowFailure: false, contracts: pairCalls('token1') }),
    client.multicall({ allowFailure: false, contracts: pairCalls('getReserves') }),
  ])

  return addresses.map((address, i) => ({
    address,
    version: 'v2',
    token0: token0s[i] as Address,
    token1: token1s[i] as Address,
    balance0: (reserves[i] as readonly [bigint, bigint, number])[0],
    balance1: (reserves[i] as readonly [bigint, bigint, number])[1],
  }))
}

async function getV3PoolCreatedLogs(chainId: ChainId): Promise<BlockscoutLog[]> {
  const explorer = CHAINS.find((chain) => chain.id === chainId)?.blockExplorers?.default.url
  if (!explorer) throw new Error(`No block explorer configured for chain ${chainId}`)

  const logs: BlockscoutLog[] = []
  let fromBlock = 0
  for (;;) {
    const params = new URLSearchParams({
      module: 'logs',
      action: 'getLogs',
      fromBlock: String(fromBlock),
      toBlock: 'latest',
      address: FACTORY_ADDRESSES[chainId],
      topic0: POOL_CREATED_TOPIC,
    })
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(`${explorer}/api?${params}`)
    if (!res.ok) throw new Error(`Blockscout getLogs failed: ${res.status}`)
    // eslint-disable-next-line no-await-in-loop
    const json = (await res.json()) as { message: string; result: BlockscoutLog[] | null }
    if (!Array.isArray(json.result)) throw new Error(`Blockscout getLogs failed: ${json.message}`)

    logs.push(...json.result)
    if (json.result.length < BLOCKSCOUT_MAX_LOGS) return logs
    // the next page starts at the last block seen; duplicates are removed by the caller
    fromBlock = Number(json.result[json.result.length - 1].blockNumber)
  }
}

// Pools created before the explorer's indexed history have no logs, so pools are also discovered by asking the
// factory for every pair of known tokens at every fee tier. Logs still catch pools of tokens we don't know about.
async function getV3Pools(chainId: ChainId, knownTokens: Address[]): Promise<RawPool[]> {
  const client = getClient(chainId)
  const factory = FACTORY_ADDRESSES[chainId]
  const created = new Map<Address, { token0: Address; token1: Address; fee: number }>()

  const logs = await getV3PoolCreatedLogs(chainId).catch((error) => {
    console.error('Failed to fetch V3 PoolCreated logs, using factory lookups only', error)
    return []
  })
  for (const log of logs) {
    const { args } = decodeEventLog({ abi: poolCreatedAbi, data: log.data, topics: log.topics })
    created.set(getAddress(args.pool), { token0: args.token0, token1: args.token1, fee: args.fee })
  }

  const tokens = [
    ...new Set(
      [...knownTokens, ...[...created.values()].flatMap((p) => [p.token0, p.token1])].map((a) => a.toLowerCase()),
    ),
  ].sort() as Address[]
  const candidates = tokens.flatMap((tokenA, i) =>
    tokens.slice(i + 1).flatMap((tokenB) => V3_FEE_TIERS.map((fee) => ({ token0: tokenA, token1: tokenB, fee }))),
  )
  const found = await client.multicall({
    allowFailure: true,
    contracts: candidates.map(
      ({ token0, token1, fee }) =>
        ({ address: factory, abi: v3FactoryAbi, functionName: 'getPool', args: [token0, token1, fee] }) as const,
    ),
  })
  found.forEach((res, i) => {
    if (res.status === 'success' && res.result !== zeroAddress) {
      const { token0, token1, fee } = candidates[i]
      created.set(getAddress(res.result), { token0: getAddress(token0), token1: getAddress(token1), fee })
    }
  })
  const pools = [...created.entries()]

  const balanceCalls = (side: 'token0' | 'token1') =>
    pools.map(
      ([pool, info]) =>
        ({
          address: info[side],
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [pool],
        }) as const,
    )
  const [slot0s, balance0s, balance1s] = await Promise.all([
    client.multicall({
      allowFailure: true,
      contracts: pools.map(([address]) => ({ address, abi: v3PoolAbi, functionName: 'slot0' }) as const),
    }),
    client.multicall({ allowFailure: true, contracts: balanceCalls('token0') }),
    client.multicall({ allowFailure: true, contracts: balanceCalls('token1') }),
  ])

  return pools.flatMap(([address, info], i) => {
    const slot0 = slot0s[i]
    if (slot0.status !== 'success') return []
    return [
      {
        address,
        version: 'v3' as const,
        fee: info.fee,
        token0: info.token0,
        token1: info.token1,
        balance0: balance0s[i].status === 'success' ? (balance0s[i].result as bigint) : 0n,
        balance1: balance1s[i].status === 'success' ? (balance1s[i].result as bigint) : 0n,
        sqrtPriceX96: slot0.result[0],
      },
    ]
  })
}

async function getTokens(chainId: ChainId, addresses: Address[]): Promise<Map<string, TokenInfo>> {
  const client = getClient(chainId)
  const tokenCalls = <F extends 'symbol' | 'decimals'>(functionName: F) =>
    addresses.map((address) => ({ address, abi: erc20Abi, functionName }) as const)
  const [symbols, decimals] = await Promise.all([
    client.multicall({ allowFailure: true, contracts: tokenCalls('symbol') }),
    client.multicall({ allowFailure: true, contracts: tokenCalls('decimals') }),
  ])

  const tokens = new Map<string, TokenInfo>()
  addresses.forEach((address, i) => {
    if (decimals[i].status !== 'success') return
    tokens.set(address.toLowerCase(), {
      address: getAddress(address),
      symbol: symbols[i].status === 'success' ? (symbols[i].result as string) : `${address.slice(0, 6)}…`,
      decimals: decimals[i].result as number,
    })
  })
  return tokens
}

export async function fetchPoolsInfo(chainId: ChainId): Promise<PairData[]> {
  const v2Pools = await getV2Pools(chainId)
  const knownTokens = [
    ...DEFAULT_TOKEN_LIST.tokens.filter((t) => t.chainId === chainId).map((t) => t.address as Address),
    ...v2Pools.flatMap((pool) => [pool.token0, pool.token1]),
  ]
  const rawPools = [...v2Pools, ...(await getV3Pools(chainId, knownTokens))]
  const tokens = await getTokens(chainId, [
    ...new Set(rawPools.flatMap((pool) => [pool.token0.toLowerCase(), pool.token1.toLowerCase()])),
  ] as Address[])

  const pools: PoolData[] = rawPools.flatMap((raw) => {
    const token0 = tokens.get(raw.token0.toLowerCase())
    const token1 = tokens.get(raw.token1.toLowerCase())
    if (!token0 || !token1) return []
    const reserve0 = Number(formatUnits(raw.balance0, token0.decimals))
    const reserve1 = Number(formatUnits(raw.balance1, token1.decimals))
    const sqrtPrice = raw.sqrtPriceX96 !== undefined ? Number(raw.sqrtPriceX96) / 2 ** 96 : undefined
    const price01 =
      sqrtPrice !== undefined
        ? sqrtPrice * sqrtPrice * 10 ** (token0.decimals - token1.decimals)
        : reserve0 > 0
          ? reserve1 / reserve0
          : 0
    return [
      {
        address: raw.address,
        version: raw.version,
        fee: raw.fee,
        token0,
        token1,
        reserve0,
        reserve1,
        price01,
        tvlZIL: 0,
      },
    ]
  })

  // Price every token in ZIL from its deepest pool against the wrapped native token
  const wnative = WNATIVE[chainId].address.toLowerCase()
  const zilPrices = new Map<string, { price: number; depth: number }>([[wnative, { price: 1, depth: Infinity }]])
  for (const pool of pools) {
    const [a, b] = [pool.token0.address.toLowerCase(), pool.token1.address.toLowerCase()]
    const quote =
      b === wnative && a !== wnative
        ? { token: a, price: pool.price01, depth: pool.reserve1 }
        : a === wnative && b !== wnative && pool.price01 > 0
          ? { token: b, price: 1 / pool.price01, depth: pool.reserve0 }
          : undefined
    if (quote && quote.price > 0 && quote.depth > (zilPrices.get(quote.token)?.depth ?? 0)) {
      zilPrices.set(quote.token, { price: quote.price, depth: quote.depth })
    }
  }
  const zilPrice = (token: TokenInfo) => zilPrices.get(token.address.toLowerCase())?.price ?? 0
  for (const pool of pools) {
    pool.tvlZIL = pool.reserve0 * zilPrice(pool.token0) + pool.reserve1 * zilPrice(pool.token1)
  }

  const pairs = new Map<string, PairData>()
  for (const pool of pools) {
    // Quote pairs against the wrapped native token where it is one side
    const flip = pool.token0.address.toLowerCase() === wnative
    const [token0, token1] = flip ? [pool.token1, pool.token0] : [pool.token0, pool.token1]
    const price01 = flip ? (pool.price01 > 0 ? 1 / pool.price01 : 0) : pool.price01
    const key = [token0.address, token1.address]
      .map((address) => address.toLowerCase())
      .sort()
      .join('-')
    const pair = pairs.get(key)
    if (!pair) {
      pairs.set(key, { key, token0, token1, pools: [pool], price01, tvlZIL: pool.tvlZIL })
    } else {
      // the pair price comes from its deepest pool, in the pair's own token order
      const deepest = pool.tvlZIL > Math.max(...pair.pools.map((p) => p.tvlZIL))
      const sameOrder = pair.token0.address === token0.address
      pair.pools.push(pool)
      pair.tvlZIL += pool.tvlZIL
      if (deepest) pair.price01 = sameOrder ? price01 : price01 > 0 ? 1 / price01 : 0
    }
  }

  return [...pairs.values()]
    .map((pair) => ({ ...pair, pools: pair.pools.sort((a, b) => b.tvlZIL - a.tvlZIL) }))
    .sort((a, b) => b.tvlZIL - a.tvlZIL)
}
