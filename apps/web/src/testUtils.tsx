/* eslint-disable class-methods-use-this */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unresolved */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterContextProvider } from '@tanstack/react-router'
import { render as rtlRender } from '@testing-library/react'
import Provider from 'Providers'
import { Provider as JotaiProvider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { initializeStore, makeStore } from 'state'
import { wagmiConfig } from 'utils/wagmi'
import { WagmiProvider } from 'wagmi'
import { getRouter } from './router'

const TestRouter = ({ children }) => <RouterContextProvider router={getRouter()}>{children}</RouterContextProvider>

export function renderWithProvider(
  ui,
  { preloadedState = undefined, store = initializeStore(preloadedState), ...renderOptions } = {},
) {
  function Wrapper({ children }) {
    return (
      <TestRouter>
        <Provider store={store} dehydratedState={{}}>
          {children}
        </Provider>
      </TestRouter>
    )
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

const HydrateAtoms = ({ initialValues, children }) => {
  // initialising on state with prop on render here
  useHydrateAtoms(initialValues)
  return children
}

export const createJotaiWrapper =
  (reduxState = undefined, testAtom, initState = undefined) =>
  ({ children }) => (
    <TestRouter>
      <Provider store={makeStore(reduxState)} dehydratedState={{}}>
        <JotaiProvider>
          {initState ? <HydrateAtoms initialValues={[[testAtom, initState]]}>{children}</HydrateAtoms> : children}
        </JotaiProvider>
      </Provider>
    </TestRouter>
  )

export const createReduxWrapper =
  (initState = undefined) =>
  ({ children }) => (
    <TestRouter>
      <Provider store={makeStore(initState)} dehydratedState={{}}>
        {children}
      </Provider>
    </TestRouter>
  )

export const createQueryClientWrapper =
  (queryClient) =>
  ({ children }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

export const createWagmiWrapper =
  () =>
  ({ children }) => {
    const queryClient = new QueryClient()

    return (
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          <TestRouter>{children}</TestRouter>
        </WagmiProvider>
      </QueryClientProvider>
    )
  }

// re-export everything
export * from '@testing-library/react'
