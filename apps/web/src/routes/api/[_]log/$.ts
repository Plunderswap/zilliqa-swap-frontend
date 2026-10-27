import { createFileRoute } from '@tanstack/react-router'

const ok = () => new Response('OK')

export const Route = createFileRoute('/api/_log/$')({
  server: {
    handlers: {
      DELETE: ok,
      GET: ok,
      PATCH: ok,
      POST: ok,
      PUT: ok,
    },
  },
})
