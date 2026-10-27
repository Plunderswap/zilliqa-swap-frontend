import { useTranslation } from '@dex/localization'
import { Button, Flex, Modal, ModalV2, Text } from '@dex/uikit'
import { useRouter } from 'utils/router'
import { useEffect, useState } from 'react'
import { APP_NAME } from 'config/constants'

// const isDevelopment = process.env.NODE_ENV === 'development'
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

export function UpdatePrompt() {
  const { t } = useTranslation()
  const [showPrompt, setShowPrompt] = useState(false)
  const router = useRouter()

  const checkForUpdates = async () => {
    // Skip update check for development/localhost
    if (isLocalhost) {
      return
    }

    // Skip for desktop
    if (window.innerWidth >= 768) {
      return
    }

    try {
      const metaTag = document.querySelector('meta[name="build-id"]')
      const currentBuildId = metaTag?.getAttribute('content')
      const storedBuildId = localStorage.getItem('buildId')

      // Only show prompt if we have a stored build ID and it differs from current
      if (storedBuildId && storedBuildId !== currentBuildId) {
        setShowPrompt(true)
      }
    } catch {
      // Storage access can be unavailable in restricted browser contexts.
    }
  }

  useEffect(() => {
    const checkAndUpdate = () => {
      checkForUpdates()
    }

    router.events.on('routeChangeComplete', checkAndUpdate)
    checkAndUpdate() // Initial check

    return () => {
      router.events.off('routeChangeComplete', checkAndUpdate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpdate = () => {
    const metaTag = document.querySelector('meta[name="build-id"]')
    const currentBuildId = metaTag?.getAttribute('content')
    if (currentBuildId) {
      localStorage.setItem('buildId', currentBuildId)
    }

    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name)
        })
      })
    }
    window.location.reload() // Removed true argument since reload() doesn't accept arguments
  }

  // Don't render anything in development/localhost
  if (isLocalhost || !showPrompt) return null

  return (
    <ModalV2 isOpen>
      <Modal title={t('Update Available')}>
        <Flex flexDirection="column" alignItems="center" width="100%" style={{ gap: '16px' }}>
          <Text>{t('A new version of %name% is available', { name: APP_NAME })}</Text>
          <Text fontSize="14px" color="textSubtle">
            {t('Please refresh your browser to ensure you have the latest version')}
          </Text>
          <Button onClick={handleUpdate}>{t('Update Now')}</Button>
        </Flex>
      </Modal>
    </ModalV2>
  )
}
