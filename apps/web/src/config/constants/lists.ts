import { ChainId } from '@dex/chains'

// The default token list is bundled from config/constants/tokenLists/default.tokenlist.json.
// Add hosted list URLs here to also fetch them at runtime.
export const OFFICIAL_LISTS: string[] = []
export const UNSUPPORTED_LIST_URLS: string[] = []
export const WARNING_LIST_URLS: string[] = []
export const DEFAULT_LIST_OF_LISTS: string[] = []
export const DEFAULT_ACTIVE_LIST_URLS: string[] = []

export const MULTI_CHAIN_LIST_URLS: Partial<Record<ChainId, string[]>> = {
  [ChainId.ZILLIQA_TESTNET]: [],
  [ChainId.ZILLIQA]: [],
}
