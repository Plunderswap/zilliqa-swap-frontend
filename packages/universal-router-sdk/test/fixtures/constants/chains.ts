import { ChainId } from '@dex/chains'
import { defineChain } from 'viem'

export const zilliqa = defineChain({
  id: ChainId.ZILLIQA,
  name: 'Zilliqa',
  nativeCurrency: { name: 'Zilliqa', symbol: 'ZIL', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.zilliqa.com'] },
  },
})

export const zilliqaTestnet = defineChain({
  id: ChainId.ZILLIQA_TESTNET,
  name: 'Zilliqa Testnet',
  nativeCurrency: { name: 'Zilliqa', symbol: 'ZIL', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.testnet.zilliqa.com'] },
  },
  testnet: true,
})

export const CHAINS = [zilliqa, zilliqaTestnet]
