import { Swap } from '@dex/widgets-internal'

const Page: React.FC<
  React.PropsWithChildren<{
    removePadding?: boolean
    hideFooterOnDesktop?: boolean
    noMinHeight?: boolean
    helpUrl?: string
  }>
> = ({ children, removePadding = false, hideFooterOnDesktop = false, noMinHeight = false, helpUrl, ...props }) => {
  return (
    <Swap.Page
      removePadding={removePadding}
      noMinHeight={noMinHeight}
      hideFooterOnDesktop={hideFooterOnDesktop}
      helpUrl={helpUrl}
      {...props}
    >
      {children}
    </Swap.Page>
  )
}

export default Page
