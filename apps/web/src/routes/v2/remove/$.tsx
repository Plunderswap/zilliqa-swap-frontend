import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import Page from '../../../pages/v2/remove/[[...currency]]'
import { legacyPage } from '../../-page'

const oldPath = /^(0x[a-fA-F0-9]{40})-(0x[a-fA-F0-9]{40})$/

export const Route = createFileRoute('/v2/remove/$')({
  beforeLoad: ({ params }) => {
    const currency = params._splat?.split('/').filter(Boolean) ?? []
    if (!currency.length) throw notFound()
    if (currency.length === 1 && !oldPath.test(currency[0])) throw redirect({ href: '/liquidity', statusCode: 307 })
    if (currency.length === 1) {
      const [currencyA, currencyB] = currency[0].split('-')
      throw redirect({ href: `/v2/remove/${currencyA}/${currencyB}`, statusCode: 307 })
    }
  },
  component: legacyPage(Page),
})
