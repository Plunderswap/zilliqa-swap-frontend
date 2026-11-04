import { useTranslation } from '@dex/localization'
import { Box, Flex, Heading, Text } from '@dex/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import SunburstSvg from './SunburstSvg'

const BgWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 1;
`

const StyledSunburst = styled(SunburstSvg)`
  height: 100%;
  width: 100%;
  transform: scale3d(3.5, 3.5, 1);
  transform-origin: center center;
  ${({ theme }) => theme.mediaQueries.xl} {
    transform: scale3d(4, 4, 1);
  }
`

const Wrapper = styled(Flex)`
  width: 100%;
  z-index: 2;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 480px;
`

const Footer = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  return (
    <Box>
      <BgWrapper>
        <Flex position="relative" zIndex={2} alignItems="center" justifyContent="center" width="100%" height="100%">
          <StyledSunburst />
        </Flex>
      </BgWrapper>
      <Wrapper>
        <Heading mb="24px" scale="xl" color="white">
          {t('Start in seconds.')}
        </Heading>
        <Text textAlign="center" color="white">
          {t('Connect your crypto wallet to start using the app in seconds.')}
        </Text>
        <Text mb="24px" bold color="white">
          {t('No registration needed.')}
        </Text>
        {!account && <ConnectWalletButton variant="tertiary" />}
        <Text mt="24px" px="16px" fontSize="12px" textAlign="center" color="white">
          {t(
            'Open-source software provided as is, with no warranty. Each deployment is run independently by whoever deploys it. Use at your own risk.',
          )}
        </Text>
      </Wrapper>
    </Box>
  )
}

export default Footer
