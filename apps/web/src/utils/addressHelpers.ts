import { ChainId } from '@dex/chains'
import addresses from 'config/constants/contracts'
import { Address } from 'viem'

export type Addresses = Partial<Record<number, Address>>

export const getAddressFromMap = (address: Addresses, chainId: number = ChainId.ZILLIQA): Address => {
  return (address[chainId] ?? address[ChainId.ZILLIQA])!
}

export const getMulticallAddress = (chainId?: ChainId) => getAddressFromMap(addresses.multiCall, chainId)
