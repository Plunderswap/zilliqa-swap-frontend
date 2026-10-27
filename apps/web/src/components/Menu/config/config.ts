import { ContextApi } from '@dex/localization'
import { DropdownMenuItems, FarmIcon, InfoIcon, MenuItemsType, SwapFillIcon, SwapIcon } from '@dex/uikit'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Trade'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showItemsOnMobile: false,
      hideSubNav: true,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
      // Submenu removed while there is only one option; restore when another is added
      // items: [
      //   {
      //     label: t('Swap'),
      //     href: '/swap',
      //     icon: SwapIcon,
      //     fillIcon: SwapFillIcon,
      //   },
      // ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Pool'),
      icon: FarmIcon,
      fillIcon: FarmIcon,
      href: '/pool',
      hideSubNav: true,
      showItemsOnMobile: false,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Pairs'),
      href: '/stats',
      icon: InfoIcon,
      fillIcon: InfoIcon,
      hideSubNav: true,
      showItemsOnMobile: false,
      items: [].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
