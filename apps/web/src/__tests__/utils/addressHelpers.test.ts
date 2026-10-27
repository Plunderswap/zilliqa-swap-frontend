import { ChainId } from '@dex/chains'
import { getAddressFromMap } from 'utils/addressHelpers'

describe('getAddressFromMap', () => {
  const address = {
    [ChainId.ZILLIQA]: '0x38899EFB93d5106D3aDb86662C557f237F6eCF57',
    [ChainId.ZILLIQA_TESTNET]: '0x3c2Ffc98284b2F6e1035EAEeD75E9273B5B63223',
  } as const

  it('gets the Zilliqa mainnet address', () => {
    expect(getAddressFromMap(address, ChainId.ZILLIQA)).toEqual(address[ChainId.ZILLIQA])
  })

  it('gets the Zilliqa testnet address', () => {
    expect(getAddressFromMap(address, ChainId.ZILLIQA_TESTNET)).toEqual(address[ChainId.ZILLIQA_TESTNET])
  })

  it('falls back to Zilliqa mainnet', () => {
    expect(getAddressFromMap(address, 31337)).toEqual(address[ChainId.ZILLIQA])
  })
})
