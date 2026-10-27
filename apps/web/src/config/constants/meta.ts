import { ContextApi } from '@dex/localization'
import memoize from 'lodash/memoize'
import { APP_NAME } from '.'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: APP_NAME,
  description: 'Swap tokens and provide liquidity on Zilliqa.',
}

interface PathList {
  paths: { [path: string]: { title: string; basePath?: boolean; description?: string } }
}

const getPathList = (t: ContextApi['t']): PathList => {
  return {
    paths: {
      '/': {
        title: APP_NAME,
        description: DEFAULT_META.description,
      },
      '/swap': {
        basePath: true,
        title: `${t('Exchange')} | ${APP_NAME}`,
        description: t('Trade tokens instantly on Zilliqa.'),
      },
      '/add': { basePath: true, title: `${t('Add Liquidity')} | ${APP_NAME}` },
      '/remove': { basePath: true, title: `${t('Remove Liquidity')} | ${APP_NAME}` },
      '/liquidity': { title: `${t('Liquidity')} | ${APP_NAME}` },
      '/stats': { title: `${t('Pairs & Pools')} | ${APP_NAME}` },
    },
  }
}

export const getCustomMeta = memoize(
  (path: string, t: ContextApi['t'], _: string): PageMeta | null => {
    const pathList = getPathList(t)
    const basePath = Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0]
    const pathMetadata = pathList.paths[path] ?? (basePath && pathList.paths[basePath])

    if (pathMetadata) {
      return {
        title: `${pathMetadata.title}`,
        ...(pathMetadata.description && { description: pathMetadata.description }),
      }
    }
    return null
  },
  (path, t, locale) => `${path}#${locale}`,
)
