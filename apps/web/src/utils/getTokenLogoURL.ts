import { Token } from '@dex/sdk'
import memoize from 'lodash/memoize'
import { isAddress } from 'viem'

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token && isAddress(token.address)) {
      return `/images/tokens/${token.address}.png`
    }
    return null
  },
  (t) => `${t?.chainId}#${t?.address}`,
)

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address && chainId && isAddress(address)) {
      return `/images/tokens/${address}.png`
    }
    return null
  },
  (address, chainId) => `${chainId}#${address}`,
)

export default getTokenLogoURL
