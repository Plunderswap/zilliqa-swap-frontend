// Tokens bridged via X-Bridge, which no longer have backing after the X-Bridge hack
const UNBACKED_TOKEN_ADDRESSES = [
  '0xe59f97Fac09ee00AEEF320485ee45D5CcfbBC1E9', // zUSDC
  '0x2274005778063684fbB1BfA96a2b725dC37D75f9', // zUSDT
  '0x2938fF251Aecc1dfa768D7d0276eB6d073690317', // zWBTC
  '0xCcF3Ea256d42Aeef0EE0e39Bfc94bAa9Fa14b0Ba', // XCAD
].map((address) => address.toLowerCase())

// ERC20 proxies for ZRC2 tokens, exploitable via the zq2 interop bug (transfers discarded at commit)
const ZRC2_PROXY_TOKEN_ADDRESSES = [
  '0xe64cA52EF34FdD7e20C0c7fb2E392cc9b4F6D049', // SEED
  '0x2274005778063684fbB1BfA96a2b725dC37D75f9', // zUSDT
  '0x01035e423c40a9ad4F6be2E6cC014EB5617c8Bd6', // ZOGE
  '0x097C26F8A93009fd9d98561384b5014D64ae17C2', // stZIL
  '0x03A79429acc808e4261a68b0117aCD43Cb0FdBfa', // gZIL
  '0xCcF3Ea256d42Aeef0EE0e39Bfc94bAa9Fa14b0Ba', // XCAD
  '0x2938fF251Aecc1dfa768D7d0276eB6d073690317', // zWBTC
  '0x9C3fE3f471d8380297e4fB222eFb313Ee94DFa0f', // ZILPEPE
  '0x20Dd5D5B5d4C72676514A0eA1052d0200003d69D', // VOID
  '0x7D2fF48c6b59229d448473D267a714d29F078D3E', // STREAM
  '0xE9D47623bb2B3C497668B34fcf61E101a7ea4058', // Lunr
  '0xc6F3dede529Af9D98a11C5B32DbF03Bf34272ED5', // GARY
  '0xbfDe2156aF75a29d36614bC1F8005DD816Bd9200', // ZHIB
  '0x63B991C17010C21250a0eA58C6697F696a48cdf3', // HRSE
  '0x241c677D9969419800402521ae87C411897A029f', // FPS
].map((address) => address.toLowerCase())

export const isUnbackedToken = (address?: string) =>
  Boolean(address && UNBACKED_TOKEN_ADDRESSES.includes(address.toLowerCase()))

export const isZrc2ProxyToken = (address?: string) =>
  Boolean(address && ZRC2_PROXY_TOKEN_ADDRESSES.includes(address.toLowerCase()))
