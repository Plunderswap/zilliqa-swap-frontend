import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  // @ts-ignore
  plugins: [tsconfigPaths({ projects: ['tsconfig.test.json'] }), react()],
  resolve: {
    alias: {
      '@dex/wagmi/connectors/blocto': r('../../packages/wagmi/connectors/blocto/index.ts'),
      '@dex/wagmi/connectors/miniProgram': r('../../packages/wagmi/connectors/miniProgram/index.ts'),
      '@dex/wagmi/connectors/trustWallet': r('../../packages/wagmi/connectors/trustWallet/index.ts'),
      '@dex/uikit': r('../../packages/uikit/src'),
      '@dex/localization': r('../../packages/localization/src'),
    },
  },
  test: {
    setupFiles: ['./vitest.setup.js'],
    environment: 'happy-dom',
    globals: true,
    exclude: ['src/config/__tests__', 'node_modules'],
  },
})
