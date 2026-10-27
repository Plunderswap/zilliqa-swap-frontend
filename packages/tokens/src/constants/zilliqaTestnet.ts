import { ChainId, ERC20Token, WZIL } from '@dex/sdk'

export const zilliqaTestnetTokens = {
  wzil: WZIL[ChainId.ZILLIQA_TESTNET],
  // zil here points to the wzil contract. Wherever the currency ZIL is required, conditional checks for the symbol 'ZIL' can be used
  zil: new ERC20Token(
    ChainId.ZILLIQA_TESTNET,
    '0x878c5008A348A60a5B239844436A7b483fAdb7F2',
    18,
    'ZIL',
    'ZIL',
    'https://www.zilliqa.com/',
  ),
  usdc: new ERC20Token(
    ChainId.ZILLIQA_TESTNET,
    '0x1fD09F6701a1852132A649fe9D07F2A3b991eCfA',
    18,
    'USDC',
    'USD Coin',
    'https://www.centre.io/usdc',
  ),
  kusd: new ERC20Token(
    ChainId.ZILLIQA_TESTNET,
    '0xaD581eC62eA08831c8FE2Cd7A1113473fE40A057',
    6,
    'kUSD',
    'Kalijo USD',
    'https://kalijo.io/',
  ),
  stream: new ERC20Token(
    ChainId.ZILLIQA_TESTNET,
    '0x51b9F3DDB948Bcc16b89B48d83b920bc01dbed55',
    18,
    'STREAM',
    'TestSTREAM',
    'https://zilstream.com',
  ),
}
