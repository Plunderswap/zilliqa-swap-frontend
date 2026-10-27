import { Percent as SdkPercent } from '@dex/sdk'

export function encodeFeeBips(fee: SdkPercent): string {
  return fee.multiply(10_000).quotient.toString()
}
