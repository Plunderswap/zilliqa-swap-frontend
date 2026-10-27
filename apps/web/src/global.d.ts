import type { EIP1193Provider } from 'viem'

export interface ExtendEthereum extends EIP1193Provider {
  isSafePal?: true
  isCoin98?: true
  isBlocto?: true
  isMathWallet?: true
  isTrustWallet?: true
  isBlocto?: true
  isBinance?: true
  isZilPay?: true
  isTorch?: true
  isTrust?: true
  isCoinbaseWallet?: true
  isTokenPocket?: true
  isMetaMask?: true
  isBraveWallet?: true
  isRabby?: true
  providers?: ExtendEthereum[]
  on: (event: string, listener: (...args: unknown[]) => void) => void
  removeListener: (event: string, listener: (...args: unknown[]) => void) => void
}

declare module '*.css'

declare global {
  interface Window {
    bn: any
    coin98?: true
    mercuryoWidget?: any
    ethereum?: ExtendEthereum
    BinanceChain?: {
      bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
      switchNetwork?: (networkId: string) => Promise<string>
    } & Ethereum
  }
}

export {}
