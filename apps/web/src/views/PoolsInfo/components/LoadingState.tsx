import { Flex, Skeleton } from '@dex/uikit'
import styled from 'styled-components'

const LoadingContainer = styled.div`
  width: 100%;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 16px;
`

const LoadingState: React.FC = () => {
  return (
    <LoadingContainer>
      {[...Array(5)].map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Flex key={index} padding="16px" alignItems="center">
          <Flex flex={2}>
            <Skeleton width={48} height={48} mr="8px" />
            <Skeleton width={120} height={48} />
          </Flex>
          <Flex flex={1} justifyContent="flex-end">
            <Skeleton width={100} height={24} />
          </Flex>
          <Flex flex={1} justifyContent="flex-end">
            <Skeleton width={100} height={24} />
          </Flex>
        </Flex>
      ))}
    </LoadingContainer>
  )
}

export default LoadingState
