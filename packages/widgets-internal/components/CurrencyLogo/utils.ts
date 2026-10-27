import { Currency, Token } from "@dex/sdk";
import memoize from "lodash/memoize";
import { getAddress } from "viem";

export const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token) {
      return `/images/tokens/${getAddress(token.address)}.png`;
    }
    return null;
  },
  (t) => `${t?.chainId}#${t?.address}`,
);

export const getTokenLogoURLByAddress = memoize(
  (address?: string, chainId?: number) => {
    if (address) {
      return `/images/tokens/${getAddress(address)}.png`;
    }
    return null;
  },
  (address, chainId) => `${chainId}#${address}`,
);

type GetLogoUrlsOptions = {
  useTrustWallet?: boolean;
};

export const getCurrencyLogoUrls = memoize(
  (currency: Currency | undefined, { useTrustWallet = true }: GetLogoUrlsOptions = {}): string[] => {
    const logoUrl = useTrustWallet ? getTokenLogoURL(currency?.wrapped) : null;
    return logoUrl ? [logoUrl] : [];
  },
  (currency: Currency | undefined, options?: GetLogoUrlsOptions) =>
    `logoUrls#${currency?.chainId}#${currency?.wrapped?.address}#${options ? JSON.stringify(options) : ""}`,
);
