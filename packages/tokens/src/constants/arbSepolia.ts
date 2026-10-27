import { ChainId } from '@dex/chains'
import { WETH9 } from '@dex/sdk'
import { USDC } from './common'

export const arbSepoliaTokens = {
  weth: WETH9[ChainId.ARBITRUM_SEPOLIA],
  usdc: USDC[ChainId.ARBITRUM_SEPOLIA],
}
