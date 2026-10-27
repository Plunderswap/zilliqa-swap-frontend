import { useTranslation } from '@dex/localization'
import { Currency, CurrencyAmount, Token, TradeType } from '@dex/sdk'
import { SmartRouterTrade } from '@dex/smart-router'
import { WrappedTokenInfo } from '@dex/token-lists'
import { Box, Flex, InjectedModalProps, Link } from '@dex/uikit'
import { formatAmount } from '@dex/utils/formatFractions'
import truncateHash from '@dex/utils/truncateHash'
import { useUserSlippage } from '@dex/utils/user'
import {
  ApproveModalContent,
  ConfirmModalState,
  SwapPendingModalContent,
  SwapTransactionReceiptModalContent,
} from '@dex/widgets-internal'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import ConfirmSwapModalContainer from 'views/Swap/components/ConfirmSwapModalContainer'
import { SwapTransactionErrorContent } from 'views/Swap/components/SwapTransactionErrorContent'
import { TransactionConfirmSwapContent } from '../components'
import { ConfirmAction } from '../hooks/useConfirmModalStateV2'
import { AllowedAllowanceState } from '../types'
import { ApproveStepFlowV2 } from './ApproveStepFlowV2'

export const useApprovalPhaseStepTitles: ({ trade }: { trade: SmartRouterTrade<TradeType> | undefined }) => {
  [step in AllowedAllowanceState]: string
} = ({ trade }: { trade: SmartRouterTrade<TradeType> | undefined }) => {
  const { t } = useTranslation()
  return useMemo(() => {
    return {
      [ConfirmModalState.RESETTING_APPROVAL]: t('Reset approval on USDT.'),
      [ConfirmModalState.APPROVING_TOKEN]: t('Approve %symbol%', {
        symbol: trade ? trade.inputAmount.currency.symbol : '',
      }),
      [ConfirmModalState.PERMITTING]: t('Permit %symbol%', { symbol: trade ? trade.inputAmount.currency.symbol : '' }),
    }
  }, [t, trade])
}

type ConfirmSwapModalProps = InjectedModalProps & {
  customOnDismiss?: () => void
  onDismiss?: () => void
  confirmModalState: ConfirmModalState
  pendingModalSteps: ConfirmAction[]
  trade?: SmartRouterTrade<TradeType>
  originalTrade?: SmartRouterTrade<TradeType>
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  txHash?: string
  swapErrorMessage?: string
  onAcceptChanges: () => void
  onConfirm: (setConfirmModalState?: () => void) => void
  openSettingModal?: () => void
}

