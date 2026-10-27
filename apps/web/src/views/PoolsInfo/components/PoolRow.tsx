import { Flex, Link, Text } from '@dex/uikit'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { PoolData } from '../types'
import { formatFee, formatNumber, formatTokenSymbol, formatTvl } from '../utils'

const PoolContainer = styled(Flex)`
  padding: 8px 40px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  align-items: center;
  gap: 16px;

  @media screen and (max-width: 852px) {
    padding: 8px 16px;
  }
`

const VersionBadge = styled(Text)<{ version: 'v2' | 'v3' }>`
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  background: ${({ theme, version }) => (version === 'v2' ? theme.colors.secondary : theme.colors.primary)};
  color: white;
`

const FeeText = styled(Text)`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  white-space: nowrap;
`

const ReservesText = styled(Text)`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const StatValue = styled(Text)`
  min-width: 100px;
  text-align: right;
  white-space: nowrap;
  padding-right: 32px;
`

interface PoolRowProps {
  pool: PoolData
  zilUsd: number | null
  chainId?: number
  isMobile: boolean
}

const PoolRow: React.FC<PoolRowProps> = ({ pool, zilUsd, chainId, isMobile }) => {
  return (
    <PoolContainer>
      <Link external href={getBlockExploreLink(pool.address, 'address', chainId)}>
        <VersionBadge version={pool.version}>{pool.version.toUpperCase()}</VersionBadge>
      </Link>
      <FeeText>{formatFee(pool)}%</FeeText>
      <ReservesText>
        {!isMobile &&
          `${formatNumber(pool.reserve0)} ${formatTokenSymbol(pool.token0.symbol)} / ${formatNumber(
            pool.reserve1,
          )} ${formatTokenSymbol(pool.token1.symbol)}`}
      </ReservesText>
      <StatValue>{formatTvl(pool.tvlZIL, zilUsd)}</StatValue>
    </PoolContainer>
  )
}

export default PoolRow
