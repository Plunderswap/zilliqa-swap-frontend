import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'
import { shouldGeoBlock } from '@dex/utils/geoBlock'
import {
  EXPERIMENTAL_FEATURE_CONFIGS,
  ExperimentalFeatureConfigs,
  FeatureRollOutConfig,
  getCookieKey,
} from 'config/experimentalFeatures'

const ONE_YEAR_SECONDS = 31_536_000
const middlewarePaths = new Set(['/', '/add', '/liquidity', '/remove', '/stats', '/swap'])

async function getExperimentalFeatureAccessList(userIdentifier: string, featureFlags: ExperimentalFeatureConfigs) {
  return Promise.all(
    featureFlags.map(async (flag: FeatureRollOutConfig) => {
      if (flag.whitelist.includes(userIdentifier)) return { feature: flag.feature, hasAccess: true }
      const message = new TextEncoder().encode(`${userIdentifier}-${flag.feature}`)
      const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', message))
      return { feature: flag.feature, hasAccess: hash[hash.length - 1] <= flag.percentage * 0xff }
    }),
  )
}

function readCookie(request: Request, name: string) {
  const cookies = request.headers.get('cookie')?.split(';') ?? []
  for (const cookiePart of cookies) {
    const [key, ...value] = cookiePart.trim().split('=')
    if (key === name) return decodeURIComponent(value.join('='))
  }
  return undefined
}

function cookie(name: string, value: string, maxAge: number, httpOnly = false) {
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; Secure; SameSite=Lax${
    httpOnly ? '; HttpOnly' : ''
  }`
}

const appMiddleware = createMiddleware().server(async ({ request, pathname, next }) => {
  const requestWithCf = request as Request & { cf?: { country?: string; region?: string } }
  if (middlewarePaths.has(pathname) && shouldGeoBlock(requestWithCf.cf)) {
    return Response.redirect(new URL('/451', request.url), 307)
  }

  const result = await next()
  result.response.headers.set('X-Content-Type-Options', 'nosniff')
  result.response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  result.response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  if (pathname === '/favicon.ico' || pathname === '/logo.png' || pathname.startsWith('/images/')) {
    result.response.headers.set('Cache-Control', 'public, immutable, max-age=31536000')
  }

  if (!middlewarePaths.has(pathname)) return result

  const clientId = readCookie(request, 'p_client_id') ?? crypto.randomUUID()
  result.response.headers.append('Set-Cookie', cookie('p_client_id', clientId, ONE_YEAR_SECONDS, true))

  const accessList = await getExperimentalFeatureAccessList(clientId, EXPERIMENTAL_FEATURE_CONFIGS)
  accessList.forEach(({ feature, hasAccess }) => {
    result.response.headers.append(
      'Set-Cookie',
      cookie(getCookieKey(feature), String(hasAccess), hasAccess ? ONE_YEAR_SECONDS : 0),
    )
  })

  return result
})

const csrfMiddleware = createCsrfMiddleware({
  filter: (context) => context.handlerType === 'serverFn',
})

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, appMiddleware],
}))
