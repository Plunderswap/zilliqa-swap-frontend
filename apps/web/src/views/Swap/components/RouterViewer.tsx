import { AtomBox, Box, Flex } from '@dex/uikit'
import { styled } from 'styled-components'

export const RouterBox = styled(Flex)`
  position: relative;
  flex-direction: row;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 3px;
    border-top: 3px dotted ${({ theme }) => theme.colors.backgroundDisabled};
    transform: translateY(-50%);
    z-index: 1;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 400px;
  }
`

export const RouterPoolBox = styled(Box)`
  position: relative;
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  padding: 2px 4px;
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  z-index: 2;

  &.highlight {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 4px 8px;
  }
`

export const RouterTypeText = styled.div<{ fontWeight?: string }>`
  font-size: 14px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text};
  position: absolute;
  white-space: nowrap;
  left: 50%;
  transform: translateX(-50%);
  top: calc(100% + 3px);
  font-weight: ${(props) => props.fontWeight || 'normal'};

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
    line-height: 20px;
  }
`

export const CurrencyLogoWrapper = styled(AtomBox)`
  position: relative;
  padding: 2px;
  background: linear-gradient(180deg, #6b93ff 0%, #3b6ff6 76.22%);
  border-radius: 50%;
  z-index: 2;
`
