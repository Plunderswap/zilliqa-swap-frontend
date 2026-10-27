import { Flex, Message, MessageText, Text, Toggle, useMatchBreakpoints } from '@dex/uikit'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import ErrorState from './components/ErrorState'
import LoadingState from './components/LoadingState'
import PairRow from './components/PairRow'
import TotalStats from './components/TotalStats'
import { PoolsInfoResponse } from './types'
import { formatTimeAgo, formatTokenSymbol, getStoredHideSmallPools, setStoredHideSmallPools } from './utils'

type SortField = 'tvl' | 'pair'
type SortDirection = 'asc' | 'desc'

const MIN_TVL_ZIL = 1000

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
`

const TableHeader = styled(Flex)`
  padding: 16px 48px 16px 16px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 16px 16px 0 0;
`

const HeaderText = styled(Text)`
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }
`

export const PoolsInfo = () => {
  const { chainId } = useActiveChainId()
  const { isMobile } = useMatchBreakpoints()
  const [hideSmallPools, setHideSmallPools] = useState(getStoredHideSmallPools())
  const [sortField, setSortField] = useState<SortField>('tvl')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['pools-info', chainId],
    queryFn: async () => {
      const res = await fetch(`/api/pools?chainId=${chainId}`)
      if (!res.ok) throw new Error(`Failed to load pools: ${res.status}`)
      return (await res.json()) as PoolsInfoResponse
    },
    enabled: Boolean(chainId),
    // the API response is cached for an hour, so there is nothing newer to fetch before then
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
  const pairs = data?.pairs
  const zilUsd = data?.zilUsd ?? null

  const sortedPairs = useMemo(() => {
    const filtered = (pairs ?? []).filter((pair) => !hideSmallPools || pair.tvlZIL >= MIN_TVL_ZIL)
    const direction = sortDirection === 'desc' ? -1 : 1
    return [...filtered].sort((a, b) =>
      sortField === 'pair'
        ? direction *
          `${formatTokenSymbol(a.token0.symbol)}/${formatTokenSymbol(a.token1.symbol)}`.localeCompare(
            `${formatTokenSymbol(b.token0.symbol)}/${formatTokenSymbol(b.token1.symbol)}`,
          )
        : direction * (a.tvlZIL - b.tvlZIL),
    )
  }, [pairs, hideSmallPools, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleHideSmallPoolsChange = () => {
    setHideSmallPools(!hideSmallPools)
    setStoredHideSmallPools(!hideSmallPools)
  }

  const sortArrow = (field: SortField) => (sortField === field ? (sortDirection === 'desc' ? '↓' : '↑') : '')

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />
  }

  if (isPending) {
    return <LoadingState />
  }

  return (
    <Container>
      <Flex flexDirection="column" mb="16px">
        <Text bold fontSize="24px">
          Pairs & Pools
        </Text>
        <Text fontSize="12px" color="textSubtle">
          Read from the V2 and V3 factories and refreshed hourly (updated {formatTimeAgo(data.updatedAt)}). Tokens are
          priced from their deepest ZIL pool and converted to USD at the CoinGecko ZIL price; tokens without a ZIL pool
          are not counted.
        </Text>
      </Flex>

      <Message variant="danger" mb="16px">
        <MessageText>
          ZRC2-backed tokens (SEED, zUSDT, ZOGE, stZIL, gZIL, XCAD, zWBTC, ZILPEPE, VOID, STREAM, Lunr, GARY, ZHIB,
          HRSE, FPS) have been exploited through a Zilliqa node bug and pools holding them have been drained, so their
          prices and TVL shown here may not reflect real value.
        </MessageText>
      </Message>

      <Message variant="danger" mb="16px">
        <MessageText>
          X-Bridge has been hacked. Tokens bridged through it (zUSDC, zUSDT, zWBTC, XCAD) are no longer backed, so their
          prices and TVL shown here do not reflect real value.
        </MessageText>
      </Message>

      <TotalStats pairs={data.pairs} zilUsd={zilUsd} />

      <Flex justifyContent="flex-end" alignItems="center" mb="16px" title={`Hides pairs under ${MIN_TVL_ZIL} ZIL TVL`}>
        <Text mr="8px">Hide Small Pools</Text>
        <Toggle checked={hideSmallPools} onChange={handleHideSmallPoolsChange} scale="sm" />
      </Flex>

      {sortedPairs.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" padding="24px">
          <Text>No pairs found</Text>
        </Flex>
      ) : (
        <>
          <TableHeader>
            <Flex flex="1">
              <HeaderText onClick={() => handleSort('pair')}>Pair/Price {sortArrow('pair')}</HeaderText>
            </Flex>
            <HeaderText onClick={() => handleSort('tvl')}>TVL {sortArrow('tvl')}</HeaderText>
          </TableHeader>
          {sortedPairs.map((pair) => (
            <PairRow key={pair.key} pair={pair} zilUsd={zilUsd} chainId={chainId} isMobile={isMobile} />
          ))}
        </>
      )}
    </Container>
  )
}
