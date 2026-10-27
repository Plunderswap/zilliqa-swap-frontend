import { Token, WNATIVE } from '@dex/sdk'
import { ChainId } from '@dex/chains'

export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return WNATIVE[chainId] ?? null
}
