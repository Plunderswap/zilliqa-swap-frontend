import { AppRouter } from 'utils/router'

export const getHashFromRouter = (router: AppRouter) => {
  return router.asPath.match(/#([a-z0-9]+)/gi)
}