export const ConfirmSwapModalV2: React.FC<ConfirmSwapModalProps> = ({
  confirmModalState,
  pendingModalSteps,
  customOnDismiss,
  swapErrorMessage,
  onDismiss,
  trade,
  originalTrade,
  txHash,
  currencyBalances,
  openSettingModal,
  onAcceptChanges,
  onConfirm,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const [allowedSlippage] = useUserSlippage()
  const { recipient } = useSwapState()
  const loadingAnimationVisible = useMemo(() => {
    return [
      ConfirmModalState.RESETTING_APPROVAL,
      ConfirmModalState.APPROVING_TOKEN,
      ConfirmModalState.PERMITTING,
    ].includes(confirmModalState)
  }, [confirmModalState])
  const hasError = useMemo(() => swapErrorMessage !== undefined, [swapErrorMessage])
  const stepsVisible = useMemo(() => {
    if (swapErrorMessage) return false
    if (confirmModalState === ConfirmModalState.REVIEWING || confirmModalState === ConfirmModalState.COMPLETED)
      return false
    if (confirmModalState === ConfirmModalState.PENDING_CONFIRMATION && txHash) return false
    return pendingModalSteps.length > 0 && pendingModalSteps.some((step) => step.showIndicator)
  }, [confirmModalState, pendingModalSteps, swapErrorMessage, txHash])

  const stepContents = useApprovalPhaseStepTitles({ trade })
  const token: Token | undefined = useMemo(
    () => wrappedCurrency(trade?.outputAmount?.currency, chainId),
    [chainId, trade?.outputAmount?.currency],
  )

  const handleDismiss = useCallback(() => {
    if (typeof customOnDismiss === 'function') {
      customOnDismiss()
    }

    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const modalContent = useMemo(() => {
    const currencyA = currencyBalances.INPUT?.currency ?? trade?.inputAmount?.currency
    const currencyB = currencyBalances.OUTPUT?.currency ?? trade?.outputAmount?.currency
    const amountA = formatAmount(trade?.inputAmount, 6) ?? ''
    const amountB = formatAmount(trade?.outputAmount, 6) ?? ''

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
    if (
      confirmModalState === ConfirmModalState.APPROVING_TOKEN ||
      confirmModalState === ConfirmModalState.PERMITTING ||
      confirmModalState === ConfirmModalState.RESETTING_APPROVAL
    ) {
      return (
        <ApproveModalContent
          title={stepContents}
          isMM={false}
          // TODO
          isBonus={false}
          currencyA={currencyA as Currency}
          asBadge
          currentStep={confirmModalState}
          approvalModalSteps={pendingModalSteps.map((step) => step.step) as any}
        />
      )
    }

    if (confirmModalState === ConfirmModalState.PENDING_CONFIRMATION) {
      return (
        <SwapPendingModalContent
          title={txHash ? t('Transaction Submitted') : t('Confirm Swap')}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
          currentStep={confirmModalState}
        >
          {txHash ? (
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
              tokenLogo={token instanceof WrappedTokenInfo ? (token as WrappedTokenInfo)?.logoURI : undefined}
            />
          ) : null}
        </SwapPendingModalContent>
      )
    }

    if (confirmModalState === ConfirmModalState.COMPLETED && txHash) {
      return (
        <SwapTransactionReceiptModalContent
          explorerLink={
            chainId ? (
              <Link external small href={getBlockExploreLink(txHash, 'transaction', chainId)}>
                {t('View on %site%', { site: getBlockExploreName(chainId) })}: {truncateHash(txHash, 8, 0)}
              </Link>
            ) : (
              <></>
            )
          }
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
            tokenLogo={token instanceof WrappedTokenInfo ? (token as WrappedTokenInfo)?.logoURI : undefined}
          />
        </SwapTransactionReceiptModalContent>
      )
    }

    return (
      <TransactionConfirmSwapContent
        trade={trade}
        recipient={recipient}
        originalTrade={originalTrade}
        allowedSlippage={allowedSlippage}
        currencyBalances={currencyBalances}
        onConfirm={onConfirm}
        onAcceptChanges={onAcceptChanges}
      />
    )
  }, [
    allowedSlippage,
    chainId,
    confirmModalState,
    currencyBalances,
    handleDismiss,
    onAcceptChanges,
    onConfirm,
    openSettingModal,
    originalTrade,
    pendingModalSteps,
    recipient,
    stepContents,
    swapErrorMessage,
    t,
    token,
    trade,
    txHash,
  ])

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      minHeight={hasError ? 'auto' : '415px'}
      width={['100%', '100%', '100%', '367px']}
      hideTitleAndBackground={confirmModalState !== ConfirmModalState.REVIEWING || hasError}
      headerPadding={loadingAnimationVisible ? '12px 24px 0px 24px !important' : '12px 24px'}
      bodyPadding={loadingAnimationVisible && !hasError ? '0 24px 24px 24px' : '24px'}
      bodyTop={loadingAnimationVisible ? '-15px' : '0'}
      handleDismiss={handleDismiss}
    >
      <Box>{modalContent}</Box>
      {stepsVisible ? (
        <ApproveStepFlowV2
          confirmModalState={confirmModalState}
          pendingModalSteps={pendingModalSteps.map((step) => step.step) as any}
        />
      ) : null}
    </ConfirmSwapModalContainer>
  )
}
