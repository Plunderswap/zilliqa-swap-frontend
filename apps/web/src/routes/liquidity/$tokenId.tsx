import { createFileRoute, redirect } from '@tanstack/react-router'
import Page from '../../pages/liquidity/[tokenId]'
import { legacyPage } from '../-page'

export const Route = createFileRoute('/liquidity/$tokenId')({
  beforeLoad: ({ params }) => {
    if (!/^\d+$/.test(params.tokenId)) throw redirect({ href: '/add', statusCode: 303 })
  },
  component: legacyPage(Page),
})
