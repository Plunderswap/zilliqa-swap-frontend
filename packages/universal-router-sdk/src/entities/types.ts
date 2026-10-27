import { PermitSingle } from '@dex/permit2-sdk'
import { BigintIsh } from '@dex/sdk'
import { SwapOptions } from '@dex/smart-router'
import { Address } from 'viem'

export interface Permit2Signature extends PermitSingle {
  signature: `0x${string}`
}

export type SwapRouterConfig = {
  sender?: Address // address
  deadline?: BigintIsh | undefined
}

export type FlatFeeOptions = {
  amount: BigintIsh
  recipient: Address
}

export type UniversalRouterSwapOptions = Omit<SwapOptions, 'inputTokenPermit'> & {
  inputTokenPermit?: Permit2Signature
  flatFee?: FlatFeeOptions
}
