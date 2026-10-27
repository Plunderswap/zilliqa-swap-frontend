import { createFileRoute } from '@tanstack/react-router'
import { number as zNumber, object as zObject, string as zString } from 'zod'

const zBody = zObject({
  'csp-report': zObject({
    'blocked-uri': zString(),
    disposition: zString(),
    'document-uri': zString(),
    'effective-directive': zString(),
    'original-policy': zString(),
    referrer: zString(),
    'status-code': zNumber(),
    'violated-directive': zString(),
  }),
})

const badRequest = () => new Response(null, { status: 400, statusText: 'Bad Request' })

export const Route = createFileRoute('/api/_report/csp')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const json = await request.json()
          const parsed = zBody.safeParse(json)
          if (!parsed.success) {
            console.error('CSP-Report invalid request', { body: json, error: parsed.error })
            return badRequest()
          }

          console.info('CSP-Report violation', parsed.data['csp-report'])
          return new Response(null, { status: 200, statusText: 'OK' })
        } catch (error) {
          console.error('CSP-Report unexpected error', { error })
          return badRequest()
        }
      },
    },
  },
})
