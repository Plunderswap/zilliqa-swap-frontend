import { Box, Button, Flex, Link, SvgProps, Text } from '@dex/uikit'
import { NextLinkFromReactRouter as RouterLink } from '@dex/widgets-internal'
import { styled } from 'styled-components'

import ColoredWordHeading from '../ColoredWordHeading'

const IconTile = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 192px;
  height: 192px;
  border-radius: 48px;
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

interface SalesSectionButton {
  to: string
  text: string
  external: boolean
}

export interface SalesSectionProps {
  headingText: string
  bodyText: string
  reverse: boolean
  primaryButton: SalesSectionButton
  icon: React.ElementType<SvgProps>
}

const SalesSection: React.FC<React.PropsWithChildren<SalesSectionProps>> = (props) => {
  const { headingText, bodyText, reverse, primaryButton, icon: Icon } = props

  return (
    <Flex flexDirection="column">
      <Flex
        flexDirection={['column-reverse', null, null, reverse ? 'row-reverse' : 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
      >
        <Flex
          flexDirection="column"
          flex="1"
          ml={[null, null, null, reverse ? '64px' : null]}
          mr={[null, null, null, !reverse ? '64px' : null]}
          alignSelf={['flex-start', null, null, 'center']}
        >
          <ColoredWordHeading text={headingText} />
          <Text color="textSubtle" mb="24px">
            {bodyText}
          </Text>
          <Flex>
            <Button mr="16px">
              {primaryButton.external ? (
                <Link external href={primaryButton.to}>
                  <Text color="card" bold fontSize="16px">
                    {primaryButton.text}
                  </Text>
                </Link>
              ) : (
                <RouterLink to={primaryButton.to}>
                  <Text color="card" bold fontSize="16px">
                    {primaryButton.text}
                  </Text>
                </RouterLink>
              )}
            </Button>
          </Flex>
        </Flex>
        <Flex flex={[null, null, null, '1']} justifyContent="center" alignSelf="center" mb={['24px', null, null, '0']}>
          <IconTile>
            <Icon width="96px" color="primary" />
          </IconTile>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SalesSection
