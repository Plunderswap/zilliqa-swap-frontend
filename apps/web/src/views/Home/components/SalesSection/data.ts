import { TranslateFunction } from '@dex/localization'
import { FarmIcon, SwapIcon } from '@dex/uikit'
import { SalesSectionProps } from '.'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Trade any token instantly.'),
  bodyText: t('Swap tokens with on-chain routing across V2 and V3 pools. No account or sign-up needed.'),
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: t('Trade Now'),
    external: false,
  },
  icon: SwapIcon,
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Provide liquidity, earn trading fees.'),
  bodyText: t(
    'Add liquidity to V2 pairs or concentrated-liquidity V3 positions and earn a share of the fees from every trade.',
  ),
  reverse: true,
  primaryButton: {
    to: '/liquidity',
    text: t('Explore'),
    external: false,
  },
  icon: FarmIcon,
})
