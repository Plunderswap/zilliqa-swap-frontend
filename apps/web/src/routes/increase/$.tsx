import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import Page from '../../pages/increase/[[...currency]]'
import { legacyPage } from '../-page'

const oldPath = /^(0x[a-fA-F0-9]{40}|BNB)-(0x[a-fA-F0-9]{40}|BNB)$/

export const Route = createFileRoute('/increase/$')({
  beforeLoad: ({ params }) => {
    const [currencyA, currencyB, fee, tokenId] = params._splat?.split('/') ?? []
    const match = currencyA?.match(oldPath)
    if (match) throw redirect({ href: `/add/${match[1]}/${match[2]}`, statusCode: 301 })
    if (currencyA && currencyB && currencyA.toLowerCase() === currencyB.toLowerCase()) {
      throw redirect({ href: `/add/${currencyA}`, statusCode: 303 })
    }
    if (!fee?.match(/^\d+$/) || !tokenId?.match(/^\d+$/)) throw notFound()
  },
  component: legacyPage(Page),
})
