import Cookies from 'js-cookie'

export const formatNumber = (value: string | number, decimals = 2): string => {
  const num = Number(value)
  if (Number.isNaN(num)) return '0'

  if (num > 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`
  }
  if (num > 1000) {
    return `${(num / 1000).toFixed(decimals)}K`
  }
  return num.toFixed(decimals)
}

export const formatNumberWithDynamicDecimals = (value: number, isPrice = false): string => {
  if (value === 0) return '0'

  if (isPrice) {
    if (value < 1) {
      // Convert to string to handle scientific notation
      const str = value.toString()

      // If in scientific notation, convert to decimal
      if (str.includes('e')) {
        const [base, exponent] = str.split('e')
        const exp = parseInt(exponent)
        // eslint-disable-next-line no-param-reassign
        value = parseFloat(base) * 10 ** exp
      }

      // Find first non-zero digit after decimal
      let decimals = 0
      let tempValue = value
      while (tempValue < 0.1) {
        decimals++
        tempValue *= 10
      }

      // Add 4 more decimal places after first significant digit
      return value.toFixed(decimals + 4)
    }
    return value.toFixed(2)
  }

  let decimals = 2
  let tempValue = value

  // Increase decimals until we find a non-zero number
  while (tempValue < 0.01 && decimals < 8) {
    decimals++
    tempValue *= 10
  }

  return value.toFixed(decimals)
}

export const formatTokenSymbol = (symbol: string): string => {
  return symbol === 'WZIL' ? 'ZIL' : symbol
}

export const formatFee = (pool: { version: 'v2' | 'v3'; fee?: number }) =>
  pool.version === 'v2' ? '0.35' : String((pool.fee ?? 0) / 10000)

const HIDE_SMALL_POOLS_COOKIE = 'pools_info_hide_small_pools'

export const getStoredHideSmallPools = (): boolean => {
  const stored = Cookies.get(HIDE_SMALL_POOLS_COOKIE)
  return stored ? stored === 'true' : true // default to true
}

export const setStoredHideSmallPools = (value: boolean) => {
  Cookies.set(HIDE_SMALL_POOLS_COOKIE, value.toString(), { expires: 365 })
}

export const formatTvl = (tvlZIL: number, zilUsd: number | null) =>
  zilUsd ? `$${formatNumber(tvlZIL * zilUsd)}` : `${formatNumber(tvlZIL)} ZIL`

export const formatTimeAgo = (timestamp: string): string => {
  const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  return `${hours} hour${hours === 1 ? '' : 's'} ago`
}
