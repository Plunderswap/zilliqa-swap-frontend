import { BigintIsh } from '@dex/swap-sdk-core'

export function toBigInt(num: BigintIsh): bigint {
  return BigInt(num.toString())
}
