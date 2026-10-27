import menuConfig from 'components/Menu/config/config'
import type { ConfigMenuItemsType } from 'components/Menu/config/config'
import { getActiveMenuItem, getActiveSubMenuItem } from 'components/Menu/utils'

const mockT = (key) => key

describe('getActiveMenuItem', () => {
  it('should return an active item', () => {
    // Given
    const pathname = '/swap'

    // When
    const result = getActiveMenuItem({ pathname, menuConfig: menuConfig(mockT, false, undefined) })

    // Then
    expect(result).toEqual(menuConfig(mockT, false, undefined)[0])
  })

  it('should return an active pool item', () => {
    const pathname = '/pool'

    const result = getActiveMenuItem({ pathname, menuConfig: menuConfig(mockT, false, undefined) })

    expect(result).toEqual(menuConfig(mockT, false, undefined)[1])
  })

  it('should return an active item when a submenu route matches', () => {
    const pathname = '/lst'

    const result = getActiveMenuItem({ pathname, menuConfig: menuConfig(mockT, false, undefined) })

    expect(result).toEqual(menuConfig(mockT, false, undefined)[3])
  })

  it('should return undefined if item is not found', () => {
    const pathname = '/corgi'

    const result = getActiveMenuItem({ pathname, menuConfig: menuConfig(mockT, false, undefined) })

    expect(result).toEqual(undefined)
  })
})

describe('getActiveSubMenuItem', () => {
  it('should return undefined', () => {
    const pathname = '/'

    const result = getActiveSubMenuItem({ pathname, menuItem: menuConfig(mockT, false, undefined)[1] })

    expect(result).toEqual(undefined)
  })

  it('should return an active sub item', () => {
    const pathname = '/crosschain'

    const result = getActiveSubMenuItem({ pathname, menuItem: menuConfig(mockT, false, undefined)[2] })

    expect(result).toEqual(menuConfig(mockT, false, undefined)[2].items?.[0])
  })

  it('should return the item with the longest href when multiple items are found', () => {
    const menuItem = {
      href: '/stats',
      items: [{ href: '/stats' }, { href: '/stats/token' }],
    } as ConfigMenuItemsType

    const result = getActiveSubMenuItem({ pathname: '/stats/token/0x123', menuItem })

    expect(result).toEqual(menuItem.items?.[1])
  })

  it('should return undefined if item is not found', () => {
    const pathname = '/corgi'

    const result = getActiveSubMenuItem({ pathname, menuItem: menuConfig(mockT, false, undefined)[1] })

    expect(result).toEqual(undefined)
  })
})
