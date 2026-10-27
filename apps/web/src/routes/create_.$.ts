import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/create_/$')({
  beforeLoad: ({ params }) => {
    const suffix = params._splat ? `/${params._splat}` : ''
    throw redirect({ href: `/add${suffix}`, statusCode: 301 })
  },
})
