import { zilliqa, zilliqaTestnet } from 'config/chains'
/**
 * Note: exported as public Type
 */
export type isZilliqaOptions = {
  chainId: number
  isMainnetOnly?: boolean // If the chainId check is only allowed on mainnet
}

/**
 * isZilliqa
 *  - Checks if the paymaster operations chain id is valid
 *  - Only allows the Zilliqa and Zilliqa Testnet chain ids
 */
export function isZilliqa({ chainId, isMainnetOnly = false }: isZilliqaOptions): boolean {
  // If only Zilliqa mainnet
  if (isMainnetOnly && chainId === zilliqa.id) {
    return true
  }
  // If only Zilliqa or Zilliqa Testnet
  if (!isMainnetOnly && (chainId === zilliqaTestnet.id || chainId === zilliqa.id)) {
    return true
  }
  return false
}
