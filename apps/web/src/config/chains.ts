import { ChainId } from '@dex/chains'
import memoize from 'lodash/memoize'
import { defineChain } from 'viem'

export const zilliqaTestnet = defineChain({
  id: 33101,
  name: 'Zilliqa Testnet',
  network: 'zilliqaTestnet',
  nativeCurrency: { name: 'Zilliqa', symbol: 'ZIL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://api.testnet.zilliqa.com'],
    },
    public: {
      http: ['https://api.testnet.zilliqa.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://testnet.zilliqa.blockscout.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0x3c2Ffc98284b2F6e1035EAEeD75E9273B5B63223',
      blockCreated: 5313022,
    },
  },
  testnet: true,
})

export const zilliqa = defineChain({
  id: 32769,
  name: 'Zilliqa',
  network: 'Zilliqa',
  nativeCurrency: { name: 'Zilliqa', symbol: 'ZIL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://api.zilliqa.com'],
    },
    public: {
      http: ['https://api.zilliqa.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://zilliqa.blockscout.com',
    },
  },
  contracts: {
    multicall3: {
      address: '0x38899EFB93d5106D3aDb86662C557f237F6eCF57',
      blockCreated: 3251173,
    },
  },
})

export const CHAIN_QUERY_NAME: Partial<Record<ChainId, string>> = {
  [ChainId.ZILLIQA]: 'zilliqa',
  [ChainId.ZILLIQA_TESTNET]: 'zilliqaTestnet',
}

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce(
  (acc, [chainId, chainName]) => {
    return {
      [chainName.toLowerCase()]: chainId as unknown as ChainId,
      ...acc,
    }
  },
  {} as Record<string, ChainId>,
)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = []

export const CHAINS = [zilliqa, zilliqaTestnet]
