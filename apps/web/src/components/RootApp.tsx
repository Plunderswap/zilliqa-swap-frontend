import { Outlet } from '@tanstack/react-router'
import Providers from '../Providers'
import NotFoundPage from '../pages/404'
import { useStore } from '../state'
import GlobalStyle from '../style/Global'
import { AppShell } from './AppShell'

export function RootApp() {
  const store = useStore(undefined)

  return (
    <Providers store={store} dehydratedState={undefined}>
      <GlobalStyle />
      <Outlet />
    </Providers>
  )
}

export function NotFound() {
  return <AppShell Component={NotFoundPage} />
}
