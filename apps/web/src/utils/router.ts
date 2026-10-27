import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useMemo } from 'react'

type QueryValue = string | string[] | undefined
type Query = Record<string, QueryValue>
type RouteUrl = string | { pathname?: string; query?: Query; hash?: string }
type RouteChangeHandler = (url: string, options: { shallow: boolean }) => void

const listeners = {
  routeChangeComplete: new Set<RouteChangeHandler>(),
  routeChangeStart: new Set<RouteChangeHandler>(),
}

const events = {
  on(event: keyof typeof listeners, handler: RouteChangeHandler) {
    listeners[event].add(handler)
  },
  off(event: keyof typeof listeners, handler: RouteChangeHandler) {
    listeners[event].delete(handler)
  },
}

const catchAllPrefixes = ['/v2/remove', '/v2/pair', '/v2/add', '/increase', '/add']

function queryFromLocation(pathname: string, search: Record<string, unknown>) {
  const query: Query = {}

  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) query[key] = value.map(String)
    else if (value !== undefined && value !== null) query[key] = String(value)
  }

  const catchAllPrefix = catchAllPrefixes.find((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  if (catchAllPrefix) {
    const currency = pathname.slice(catchAllPrefix.length).split('/').filter(Boolean).map(decodeURIComponent)
    if (currency.length) query.currency = currency
  }

  const tokenIdMatch = pathname.match(/^\/(?:liquidity|remove)\/([^/]+)$/)
  if (tokenIdMatch) query.tokenId = decodeURIComponent(tokenIdMatch[1])

  const addressMatch = pathname.match(/^\/v2\/migrate\/([^/]+)$/)
  if (addressMatch) query.address = decodeURIComponent(addressMatch[1])

  return query
}

function createUrl(url: RouteUrl, currentPathname: string) {
  if (typeof url === 'string') return url

  const query = { ...url.query }
  let pathname = url.pathname ?? currentPathname
  const catchAllPrefix = catchAllPrefixes.find(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}/[[`),
  )

  if (catchAllPrefix && query.currency) {
    const currency = Array.isArray(query.currency) ? query.currency : [query.currency]
    pathname = `${catchAllPrefix}/${currency.map(encodeURIComponent).join('/')}`
    delete query.currency
  }

  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || key === 'tokenId' || key === 'address') continue
    const values = Array.isArray(value) ? value : [value]
    values.forEach((item) => search.append(key, item))
  }

  const searchString = search.toString()
  return searchString ? `${pathname}?${searchString}` : pathname
}

export type AppRouter = ReturnType<typeof useRouter>

export function useRouter() {
  const navigate = useNavigate()
  const location = useRouterState({ select: (state) => state.location })
  const query = useMemo(
    () => queryFromLocation(location.pathname, location.search as Record<string, unknown>),
    [location.pathname, location.search],
  )

  useEffect(() => {
    const options = { shallow: false }
    listeners.routeChangeComplete.forEach((listener) => listener(location.href, options))
  }, [location.href])

  return useMemo(() => {
    const changeRoute = async (
      url: RouteUrl,
      as?: string,
      options?: { shallow?: boolean; scroll?: boolean },
      replace = false,
    ) => {
      const destination = as || createUrl(url, location.pathname)
      const eventOptions = { shallow: options?.shallow ?? false }
      listeners.routeChangeStart.forEach((listener) => listener(destination, eventOptions))
      await navigate({ to: destination, replace } as never)
      return true
    }

    return {
      asPath: location.href,
      back: () => window.history.back(),
      beforePopState: (_handler: () => boolean) => undefined,
      events,
      isReady: true,
      pathname: location.pathname,
      push: (url: RouteUrl, as?: string, options?: { shallow?: boolean; scroll?: boolean }) =>
        changeRoute(url, as, options),
      query,
      replace: (url: RouteUrl, as?: string, options?: { shallow?: boolean; scroll?: boolean }) =>
        changeRoute(url, as, options, true),
    }
  }, [location.href, location.pathname, navigate, query])
}
