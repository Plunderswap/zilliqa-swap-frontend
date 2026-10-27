import { Menu as UikitMenu } from '@dex/uikit'
import { NextLinkFromReactRouter } from '@dex/widgets-internal'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import { APP_NAME } from 'config/constants'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'utils/router'
import { useMemo } from 'react'
import GlobalSettings from './GlobalSettings'
import { SettingsMode } from './GlobalSettings/types'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'

const LinkComponent = (linkProps) => {
  return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
}

const Menu = (props) => {
  const { isDark, setTheme } = useTheme()
  const { pathname } = useRouter()

  const menuItems = useMenuItems()

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  return (
    <>
      <UikitMenu
        linkComponent={LinkComponent}
        appName={APP_NAME}
        rightSide={
          <>
            <GlobalSettings mode={SettingsMode.GLOBAL} />
            <NetworkSwitcher />
            <UserMenu />
          </>
        }
        // banner={showPhishingWarningBanner && typeof window !== 'undefined' && <PhishingWarningBanner />}
        isDark={isDark}
        toggleTheme={toggleTheme}
        links={menuItems}
        subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
        activeItem={activeMenuItem?.href}
        activeSubItem={activeSubMenuItem?.href}
        {...props}
      />
    </>
  )
}

export default Menu
