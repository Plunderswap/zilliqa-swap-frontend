import { ERC20Token, Native } from '@dex/sdk'
import { ChainId } from '@dex/chains'
import * as Tokens from '@dex/tokens'
import { zeroAddress } from 'viem'

export { WETH9 } from '@dex/sdk'

const MockToken: Record<ChainId, ERC20Token> = (() => {
  const tokens: Record<ChainId, ERC20Token> = {} as Record<ChainId, ERC20Token>

  for (const chainId in ChainId) {
    if (!Number.isNaN(Number(chainId))) {
      const id = Number(chainId) as unknown as ChainId
      tokens[id] = new ERC20Token(id, zeroAddress, 18, 'MockToken')
    }
  }

  return tokens
})()

export const ETHER = {
  on(chainId: ChainId): Native {
    return Native.onChain(chainId)
  },
}

export const TKN = MockToken

export const USDT = {
  ...Tokens.USDT,
  [ChainId.BSC_TESTNET]: new ERC20Token(ChainId.BSC_TESTNET, '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', 6, 'USDT'),
  // @notice: use USDC in goerli instead of
  [ChainId.GOERLI]: new ERC20Token(ChainId.GOERLI, zeroAddress, 6, 'USDT'),

  // @notice: temporary ignore missed testnet address
  [ChainId.ZKSYNC_TESTNET]: new ERC20Token(ChainId.ZKSYNC_TESTNET, zeroAddress, 6, 'USDT'),
  [ChainId.ARBITRUM_GOERLI]: new ERC20Token(ChainId.ARBITRUM_GOERLI, zeroAddress, 6, 'USDT'),
  [ChainId.SCROLL_SEPOLIA]: new ERC20Token(ChainId.SCROLL_SEPOLIA, zeroAddress, 6, 'USDT'),
  [ChainId.LINEA_TESTNET]: new ERC20Token(ChainId.LINEA_TESTNET, zeroAddress, 6, 'USDT'),
  [ChainId.BASE]: new ERC20Token(ChainId.BASE, zeroAddress, 6, 'USDT'),
  [ChainId.BASE_TESTNET]: new ERC20Token(ChainId.BASE_TESTNET, zeroAddress, 6, 'USDT'),
}
export const USDC = {
  ...MockToken,
  ...Tokens.USDC,
  // @notice: temporary ignore missed testnet address
  [ChainId.POLYGON_ZKEVM_TESTNET]: new ERC20Token(ChainId.POLYGON_ZKEVM_TESTNET, zeroAddress, 6, '_USDC'),
}

export const BUSD = {
  ...MockToken,
  ...Tokens.BUSD,
}

export const WBNB = {
  ...MockToken,
  [ChainId.BSC]: Tokens.bscTokens.wbnb,
}
