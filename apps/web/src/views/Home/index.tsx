import { useTranslation } from '@dex/localization'
import { Box, PageSection, useMatchBreakpoints } from '@dex/uikit'
import useTheme from 'hooks/useTheme'
import { styled } from 'styled-components'
import { XBridgeExploitBanner } from './components/Banners/XBridgeExploitBanner'
import { Zrc2ExploitBanner } from './components/Banners/Zrc2ExploitBanner'
import Footer from './components/Footer'
import Hero from './components/Hero'
import SalesSection from './components/SalesSection'
import { earnSectionData, swapSectionData } from './components/SalesSection/data'
import { InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopLeft, WedgeTopRight } from './components/WedgeSvgs'

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`
const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme } = useTheme()
  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px', padding: '0px 16px' }
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  return (
    <Box style={{ width: isMobile ? '100vw' : 'calc(100vw - 8px)', overflow: 'hidden', boxSizing: 'border-box' }}>
      <style>
        {`
          #home-1 .page-bg {
            background: linear-gradient(139.73deg, #EEF3FF 0%, #F5F7FA 100%);
          }
          [data-theme='dark'] #home-1 .page-bg {
            background: radial-gradient(103.12% 50% at 50% 50%, #161B26 0%, #0B0E14 100%);
          }
          #home-2 .page-bg {
            background: linear-gradient(180deg, #ffffff 22%, #DCE3EE 100%);
          }
          [data-theme='dark'] #home-2 .page-bg {
            background: linear-gradient(180deg, #0B0E14 22%, #161B26 100%);
          }
          #home-3 .page-bg {
            background: linear-gradient(180deg, #DBE6FF 0%, #F5F7FA 100%);
          }
          [data-theme='dark'] #home-3 .page-bg {
            background: linear-gradient(180deg, #1E3A8A 0%, #0B0E14 100%);
          }
          #home-4 .inner-wedge svg {
            fill: #DCE3EE;
          }
          [data-theme='dark'] #home-4 .inner-wedge svg {
            fill: #161B26;
          }

          #bottom-wedge4-2 svg {
            fill: #C7D7FE;
          }
          [data-theme='dark'] #bottom-wedge4-2 svg {
            fill: #1E3A8A;
          }
        `}
      </style>
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%', overflow: 'visible', padding: '8px' } }}
        containerProps={{
          id: 'home-1',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <Zrc2ExploitBanner />
        <XBridgeExploitBanner />
        <Hero />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: { ...HomeSectionContainerStyles, maxWidth: 'auto' } }}
        background={theme.colors.background}
        containerProps={{
          id: 'home-4',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <SalesSection {...swapSectionData(t)} />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.gradientCardHeader}
        containerProps={{
          id: 'home4-2',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper width="150%" top>
            <WedgeTopRight />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
        <SalesSection {...earnSectionData(t)} />
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(180deg, #3B6FF6 0%, #2A55D4 100%)"
        index={2}
        hasCurvedDivider={false}
      >
        <Footer />
      </PageSection>
    </Box>
  )
}

export default Home
