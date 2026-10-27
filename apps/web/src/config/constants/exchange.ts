import { ChainId } from '@dex/chains'
import { Percent, Token, WNATIVE } from '@dex/sdk'
import { USDC, USDT, zilliqaTestnetTokens, zilliqaTokens } from '@dex/tokens'
import { ChainTokenList } from './types'

export { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES, V2_ROUTER_ADDRESS } from '@dex/smart-router'

export const CHAIN_REFRESH_TIME = {
  [ChainId.ZILLIQA]: 30_000,
  [ChainId.ZILLIQA_TESTNET]: 25_000,
} as const satisfies Partial<Record<ChainId, number>>

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ZILLIQA]: [
    USDC[ChainId.ZILLIQA],
    zilliqaTokens.kusd,
    zilliqaTokens.pzil,
    zilliqaTokens.seed,
    USDT[ChainId.ZILLIQA],
  ],
  [ChainId.ZILLIQA_TESTNET]: [zilliqaTestnetTokens.usdc, zilliqaTestnetTokens.kusd],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ZILLIQA]: [WNATIVE[ChainId.ZILLIQA], USDC[ChainId.ZILLIQA], USDT[ChainId.ZILLIQA], zilliqaTokens.kusd],
  [ChainId.ZILLIQA_TESTNET]: [zilliqaTestnetTokens.wzil, zilliqaTestnetTokens.usdc, zilliqaTestnetTokens.kusd],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.ZILLIQA]: [
    [WNATIVE[ChainId.ZILLIQA], USDC[ChainId.ZILLIQA]],
    [WNATIVE[ChainId.ZILLIQA], USDT[ChainId.ZILLIQA]],
    [WNATIVE[ChainId.ZILLIQA], zilliqaTokens.kusd],
  ],
  [ChainId.ZILLIQA_TESTNET]: [
    [zilliqaTestnetTokens.usdc, zilliqaTestnetTokens.wzil],
    [zilliqaTestnetTokens.kusd, zilliqaTestnetTokens.wzil],
  ],
}

export const BIG_INT_ZERO = 0n
export const BIG_INT_TEN = 10n

// one basis point
export const BIPS_BASE = 10000n
export const ONE_BIPS = new Percent(1n, BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(100n, BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(300n, BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(500n, BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(1000n, BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(1500n, BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: bigint = BIG_INT_TEN ** 15n // .001 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(35n, BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

export const DEFAULT_INPUT_CURRENCY = 'ZIL'
export const DEFAULT_OUTPUT_CURRENCY = '0xe59f97Fac09ee00AEEF320485ee45D5CcfbBC1E9'

export const EXCHANGE_PAGE_PATHS = ['/swap', '/liquidity', '/add', '/remove', '/increase', '/v2']
