import { Flex } from '@dex/uikit'
import { AppBody } from 'components/App'
import { useDefaultsFromURLSearch } from 'state/swap/hooks'
import Page from '../Page'
import { V3SwapForm } from './V3Swap'
import { StyledInputCurrencyWrapper, StyledSwapContainer } from './styles'

export default function Swap() {
  useDefaultsFromURLSearch()

  return (
    <Page>
      <Flex width={['328px', '100%']} height="100%" justifyContent="center" position="relative" alignItems="flex-start">
        <Flex flexDirection="column">
          <StyledSwapContainer>
            <StyledInputCurrencyWrapper>
              <AppBody>
                <V3SwapForm />
              </AppBody>
            </StyledInputCurrencyWrapper>
          </StyledSwapContainer>
        </Flex>
      </Flex>
    </Page>
  )
}
