import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/swap_/$outputCurrency')({
  beforeLoad: ({ params }) => {
    throw redirect({ href: `/swap?outputCurrency=${encodeURIComponent(params.outputCurrency)}`, statusCode: 301 })
  },
})
