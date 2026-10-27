import { useTheme } from '@dex/hooks'
import { useTranslation } from '@dex/localization'
import { DropdownMenuItems } from '@dex/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { IdType, useUserNotUsCitizenAcknowledgement } from 'hooks/useUserIsUsCitizenAcknowledgement'
import React, { useMemo } from 'react'
import config, { ConfigMenuItemsType } from '../config/config'
import { useMenuItemsStatus } from './useMenuItemsStatus'

export const useMenuItems = (onUsCitizenModalPresent?: () => void): ConfigMenuItemsType[] => {
  const {
    t,
    currentLanguage: { code: languageCode },
  } = useTranslation()
  const { chainId } = useActiveChainId()
  const { isDark } = useTheme()
  const menuItemsStatus = useMenuItemsStatus()
  const menuItems = useMemo(() => {
    return config(t, isDark, languageCode, chainId)
  }, [t, isDark, languageCode, chainId])
  const [userNotUsCitizenAcknowledgement] = useUserNotUsCitizenAcknowledgement(IdType.PERPETUALS)

  return useMemo(() => {
    if (menuItemsStatus && Object.keys(menuItemsStatus).length) {
      return menuItems.map((item) => {
        const innerItems = item?.items?.map((innerItem) => {
          const itemStatus = innerItem.href ? menuItemsStatus[innerItem.href] : undefined
          const modalId = innerItem.confirmModalId
          if (itemStatus) {
            let itemMenuStatus: DropdownMenuItems['status'] | null = null
            if (itemStatus === 'soon') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Soon'), color: 'warning' }
            } else if (itemStatus === 'live') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Live'), color: 'failure' }
            } else if (itemStatus === 'vote_now') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Vote Now'), color: 'success' }
            } else if (itemStatus === 'pot_open') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Pot Open'), color: 'success' }
            } else if (itemStatus === 'lock_end') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Lock End'), color: 'failure' }
            } else {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('New'), color: 'success' }
            }
            return { ...innerItem, status: itemMenuStatus }
          }
          if (modalId) {
            if (modalId === 'usCitizenConfirmModal') {
              const onClickEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
                if (!userNotUsCitizenAcknowledgement && onUsCitizenModalPresent) {
                  e.stopPropagation()
                  e.preventDefault()
                  onUsCitizenModalPresent()
                }
              }

              return { ...innerItem, onClick: onClickEvent }
            }
            return { ...innerItem }
          }
          return innerItem
        })
        return { ...item, items: innerItems }
      })
    }
    return menuItems
  }, [t, menuItems, menuItemsStatus, userNotUsCitizenAcknowledgement, onUsCitizenModalPresent])
}
