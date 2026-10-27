import { useTranslation } from '@dex/localization'
import { Currency, CurrencyAmount, Percent } from '@dex/sdk'
import { Message, MessageText } from '@dex/uikit'
import { formatAmount } from '@dex/utils/formatFractions'
import replaceBrowserHistory from '@dex/utils/replaceBrowserHistory'
import { ReactNode, useCallback, useMemo } from 'react'

import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { CommonBasesType } from 'components/SearchModal/types'
import { isUnbackedToken, isZrc2ProxyToken } from 'config/constants/unbackedTokens'
import { useCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'
import { useDefaultsFromURLSearch, useSwapState } from 'state/swap/hooks'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { currencyId } from 'utils/currencyId'
import { maxAmountSpend } from 'utils/maxAmountSpend'

import { useAccount } from 'wagmi'
import useWarningImport from '../../hooks/useWarningImport'
import { FormContainer } from '../components'
import { useIsWrapping } from '../hooks'
import { FlipButton } from './FlipButton'
import { Recipient } from './Recipient'

interface Props {
  inputAmount?: CurrencyAmount<Currency>
  outputAmount?: CurrencyAmount<Currency>
  tradeLoading?: boolean
  pricingAndSlippage?: ReactNode
  swapCommitButton?: ReactNode
}

export function FormMain({ pricingAndSlippage, inputAmount, outputAmount, tradeLoading, swapCommitButton }: Props) {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  useWarningImport()
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const isWrapping = useIsWrapping()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const [inputBalance] = useCurrencyBalances(account, [inputCurrency, outputCurrency])
  const maxAmountInput = useMemo(() => maxAmountSpend(inputBalance), [inputBalance])
  const loadedUrlParams = useDefaultsFromURLSearch()

  const handleTypeInput = useCallback((value: string) => onUserInput(Field.INPUT, value), [onUserInput])
  const handleTypeOutput = useCallback((value: string) => onUserInput(Field.OUTPUT, value), [onUserInput])

  const handlePercentInput = useCallback(
    (percent: number) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleCurrencySelect = useCallback(
    (
      newCurrency: Currency,
      field: Field,
      currentInputCurrencyId: string | undefined,
      currentOutputCurrencyId: string | undefined,
    ) => {
      onCurrencySelection(field, newCurrency)

      const isInput = field === Field.INPUT
      const oldCurrencyId = isInput ? currentInputCurrencyId : currentOutputCurrencyId
      const otherCurrencyId = isInput ? currentOutputCurrencyId : currentInputCurrencyId
      const newCurrencyId = currencyId(newCurrency)
      if (newCurrencyId === otherCurrencyId) {
        replaceBrowserHistory(isInput ? 'outputCurrency' : 'inputCurrency', oldCurrencyId)
      }
      replaceBrowserHistory(isInput ? 'inputCurrency' : 'outputCurrency', newCurrencyId)
    },
    [onCurrencySelection],
  )
  const handleInputSelect = useCallback(
    (newCurrency: Currency) =>
      handleCurrencySelect(newCurrency, Field.INPUT, inputCurrencyId || '', outputCurrencyId || ''),
    [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  )
  const handleOutputSelect = useCallback(
    (newCurrency: Currency) =>
      handleCurrencySelect(newCurrency, Field.OUTPUT, inputCurrencyId || '', outputCurrencyId || ''),
    [handleCurrencySelect, inputCurrencyId, outputCurrencyId],
  )

  const isTypingInput = independentField === Field.INPUT
  const inputValue = useMemo(
    () => typedValue && (isTypingInput ? typedValue : formatAmount(inputAmount) || ''),
    [typedValue, isTypingInput, inputAmount],
  )
  const outputValue = useMemo(
    () => typedValue && (isTypingInput ? formatAmount(outputAmount) || '' : typedValue),
    [typedValue, isTypingInput, outputAmount],
  )
  const inputLoading = typedValue ? !isTypingInput && tradeLoading : false
  const outputLoading = typedValue ? isTypingInput && tradeLoading : false
  const unbackedSymbols = [inputCurrency, outputCurrency]
    .filter((currency) => currency && isUnbackedToken(currency.wrapped.address))
    .map((currency) => currency?.symbol)
  const zrc2Symbols = [inputCurrency, outputCurrency]
    .filter((currency) => currency && isZrc2ProxyToken(currency.wrapped.address))
    .map((currency) => currency?.symbol)

  return (
    <FormContainer>
      <CurrencyInputPanel
        id="swap-currency-input"
        showUSDPrice
        showMaxButton
        showCommonBases
        inputLoading={!isWrapping && inputLoading}
        currencyLoading={!loadedUrlParams}
        label={!isTypingInput && !isWrapping ? t('From (estimated)') : t('From')}
        value={isWrapping ? typedValue : inputValue}
        maxAmount={maxAmountInput}
        showQuickInputButton
        currency={inputCurrency}
        onUserInput={handleTypeInput}
        onPercentInput={handlePercentInput}
        onMax={handleMaxInput}
        onCurrencySelect={handleInputSelect}
        otherCurrency={outputCurrency}
        commonBasesType={CommonBasesType.SWAP}
      />
      <FlipButton />
      <CurrencyInputPanel
        id="swap-currency-output"
        showUSDPrice
        showCommonBases
        showMaxButton={false}
        inputLoading={!isWrapping && outputLoading}
        currencyLoading={!loadedUrlParams}
        label={isTypingInput && !isWrapping ? t('To (estimated)') : t('To')}
        value={isWrapping ? typedValue : outputValue}
        currency={outputCurrency}
        onUserInput={handleTypeOutput}
        onCurrencySelect={handleOutputSelect}
        otherCurrency={outputCurrency}
        commonBasesType={CommonBasesType.SWAP}
      />
      <Recipient />
      {zrc2Symbols.length > 0 && (
        <Message variant="danger">
          <MessageText>
            {t(
              'ZRC2-backed tokens have been exploited through a Zilliqa node bug and pools holding them have been drained, so prices may not reflect real value. Affected tokens in this swap: %symbols%',
              { symbols: zrc2Symbols.join(', ') },
            )}
          </MessageText>
        </Message>
      )}
      {unbackedSymbols.length > 0 && (
        <Message variant="danger">
          <MessageText>
            {t(
              'X-Bridge has been hacked and tokens bridged through it are no longer backed. Affected tokens in this swap: %symbols%',
              { symbols: unbackedSymbols.join(', ') },
            )}
          </MessageText>
        </Message>
      )}
      {pricingAndSlippage}
      {swapCommitButton}
    </FormContainer>
  )
}
