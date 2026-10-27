import { ResetCSS, ScrollToTopButtonV2, ToastListener } from '@dex/uikit'
import BigNumber from 'bignumber.js'
import { PWAInstallPrompt } from 'components/PWAInstallPrompt'
import { UpdatePrompt } from 'components/UpdatePrompt'
import { PageMeta } from 'components/Layout/Page'
import Menu from 'components/Menu'
import { NetworkModal } from 'components/NetworkModal'
import { useAccountEventListener } from 'hooks/useAccountEventListener'
import useEagerConnect from 'hooks/useEagerConnect'
import useEagerConnectMP from 'hooks/useEagerConnect.bmp'
import useThemeCookie from 'hooks/useThemeCookie'
import useUserAgent from 'hooks/useUserAgent'
import { Fragment } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from 'state'
import { usePollBlockNumber } from 'state/block/hooks'
import styled from 'styled-components'
import { Updaters } from '../index'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const StyledMenuWrapper = styled.div`
  nav {
    padding-top: env(safe-area-inset-top);
    min-height: calc(48px + env(safe-area-inset-top));
  }

  main {
    margin-top: calc(-1 * env(safe-area-inset-top));
  }
`

export type PageComponent = React.ComponentType<any> & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>
  pure?: boolean
  mp?: boolean
  chains?: number[]
  Meta?: React.FC<React.PropsWithChildren<unknown>>
}

function GlobalHooks() {
  usePollBlockNumber()
  useEagerConnect()
  useUserAgent()
  useAccountEventListener()
  useThemeCookie()
  return null
}

function MPGlobalHooks() {
  usePollBlockNumber()
  useEagerConnectMP()
  useUserAgent()
  useAccountEventListener()
  return null
}

export function AppShell({ Component, pageProps = {} }: { Component: PageComponent; pageProps?: object }) {
  if (Component.pure) return <Component {...pageProps} />

  const Layout = Component.Layout || Fragment
  const ShowMenu = Component.mp ? Fragment : Menu

  return (
    <>
      <PageMeta />
      {Component.Meta && <Component.Meta {...pageProps} />}
      {Component.mp ? <MPGlobalHooks /> : <GlobalHooks />}
      <ResetCSS />
      <PersistenceBoundary>
        <Updaters />
        <StyledMenuWrapper>
          <ShowMenu>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ShowMenu>
        </StyledMenuWrapper>
        <ToastListener />
        <NetworkModal pageSupportedChains={Component.chains} />
        <ScrollToTopButtonV2 />
      </PersistenceBoundary>
      <PWAInstallPrompt />
      <UpdatePrompt />
    </>
  )
}

function PersistenceBoundary({ children }: React.PropsWithChildren) {
  if (!persistor) return <>{children}</>
  return (
    <PersistGate loading={children} persistor={persistor}>
      {children}
    </PersistGate>
  )
}
