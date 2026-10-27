import { ChainId } from '@dex/chains'
import { createFileRoute } from '@tanstack/react-router'
import { fetchPoolsInfo } from 'views/PoolsInfo/api'

const POOLS_TTL_SECONDS = 60 * 60
const PRICE_TTL_SECONDS = 6 * 60 * 60
const SUPPORTED_CHAINS: number[] = [ChainId.ZILLIQA, ChainId.ZILLIQA_TESTNET]
const ZIL_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=zilliqa&vs_currencies=usd'

async function fetchZilUsd(): Promise<number | null> {
  try {
    const res = await fetch(ZIL_PRICE_URL, {
      headers: { accept: 'application/json', 'user-agent': 'swap-frontend' },
      cf: { cacheTtl: PRICE_TTL_SECONDS, cacheEverything: true },
    })
    if (!res.ok) {
      console.error('Failed to fetch ZIL price', res.status, await res.text())
      return null
    }
    const json = (await res.json()) as { zilliqa?: { usd?: unknown } }
    return typeof json.zilliqa?.usd === 'number' ? json.zilliqa.usd : null
  } catch (error) {
    console.error('Failed to fetch ZIL price', error)
    return null
  }
}

// Building the pool list takes several RPC and explorer calls, so the result is cached at the edge for an hour
export const Route = createFileRoute('/api/pools')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const chainId = Number(new URL(request.url).searchParams.get('chainId'))
        if (!SUPPORTED_CHAINS.includes(chainId)) {
          return new Response(null, { status: 400, statusText: 'Bad Request' })
        }

        const cache = (caches as unknown as { default: Cache }).default
        const cacheKey = new Request(new URL(`/api/pools?chainId=${chainId}`, request.url).toString())
        const cached = await cache.match(cacheKey)
        // cached responses have immutable headers, and middleware adds headers to every response
        if (cached) return new Response(cached.body, cached)

        const [pairs, zilUsd] = await Promise.all([fetchPoolsInfo(chainId), fetchZilUsd()])
        const response = Response.json(
          { pairs, zilUsd, updatedAt: new Date().toISOString() },
          { headers: { 'Cache-Control': `public, max-age=${POOLS_TTL_SECONDS}` } },
        )
        await cache.put(cacheKey, response.clone())
        return response
      },
    },
  },
})
