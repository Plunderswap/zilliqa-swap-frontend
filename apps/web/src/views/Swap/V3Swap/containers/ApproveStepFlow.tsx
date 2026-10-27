import { useTranslation } from '@dex/localization'
import { Box, Flex, Text, useTooltip } from '@dex/uikit'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { ConfirmModalStateV1, PendingConfirmModalStateV1 } from '../types'

const StepsContainer = styled(Flex)`
  width: 100px;
  height: 8px;
  border-radius: 4px;
  margin: 16px auto auto auto;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.input};
`

const Step = styled('div')<{ active: boolean; width: string }>`
  height: 100%;
  width: ${({ width }) => width};
  background: ${({ theme, active }) => (active ? theme.colors.secondary : theme.colors.input)};
`

interface ApproveStepFlowProps {
  confirmModalState: ConfirmModalStateV1
  pendingModalSteps: PendingConfirmModalStateV1[]
}

export const ApproveStepFlow: React.FC<React.PropsWithChildren<ApproveStepFlowProps>> = ({
  confirmModalState,
  pendingModalSteps,
}) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>
      {t(
        'If wallet require you to enter the number of tokens you want to approve, you could enter a number that is greater than or equal to the amount of tokens you are swapping.',
      )}
    </Text>,
    { placement: 'top' },
  )

  const stepWidth = useMemo(() => `${100 / pendingModalSteps.length}%`, [pendingModalSteps])
  const hideStepIndicators = useMemo(() => pendingModalSteps.length === 1, [pendingModalSteps])

  return (
    <Box mt="32px">
      <Text fontSize="12px" textAlign="center" color="textSubtle">
        {t('Proceed in your wallet')}
      </Text>
      {!hideStepIndicators && (
        <>
          <StepsContainer>
            {pendingModalSteps.length !== 3 && (
              <Step active={confirmModalState === ConfirmModalStateV1.RESETTING_APPROVAL} width={stepWidth} />
            )}
            <Step active={confirmModalState === ConfirmModalStateV1.APPROVING_TOKEN} width={stepWidth} />
            <Step active={confirmModalState === ConfirmModalStateV1.APPROVE_PENDING} width={stepWidth} />
            <Step active={confirmModalState === ConfirmModalStateV1.PENDING_CONFIRMATION} width={stepWidth} />
          </StepsContainer>
          {confirmModalState === ConfirmModalStateV1.APPROVING_TOKEN && (
            <Flex justifyContent="center" margin="16px auto auto auto">
              <Text color="primary">{t('Why')}</Text>
              <Text m="0 2px" color="primary" style={{ borderBottom: '1px dashed' }} ref={targetRef}>
                {t('approving')}
              </Text>
              {tooltipVisible && tooltip}
              <Text color="primary">{t('this?')}</Text>
            </Flex>
          )}
        </>
      )}
    </Box>
  )
}
