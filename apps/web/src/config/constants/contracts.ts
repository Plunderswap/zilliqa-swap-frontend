import { ChainId } from '@dex/chains'
import { Address } from 'viem'

export default {
  multiCall: {
    [ChainId.ZILLIQA]: '0x38899EFB93d5106D3aDb86662C557f237F6eCF57',
    [ChainId.ZILLIQA_TESTNET]: '0x3c2Ffc98284b2F6e1035EAEeD75E9273B5B63223',
  },
  nftPositionManager: {
    [ChainId.ZILLIQA]: '0x17678B52997B89b179c0a471bF8d266A4A4c6AC5',
    [ChainId.ZILLIQA_TESTNET]: '0x3a7ef9Ad056D21E62a067619562bCdAEc8988b10',
  },
} as const satisfies Record<string, Partial<Record<ChainId, Address>>>
