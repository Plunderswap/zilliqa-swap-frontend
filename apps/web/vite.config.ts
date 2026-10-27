import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = {
    NEXT_PUBLIC_APP_NAME: 'Swap',
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: '',
    ...loadEnv(mode, process.cwd(), 'NEXT_PUBLIC_'),
  }
  const publicEnv = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
  )

  return {
    define: {
      ...publicEnv,
      global: 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'uikit',
                test: /[\\/]packages[\\/]uikit[\\/]/,
                includeDependenciesRecursively: true,
              },
            ],
          },
        },
      },
    },
    plugins: [
      cloudflare({ viteEnvironment: { name: 'ssr' } }) as any,
      tsconfigPaths(),
      tanstackStart({ server: { entry: 'server' }, client: { entry: 'client' } }),
      viteReact({
        plugins: [['@swc/plugin-styled-components', { ssr: true }]],
      }),
    ],
  }
})
