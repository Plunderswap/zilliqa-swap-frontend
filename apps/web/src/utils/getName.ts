import { Address, Chain } from 'viem'
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes'
import { getChainPublicClient } from './getChainPublicClient'
import { isZilliqa } from './isZilliqa'

export type Zilname = `${string}.zil` | `${string}.test.zil`

const resolverAbi = [
  {
    inputs: [{ name: 'node', type: 'bytes32' }],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const getName = async ({ address, chain }: { address: Address; chain: Chain }): Promise<Zilname | null> => {
  if (!isZilliqa({ chainId: chain.id })) return null

  try {
    const zilname = await getChainPublicClient(chain).readContract({
      abi: resolverAbi,
      address: '0x5c0c7BFd25efCAE366fE62219fD5558305Ffc46F',
      functionName: 'name',
      args: [convertReverseNodeToBytes(address, chain.id)],
    })
    return zilname ? (zilname as Zilname) : null
  } catch {
    return null
  }
}
