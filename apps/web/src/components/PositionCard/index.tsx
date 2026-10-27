import { useMemo } from 'react'
import { Currency, CurrencyAmount, Pair, Percent } from '@dex/sdk'
import { Text, Card, CardBody, Flex, CardProps, AutoColumn } from '@dex/uikit'
import { styled } from 'styled-components'
import { useTranslation } from '@dex/localization'
import useTotalSupply from 'hooks/useTotalSupply'
import { useStablecoinPriceAmount } from 'hooks/useStablecoinPrice'
import { useAccount } from 'wagmi'
import { BIG_INT_ZERO } from 'config/constants/exchange'

import { useTokenBalance } from 'state/wallet/hooks'
import { unwrappedToken } from '../../utils/wrappedCurrency'

import { LightCard } from '../Card'
import { DoubleCurrencyLogo } from '../Logo'
import { RowBetween, RowFixed } from '../Layout/Row'

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export interface PositionCardProps extends CardProps {
  pair: Pair
  showUnwrapped?: boolean
  currency0: Currency
  currency1: Currency
  token0Deposited: CurrencyAmount<Currency>
  token1Deposited: CurrencyAmount<Currency>
  totalUSDValue: number
  userPoolBalance: CurrencyAmount<Currency>
  poolTokenPercentage: Percent
}

export const useTokensDeposited = ({ pair, totalPoolTokens, userPoolBalance }) => {
  const [token0Deposited, token1Deposited] =
    !!pair && !!totalPoolTokens && !!userPoolBalance && totalPoolTokens.quotient >= userPoolBalance.quotient
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return [token0Deposited, token1Deposited]
}

export const useTotalUSDValue = ({ currency0, currency1, token0Deposited, token1Deposited }) => {
  const token0USDValue = useStablecoinPriceAmount(
    currency0,
    token0Deposited ? parseFloat(token0Deposited.toSignificant(6)) : undefined,
  )
  const token1USDValue = useStablecoinPriceAmount(
    currency1,
    token1Deposited ? parseFloat(token1Deposited.toSignificant(6)) : undefined,
  )

  return token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null
}

export const usePoolTokenPercentage = ({ userPoolBalance, totalPoolTokens }) => {
  return !!userPoolBalance && !!totalPoolTokens && totalPoolTokens.quotient >= userPoolBalance.quotient
    ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
    : undefined
}

const withLPValuesFactory =
  ({ useLPValuesHook, hookArgFn }) =>
  (Component) =>
  (props) => {
    const { address: account } = useAccount()

    const currency0 = props.showUnwrapped ? props.pair.token0 : unwrappedToken(props.pair.token0)
    const currency1 = props.showUnwrapped ? props.pair.token1 : unwrappedToken(props.pair.token1)

    const userPoolBalance = useTokenBalance(account ?? undefined, props.pair.liquidityToken)

    const totalPoolTokens = useTotalSupply(props.pair.liquidityToken)

    const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens, userPoolBalance })

    const args = useMemo(
      () =>
        hookArgFn({
          userPoolBalance,
          pair: props.pair,
          totalPoolTokens,
        }),
      [userPoolBalance, props.pair, totalPoolTokens],
    )

    const [token0Deposited, token1Deposited] = useLPValuesHook(args)

    const totalUSDValue = useTotalUSDValue({ currency0, currency1, token0Deposited, token1Deposited })

    return (
      <Component
        {...props}
        currency0={currency0}
        currency1={currency1}
        token0Deposited={token0Deposited}
        token1Deposited={token1Deposited}
        totalUSDValue={totalUSDValue}
        userPoolBalance={userPoolBalance}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

export const withLPValues = withLPValuesFactory({
  useLPValuesHook: useTokensDeposited,
  hookArgFn: ({ pair, userPoolBalance, totalPoolTokens }) => ({ pair, userPoolBalance, totalPoolTokens }),
})

function MinimalPositionCardView({
  currency0,
  currency1,
  token0Deposited,
  token1Deposited,
  totalUSDValue,
  userPoolBalance,
  poolTokenPercentage,
}: PositionCardProps) {
  const { t } = useTranslation()
  return (
    <>
      {userPoolBalance && userPoolBalance.quotient > BIG_INT_ZERO ? (
        <Card>
          <CardBody>
            <AutoColumn gap="16px">
              <FixedHeightRow>
                <RowFixed>
                  <Text color="secondary" bold>
                    {t('LP tokens in your wallet')}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <RowFixed>
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
                  <Text small color="textSubtle">
                    {currency0.symbol}-{currency1.symbol} LP
                  </Text>
                </RowFixed>
                <RowFixed>
                  <Flex flexDirection="column" alignItems="flex-end">
                    <Text>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Text>
                    {Number.isFinite(totalUSDValue) && (
                      <Text small color="textSubtle">{`(~${totalUSDValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD)`}</Text>
                    )}
                  </Flex>
                </RowFixed>
              </FixedHeightRow>
              <AutoColumn gap="4px">
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    {t('Share in Trading Pair')}:
                  </Text>
                  <Text>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</Text>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    {t('Pooled %asset%', { asset: currency0.symbol })}:
                  </Text>
                  {token0Deposited ? <Text ml="6px">{token0Deposited.toSignificant(6)}</Text> : '-'}
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    {t('Pooled %asset%', { asset: currency1.symbol })}:
                  </Text>
                  {token1Deposited ? <Text ml="6px">{token1Deposited.toSignificant(6)}</Text> : '-'}
                </FixedHeightRow>
              </AutoColumn>
            </AutoColumn>
          </CardBody>
        </Card>
      ) : (
        <LightCard>
          <Text fontSize="14px" style={{ textAlign: 'center' }}>
            <span role="img" aria-label="info">
              ℹ️
            </span>{' '}
            {t(
              "By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share in the trading pair. Fees are added to the pair, accrue in real time and can be claimed by withdrawing your liquidity.",
            )}
          </Text>
        </LightCard>
      )}
    </>
  )
}

export const MinimalPositionCard = withLPValues(MinimalPositionCardView)
