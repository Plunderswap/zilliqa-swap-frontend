import { createElement } from 'react'
import { createStartHandler, StartServer } from '@tanstack/react-start/server'
import { defineHandlerCallback, renderRouterToString } from '@tanstack/react-router/ssr/server'
import { ServerStyleSheet } from 'styled-components'

const renderHandler = defineHandlerCallback(async ({ router, responseHeaders }) => {
  const sheet = new ServerStyleSheet()

  try {
    const response = await renderRouterToString({
      router,
      responseHeaders,
      children: sheet.collectStyles(createElement(StartServer, { router })),
    })
    const html = await response.text()

    const headers = new Headers(response.headers)
    if (!headers.has('Cache-Control')) {
      headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
    }

    return new Response(html.replace('</head>', `${sheet.getStyleTags()}</head>`), {
      headers,
      status: response.status,
      statusText: response.statusText,
    })
  } finally {
    sheet.seal()
  }
})

export default {
  fetch: createStartHandler(renderHandler),
}
