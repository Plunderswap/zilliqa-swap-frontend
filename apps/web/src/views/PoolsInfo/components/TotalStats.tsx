import { Flex, Text } from '@dex/uikit'
import styled from 'styled-components'
import { PairData } from '../types'
import { formatNumber, formatTvl } from '../utils'

const StatsContainer = styled(Flex)`
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  width: 100%;
  flex-wrap: wrap;
  gap: 8px;

  @media screen and (max-width: 480px) {
    padding: 12px;
    flex-direction: column;
  }
`

const StatBox = styled(Flex)`
  flex-direction: column;
  flex: 1;
  min-width: 160px;
  padding: 8px 16px;

  @media screen and (max-width: 480px) {
    padding: 4px 8px;
    min-width: unset;
  }
`

interface TotalStatsProps {
  pairs: PairData[]
  zilUsd: number | null
}

const TotalStats: React.FC<TotalStatsProps> = ({ pairs, zilUsd }) => {
  const totalTVL = pairs.reduce((sum, pair) => sum + pair.tvlZIL, 0)
  const poolCount = pairs.reduce((sum, pair) => sum + pair.pools.length, 0)

  return (
    <StatsContainer>
      <StatBox>
        <Text color="textSubtle">Total Value Locked</Text>
        <Text bold fontSize="24px">
          {formatTvl(totalTVL, zilUsd)}
        </Text>
        {zilUsd && (
          <Text fontSize="12px" color="textSubtle">
            {formatNumber(totalTVL)} ZIL
          </Text>
        )}
      </StatBox>
      <StatBox>
        <Text color="textSubtle">Pairs</Text>
        <Text bold fontSize="24px">
          {pairs.length}
        </Text>
      </StatBox>
      <StatBox>
        <Text color="textSubtle">Pools</Text>
        <Text bold fontSize="24px">
          {poolCount}
        </Text>
      </StatBox>
    </StatsContainer>
  )
}

export default TotalStats
