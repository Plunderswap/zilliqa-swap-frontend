import { CHAINS } from 'config/chains'
import { PUBLIC_NODES } from 'config/nodes'
import { Chain, createPublicClient, fallback, http } from 'viem'

export const chains = CHAINS as unknown as readonly [Chain, ...Chain[]]

const createTransport = (chainId: number) => fallback(PUBLIC_NODES[chainId]?.map((url) => http(url)) ?? [http()])

export const transports = {
  [chains[0].id]: createTransport(chains[0].id),
  [chains[1].id]: createTransport(chains[1].id),
}

export const publicClient = ({ chainId }: { chainId: number }) => {
  const chain = chains.find(({ id }) => id === chainId) as Chain

  return createPublicClient({
    chain,
    transport: createTransport(chainId),
    batch: {
      multicall: {
        batchSize: 1024 * 200,
        wait: 16,
      },
    },
    pollingInterval: 6_000,
  })
}
