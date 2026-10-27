import { useTranslation } from '@dex/localization'
import { Button, Flex, Heading, LogoIcon, useMatchBreakpoints } from '@dex/uikit'
import { NextLinkFromReactRouter } from '@dex/widgets-internal'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { APP_NAME } from 'config/constants'
import { keyframes, styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`

const LogoWrapper = styled.div`
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
  will-change: transform;
  display: flex;
  justify-content: center;
`

const Hero = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isMobile, isXs, isMd } = useMatchBreakpoints()

  return (
    <>
      <style>
        {`
          .slide-svg-dark {
            display: none;
          }
          .slide-svg-light {
            display: block;
          }
          [data-theme='dark'] .slide-svg-dark {
            display: block;
          }
          [data-theme='dark'] .slide-svg-light {
            display: none;
          }
        `}
      </style>
      <BgWrapper>
        <InnerWrapper>
          <SlideSvgDark className="slide-svg-dark" width="100%" />
          <SlideSvgLight className="slide-svg-light" width="100%" />
        </InnerWrapper>
      </BgWrapper>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['center', null, null, 'center']}
        justifyContent="center"
        mt={['50px', null, 0]}
        pl={['0px', '0px', '0px', '30px']}
        id="homepage-hero"
      >
        <Flex flex="1" flexDirection="column">
          <Heading scale="xxl" color="secondary" mb="24px">
            {t('Swap. Pool. Earn.')}
          </Heading>
          <Heading scale="md" mb="24px">
            {t('%name% is a decentralised exchange on Zilliqa. Swap tokens and provide liquidity to V2 and V3 pools.', {
              name: APP_NAME,
            })}
          </Heading>

          <Flex justifyContent={isMobile || isMd ? 'center' : 'start'}>
            {!account && <ConnectWalletButton style={{ borderRadius: isXs ? 12 : undefined }} scale="md" mr="8px" />}
            <NextLinkFromReactRouter to="/swap">
              <Button
                scale="md"
                style={{ borderRadius: isXs ? 12 : undefined }}
                variant={!account ? 'secondary' : 'primary'}
              >
                {t('Trade Now')}
              </Button>
            </NextLinkFromReactRouter>
          </Flex>
        </Flex>
        <Flex
          height={['100%', null, null, '100%']}
          width={['100%', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}
          position="relative"
        >
          <LogoWrapper>
            <LogoIcon width={isMobile ? '160px' : '280px'} />
          </LogoWrapper>
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
