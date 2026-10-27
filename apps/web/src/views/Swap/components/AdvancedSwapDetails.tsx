import { useTranslation } from '@dex/localization'
import { Currency, CurrencyAmount, Percent, TradeType } from '@dex/sdk'
import { AutoColumn, QuestionHelper, Text } from '@dex/uikit'
import { formatAmount } from '@dex/utils/formatFractions'
import { memo } from 'react'

import { RowBetween, RowFixed } from 'components/Layout/Row'
import { Field } from 'state/swap/actions'
import { SlippageAdjustedAmounts } from '../V3Swap/utils/exchange'
import FormattedPriceImpact from './FormattedPriceImpact'

export const TradeSummary = memo(function TradeSummaryComponent({
  inputAmount,
  outputAmount,
  tradeType,
  slippageAdjustedAmounts,
  priceImpactWithoutFee,
  realizedLPFee,
}: {
  hasStablePair?: boolean
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeType?: TradeType
  slippageAdjustedAmounts: SlippageAdjustedAmounts
  priceImpactWithoutFee?: Percent | null
  realizedLPFee?: CurrencyAmount<Currency> | null
}) {
  const { t } = useTranslation()
  const isExactIn = tradeType === TradeType.EXACT_INPUT

  return (
    <AutoColumn style={{ padding: '0 24px' }}>
      <RowBetween>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {isExactIn ? t('Minimum received') : t('Maximum sold')}
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
            {isExactIn
              ? `${formatAmount(slippageAdjustedAmounts[Field.OUTPUT], 4)} ${outputAmount?.currency?.symbol}`
              : `${formatAmount(slippageAdjustedAmounts[Field.INPUT], 4)} ${inputAmount?.currency?.symbol}`}
          </Text>
        </RowFixed>
      </RowBetween>
      {priceImpactWithoutFee && (
        <RowBetween style={{ padding: '4px 0 0 0' }}>
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
              {t('Price Impact')}
            </Text>
            <QuestionHelper
              text={
                <>
                  <Text>
                    <Text bold display="inline-block">
                      {t('AMM')}
                    </Text>
                    {`: ${t('The difference between the market price and estimated price due to trade size.')}`}
                  </Text>
                </>
              }
              ml="4px"
              placement="top"
            />
          </RowFixed>

          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
      )}

      {realizedLPFee && (
        <RowBetween style={{ padding: '4px 0 0 0' }}>
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
              {t('Trading Fee')}
            </Text>
            <QuestionHelper
              text={
                <>
                  <Text mb="12px">
                    <Text bold display="inline-block">
                      {t('AMM')}
                    </Text>
                    :{' '}
                    {t(
                      'Fee ranging from 0.1% to 0.01% depending on the pool fee tier. You can check the fee tier by clicking the magnifier icon under the “Route” section.',
                    )}
                  </Text>
                </>
              }
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <Text fontSize="14px">{`${formatAmount(realizedLPFee, 4)} ${inputAmount?.currency?.symbol}`}</Text>
        </RowBetween>
      )}
    </AutoColumn>
  )
})
