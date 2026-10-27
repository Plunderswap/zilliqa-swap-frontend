import { Button, Flex, Text } from '@dex/uikit'
import styled from 'styled-components'

const ErrorContainer = styled(Flex)`
  width: 100%;
  padding: 32px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.failure};
  flex-direction: column;
  align-items: center;
  text-align: center;
`

interface ErrorStateProps {
  onRetry: () => void
}

const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <ErrorContainer>
      <Text color="failure" bold mb="16px">
        Error loading data
      </Text>
      <Text mb="16px">There was an error loading the latest pool data. Please try again later.</Text>
      <Button onClick={onRetry} variant="primary">
        Retry
      </Button>
    </ErrorContainer>
  )
}

export default ErrorState
