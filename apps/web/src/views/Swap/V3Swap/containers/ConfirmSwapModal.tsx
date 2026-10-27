import { Currency, CurrencyAmount, Token, TradeType } from '@dex/sdk'
import { memo, useCallback, useMemo } from 'react'

import { useTranslation } from '@dex/localization'
import { SmartRouterTrade } from '@dex/smart-router'
import { WrappedTokenInfo } from '@dex/token-lists'
import { Box, Flex, InjectedModalProps, Link } from '@dex/uikit'
import { formatAmount } from '@dex/utils/formatFractions'
import truncateHash from '@dex/utils/truncateHash'
import {
  ApproveModalContentV1,
  SwapPendingModalContentV1,
  SwapTransactionReceiptModalContentV1,
} from '@dex/widgets-internal'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'

import { useUserSlippage } from '@dex/utils/user'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApprovalState } from 'hooks/useApproveCallback'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { ConfirmModalStateV1, PendingConfirmModalStateV1 } from '../types'

import ConfirmSwapModalContainer from '../../components/ConfirmSwapModalContainer'
import { SwapTransactionErrorContent } from '../../components/SwapTransactionErrorContent'
import { TransactionConfirmSwapContent } from '../components'
import { ApproveStepFlow } from './ApproveStepFlow'

interface ConfirmSwapModalProps {
  trade?: SmartRouterTrade<TradeType> | null
  originalTrade?: SmartRouterTrade<TradeType> | null
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  approval: ApprovalState
  swapErrorMessage?: string | boolean
  showApproveFlow: boolean
  confirmModalState: ConfirmModalStateV1
  startSwapFlow: () => void
  pendingModalSteps: PendingConfirmModalStateV1[]
  currentAllowance?: CurrencyAmount<Currency>
  onAcceptChanges: () => void
  customOnDismiss?: () => void
  openSettingModal?: () => void
}

export const ConfirmSwapModal = memo<InjectedModalProps & ConfirmSwapModalProps>(function ConfirmSwapModalComp({
  trade,
  txHash,
  confirmModalState,
  startSwapFlow,
  pendingModalSteps,
  attemptingTxn,
  originalTrade,
  showApproveFlow,
  currencyBalances,
  swapErrorMessage,
  onDismiss,
  onAcceptChanges,
  customOnDismiss,
  openSettingModal,
}) {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippage()
  const { recipient } = useSwapState()

  const token: Token | undefined = wrappedCurrency(trade?.outputAmount?.currency, chainId)

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss?.()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const topModal = useMemo(() => {
    const currencyA = currencyBalances.INPUT?.currency ?? trade?.inputAmount?.currency
    const currencyB = currencyBalances.OUTPUT?.currency ?? trade?.outputAmount?.currency
    const amountA = formatAmount(trade?.inputAmount, 6) ?? ''
    const amountB = formatAmount(trade?.outputAmount, 6) ?? ''

    if (confirmModalState === ConfirmModalStateV1.RESETTING_APPROVAL) {
      return <ApproveModalContentV1 title={t('Reset Approval on USDT')} isMM={false} isBonus={false} />
    }

    if (
      showApproveFlow &&
      (confirmModalState === ConfirmModalStateV1.APPROVING_TOKEN ||
        confirmModalState === ConfirmModalStateV1.APPROVE_PENDING)
    ) {
      return (
        <ApproveModalContentV1
          title={t('Enable spending %symbol%', { symbol: `${trade?.inputAmount?.currency?.symbol}` })}
          isMM={false}
          isBonus={false}
        />
      )
    }

    if (swapErrorMessage) {
      return (
        <Flex width="100%" alignItems="center" height="calc(430px - 73px - 120px)">
          <SwapTransactionErrorContent
            message={swapErrorMessage}
            onDismiss={handleDismiss}
            openSettingModal={openSettingModal}
          />
        </Flex>
      )
    }

    if (attemptingTxn) {
      return (
        <SwapPendingModalContentV1
          title={t('Confirm Swap')}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
        />
      )
    }

    if (confirmModalState === ConfirmModalStateV1.PENDING_CONFIRMATION) {
      return (
        <SwapPendingModalContentV1
          showIcon
          title={t('Transaction Submitted')}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
        >
          <AddToWalletButton
            mt="39px"
            height="auto"
            variant="tertiary"
            width="fit-content"
            padding="6.5px 20px"
            marginTextBetweenLogo="6px"
            textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
            tokenAddress={token?.address}
            tokenSymbol={currencyB?.symbol}
            tokenDecimals={token?.decimals}
            tokenLogo={token instanceof WrappedTokenInfo ? token?.logoURI : undefined}
          />
        </SwapPendingModalContentV1>
      )
    }

    if (confirmModalState === ConfirmModalStateV1.COMPLETED && txHash) {
      return (
        <SwapTransactionReceiptModalContentV1>
          {chainId && (
            <Link external small href={getBlockExploreLink(txHash, 'transaction', chainId)}>
              {t('View on %site%', { site: getBlockExploreName(chainId) })}: {truncateHash(txHash, 8, 0)}
            </Link>
          )}
          <AddToWalletButton
            mt="39px"
            height="auto"
            variant="tertiary"
            width="fit-content"
            padding="6.5px 20px"
            marginTextBetweenLogo="6px"
            textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
            tokenAddress={token?.address}
            tokenSymbol={currencyB?.symbol}
            tokenDecimals={token?.decimals}
            tokenLogo={token instanceof WrappedTokenInfo ? token?.logoURI : undefined}
          />
        </SwapTransactionReceiptModalContentV1>
      )
    }

    return (
      <TransactionConfirmSwapContent
        trade={trade}
        recipient={recipient}
        originalTrade={originalTrade}
        allowedSlippage={allowedSlippage}
        currencyBalances={currencyBalances}
        onConfirm={startSwapFlow}
        onAcceptChanges={onAcceptChanges}
      />
    )
  }, [
    trade,
    txHash,
    originalTrade,
    attemptingTxn,
    currencyBalances,
    showApproveFlow,
    swapErrorMessage,
    token,
    chainId,
    recipient,
    allowedSlippage,
    confirmModalState,
    t,
    handleDismiss,
    startSwapFlow,
    onAcceptChanges,
    openSettingModal,
  ])

  const isShowingLoadingAnimation = useMemo(
    () =>
      confirmModalState === ConfirmModalStateV1.RESETTING_APPROVAL ||
      confirmModalState === ConfirmModalStateV1.APPROVING_TOKEN ||
      confirmModalState === ConfirmModalStateV1.APPROVE_PENDING ||
      attemptingTxn,
    [confirmModalState, attemptingTxn],
  )

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      minHeight="415px"
      width={['100%', '100%', '100%', '367px']}
      hideTitleAndBackground={confirmModalState !== ConfirmModalStateV1.REVIEWING || Boolean(swapErrorMessage)}
      headerPadding={isShowingLoadingAnimation ? '12px 24px 0px 24px !important' : '12px 24px'}
      bodyPadding={isShowingLoadingAnimation ? '0 24px 24px 24px' : '24px'}
      bodyTop={isShowingLoadingAnimation ? '-15px' : '0'}
      handleDismiss={handleDismiss}
    >
      <Box>{topModal}</Box>
      {isShowingLoadingAnimation && !swapErrorMessage && (
        <ApproveStepFlow confirmModalState={confirmModalState} pendingModalSteps={pendingModalSteps} />
      )}
    </ConfirmSwapModalContainer>
  )
})
