import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import Providers from '../Providers'
import { AppShell } from '../components/AppShell'
import { APP_NAME } from '../config/constants'
import { DEFAULT_META } from '../config/constants/meta'
import NotFoundPage from '../pages/404'
import GlobalStyle from '../style/Global'
import { useStore } from '../state'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover',
      },
      { name: 'description', content: DEFAULT_META.description },
      { name: 'theme-color', content: '#3B6FF6' },
      { name: 'twitter:description', content: DEFAULT_META.description },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: APP_NAME },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: APP_NAME },
      { name: 'build-id', content: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development' },
      { title: APP_NAME },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;800&display=swap',
      },
      { rel: 'shortcut icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/logo.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/ios/apple-touch-icon-180x180.png' },
      { rel: 'apple-touch-icon', sizes: '167x167', href: '/icons/ios/apple-touch-icon-167x167.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: '/icons/ios/apple-touch-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '120x120', href: '/icons/ios/apple-touch-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/icons/ios/apple-touch-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: '60x60', href: '/icons/ios/apple-touch-icon-60x60.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument() {
  const store = useStore(undefined)

  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers store={store} dehydratedState={undefined}>
          <GlobalStyle />
          <Outlet />
        </Providers>
        <div id="portal-root" />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return <AppShell Component={NotFoundPage} />
}
