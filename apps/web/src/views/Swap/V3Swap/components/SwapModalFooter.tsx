import { useTranslation } from '@dex/localization'
import { Currency, CurrencyAmount, Percent, TradeType } from '@dex/sdk'
import { SmartRouter, SmartRouterTrade } from '@dex/smart-router'
import { AutoColumn, BackForwardIcon, Button, Flex, QuestionHelper, Text } from '@dex/uikit'
import { formatAmount } from '@dex/utils/formatFractions'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { CurrencyLogo } from 'components/Logo'
import { memo, useMemo, useState } from 'react'
import { Field } from 'state/swap/actions'
import { styled } from 'styled-components'
import { warningSeverity } from 'utils/exchange'

import FormattedPriceImpact from '../../components/FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from '../../components/styleds'
import { SlippageAdjustedAmounts, formatExecutionPrice } from '../utils/exchange'

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

export const SwapModalFooter = memo(function SwapModalFooterComponent({
  priceImpact: priceImpactWithoutFee,
  lpFee: realizedLPFee,
  inputAmount,
  outputAmount,
  trade,
  tradeType,
  slippageAdjustedAmounts,
  isEnoughInputBalance,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
  currencyBalances,
}: {
  trade?: SmartRouterTrade<TradeType>
  tradeType: TradeType
  lpFee?: CurrencyAmount<Currency>
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  priceImpact?: Percent
  slippageAdjustedAmounts: SlippageAdjustedAmounts | undefined | null
  isEnoughInputBalance?: boolean
  swapErrorMessage?: string | undefined
  disabledConfirm: boolean
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  onConfirm: () => void
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const severity = warningSeverity(priceImpactWithoutFee)

  const executionPriceDisplay = useMemo(() => {
    const price = SmartRouter.getExecutionPrice(trade) ?? undefined
    return formatExecutionPrice(price, inputAmount, outputAmount, showInverted)
  }, [inputAmount, outputAmount, trade, showInverted])

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center" mb="8px">
          <Text fontSize="14px">{t('Price')}</Text>
          <Text
            fontSize="14px"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {executionPriceDisplay}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <BackForwardIcon color="primary" width="14px" />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween mb="8px">
          <RowFixed>
            <Text fontSize="14px">
              {tradeType === TradeType.EXACT_INPUT ? t('Minimum received') : t('Maximum sold')}
            </Text>
            <QuestionHelper
              text={t(
                'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
              )}
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">
              {tradeType === TradeType.EXACT_INPUT
                ? (formatAmount(slippageAdjustedAmounts?.[Field.OUTPUT], 4) ?? '-')
                : (formatAmount(slippageAdjustedAmounts?.[Field.INPUT], 4) ?? '-')}
            </Text>
            <Text fontSize="14px" marginLeft="4px">
              {tradeType === TradeType.EXACT_INPUT ? outputAmount.currency.symbol : inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween mb="8px">
          <RowFixed>
            <Text fontSize="14px">{t('Price Impact')}</Text>
            <QuestionHelper
              ml="4px"
              placement="top"
              text={t('The difference between the market price and your price due to trade size.')}
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Trading Fee')}</Text>
            <QuestionHelper
              ml="4px"
              placement="top"
              text={t(
                'Fee ranging from 0.1% to 0.01% depending on the pool fee tier. You can check the fee tier by clicking the magnifier icon under the “Route” section.',
              )}
            />
          </RowFixed>
          {realizedLPFee ? (
            <Flex>
              <Text fontSize="14px" mr="8px">
                {`${formatAmount(realizedLPFee, 6)} ${inputAmount.currency.symbol}`}
              </Text>
              <CurrencyLogo currency={currencyBalances.INPUT?.currency ?? inputAmount.currency} size="24px" />
            </Flex>
          ) : (
            <Text fontSize="14px" textAlign="right">
              -
            </Text>
          )}
        </RowBetween>
      </SwapModalFooterContainer>

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 || (tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance)
            ? t('Swap Anyway')
            : t('Confirm Swap')}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
})
