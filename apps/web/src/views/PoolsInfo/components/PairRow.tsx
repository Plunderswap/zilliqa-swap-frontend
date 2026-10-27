import { ChevronDownIcon, ChevronUpIcon, Flex, SwapVertIcon, Text } from '@dex/uikit'
import { DoubleCurrencyLogo } from 'components/Logo'
import { isUnbackedToken, isZrc2ProxyToken } from 'config/constants/unbackedTokens'
import { useToken } from 'hooks/Tokens'
import { useState } from 'react'
import styled from 'styled-components'
import { PairData } from '../types'
import { formatNumberWithDynamicDecimals, formatTokenSymbol, formatTvl } from '../utils'
import PoolRow from './PoolRow'

const RowContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.background};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundAlt};
  }
`

const PriceText = styled(Text)`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
  &:hover {
    opacity: 0.8;
  }
`

const RotateIcon = styled(SwapVertIcon)<{ $isRotated: boolean }>`
  transition: transform 0.2s;
  transform: ${({ $isRotated }) => ($isRotated ? 'rotate(180deg)' : 'rotate(0)')};
`

const StatValue = styled(Text)`
  min-width: 100px;
  text-align: right;
  white-space: nowrap;
`

interface PairRowProps {
  pair: PairData
  zilUsd: number | null
  chainId?: number
  isMobile: boolean
}

const PairRow: React.FC<PairRowProps> = ({ pair, zilUsd, chainId, isMobile }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showInversePrice, setShowInversePrice] = useState(false)
  const currency0 = useToken(pair.token0.address) ?? undefined
  const currency1 = useToken(pair.token1.address) ?? undefined

  const isUnbacked = isUnbackedToken(pair.token0.address) || isUnbackedToken(pair.token1.address)
  const isZrc2Exploited = isZrc2ProxyToken(pair.token0.address) || isZrc2ProxyToken(pair.token1.address)
  const symbol0 = formatTokenSymbol(pair.token0.symbol)
  const symbol1 = formatTokenSymbol(pair.token1.symbol)
  const price = showInversePrice ? (pair.price01 > 0 ? 1 / pair.price01 : 0) : pair.price01

  return (
    <RowContainer>
      <Flex padding={isMobile ? '16px' : '8px 16px'} alignItems="center" onClick={() => setIsExpanded(!isExpanded)}>
        <Flex flex="1" alignItems="center">
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={24} margin />
          <Flex flexDirection="column" ml="8px">
            <Text>
              {symbol0}/{symbol1}
            </Text>
            {isZrc2Exploited && (
              <Text fontSize="12px" color="failure" bold>
                Exploited (ZRC2)
              </Text>
            )}
            {isUnbacked && (
              <Text fontSize="12px" color="failure" bold>
                Unbacked (X-Bridge hack)
              </Text>
            )}
            <PriceText
              onClick={(e) => {
                e.stopPropagation()
                setShowInversePrice(!showInversePrice)
              }}
            >
              1 {showInversePrice ? symbol1 : symbol0} = {formatNumberWithDynamicDecimals(price, true)}{' '}
              {showInversePrice ? symbol0 : symbol1}
              <RotateIcon width="14px" height="14px" $isRotated={showInversePrice} />
            </PriceText>
          </Flex>
        </Flex>
        <StatValue bold>{formatTvl(pair.tvlZIL, zilUsd)}</StatValue>
        <Flex width="24px" ml="8px" justifyContent="center">
          {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Flex>
      </Flex>

      {isExpanded &&
        pair.pools.map((pool) => (
          <PoolRow key={pool.address} pool={pool} zilUsd={zilUsd} chainId={chainId} isMobile={isMobile} />
        ))}
    </RowContainer>
  )
}

export default PairRow
