import { ChainId, ERC20Token, WZIL } from '@dex/sdk'

export const zilliqaTokens = {
  wzil: WZIL[ChainId.ZILLIQA],
  // zil here points to the wzil contract. Wherever the currency ZIL is required, conditional checks for the symbol 'ZIL' can be used
  zil: new ERC20Token(
    ChainId.ZILLIQA,
    '0x94e18aE7dd5eE57B55f30c4B63E2760c09EFb192',
    18,
    'ZIL',
    'ZIL',
    'https://www.zilliqa.com/',
  ),
  usdc: new ERC20Token(
    ChainId.ZILLIQA,
    '0xe59f97Fac09ee00AEEF320485ee45D5CcfbBC1E9',
    6,
    'zUSDC',
    'zUSDC',
    'https://www.centre.io/usdc',
  ),
  usdt: new ERC20Token(
    ChainId.ZILLIQA,
    '0x2274005778063684fbB1BfA96a2b725dC37D75f9',
    6,
    'zUSDT',
    'Zilliqa-bridged USDT',
    'https://tether.to/',
  ),
  kusd: new ERC20Token(
    ChainId.ZILLIQA,
    '0xE9df5b4b1134A3aadf693Db999786699B016239e',
    6,
    'kUSD',
    'Kalijo USD',
    'https://kalijo.io/',
  ),
  pzil: new ERC20Token(
    ChainId.ZILLIQA,
    '0xc85b0db68467dede96A7087F4d4C47731555cA7A',
    18,
    'pZIL',
    'PlunderSwap Staked ZIL',
    'https://plunderswap.com/',
  ),
  seed: new ERC20Token(
    ChainId.ZILLIQA,
    '0xe64cA52EF34FdD7e20C0c7fb2E392cc9b4F6D049',
    18,
    'SEED',
    'Kalijo',
    'https://kalijo.io/',
  ),
  tacocat: new ERC20Token(ChainId.ZILLIQA, '0x2ae05bfc681d7872209a3bf1a9513bd4a48e66f0', 18, 'TACO', 'TacoCat', ''),
  guacamole: new ERC20Token(ChainId.ZILLIQA, '0x87f059cb6e481F9CD9a3F92D876DBDc68e30Ea3B', 18, 'GUAC', 'Guacamole', ''),
}
