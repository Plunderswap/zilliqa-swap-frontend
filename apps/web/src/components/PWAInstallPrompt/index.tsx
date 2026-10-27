import { useTranslation } from '@dex/localization'
import { Button, Flex, Image, Modal, ModalV2, Text } from '@dex/uikit'
import { useEffect, useState } from 'react'
import { APP_NAME } from 'config/constants'

export function PWAInstallPrompt() {
  const { t } = useTranslation()
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkIsMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)
    setIsMobile(checkIsMobile())

    const dismissedTimestamp = localStorage.getItem('pwaPromptDismissed')
    const isDismissed = dismissedTimestamp && Number(dismissedTimestamp) > Date.now()

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    // Only show prompt if it's a mobile device and not dismissed
    if (!isDismissed && checkIsMobile()) {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
      if (isIOSDevice && !isStandalone) {
        setShowPrompt(true)
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const setDismissalTimestamp = () => {
    const thirtyDaysFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000
    localStorage.setItem('pwaPromptDismissed', thirtyDaysFromNow.toString())
  }

  const handleDismiss = () => {
    setDismissalTimestamp()
    setShowPrompt(false)
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
      setDismissalTimestamp()
    }
  }

  // Don't show anything if not mobile
  if (!isMobile || !showPrompt) return null

  return (
    <ModalV2 isOpen onDismiss={handleDismiss}>
      <Modal title={t('Install %name% App', { name: APP_NAME })}>
        <Flex flexDirection="column" alignItems="center" width="100%" style={{ gap: '16px' }}>
          <Flex justifyContent="center" width="100%">
            <Image src="/logo.png" width={96} height={96} alt={APP_NAME} />
          </Flex>

          <Text>{t('Add %name% to your home screen for faster access', { name: APP_NAME })}</Text>

          {isIOS ? (
            <>
              <Text>
                {t('For iOS: Tap the share button')}{' '}
                <span role="img" aria-label="share">
                  📲
                </span>
              </Text>
              <Text>{t('Then select "Add to Home Screen"')}</Text>
            </>
          ) : (
            <Button onClick={handleInstallClick}>{t('Install App')}</Button>
          )}
        </Flex>
      </Modal>
    </ModalV2>
  )
}
