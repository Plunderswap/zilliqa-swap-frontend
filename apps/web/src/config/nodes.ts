import { ChainId } from '@dex/chains'

export const SERVER_NODES = {
  [ChainId.ZILLIQA]: ['https://api.zilliqa.com'],
  [ChainId.ZILLIQA_TESTNET]: ['https://api.testnet.zilliqa.com'],
} satisfies Partial<Record<ChainId, readonly string[]>>

export const PUBLIC_NODES = SERVER_NODES
