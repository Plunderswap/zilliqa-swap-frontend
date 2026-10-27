import { ReactNode } from "react";
import { AtomBox, AtomBoxProps } from "@dex/uikit";
import styled from "styled-components";

import { SwapFooter } from "./Footer";

type SwapPageProps = AtomBoxProps & {
  removePadding?: boolean;
  hideFooterOnDesktop?: boolean;
  noMinHeight?: boolean;
  helpUrl?: string;
  helpImage?: ReactNode;
  externalText?: string;
  externalLinkUrl?: string;
};

const Page = styled(AtomBox)<{ $removePadding?: boolean; $noMinHeight?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: ${({ $noMinHeight }) => ($noMinHeight ? "initial" : "100vh")};
  background: ${({ theme }) => theme.colors.gradientBubblegum};
  background-size: auto;
  padding: ${({ $removePadding }) => ($removePadding ? "0" : "16px 16px 0")};

  ${({ theme, $removePadding }) => theme.mediaQueries.sm} {
    padding: ${({ $removePadding }) => ($removePadding ? "0" : "24px 24px 0")};
  }

  ${({ theme, $removePadding }) => theme.mediaQueries.lg} {
    padding: ${({ $removePadding }) => ($removePadding ? "0" : "32px 32px 0")};
  }
`;

export const SwapPage = ({
  removePadding,
  noMinHeight,
  children,
  hideFooterOnDesktop,
  helpUrl,
  helpImage,
  externalText,
  externalLinkUrl,
  ...props
}: SwapPageProps) => (
  <Page $removePadding={removePadding} $noMinHeight={noMinHeight} {...props}>
    {children}
    <AtomBox display="flex" flexGrow={1} />
    <AtomBox display={["block", null, null, hideFooterOnDesktop ? "none" : "block"]} width="100%">
      <SwapFooter
        externalText={externalText}
        externalLinkUrl={externalLinkUrl}
        helpUrl={helpUrl}
        helpImage={helpImage}
      />
    </AtomBox>
  </Page>
);
