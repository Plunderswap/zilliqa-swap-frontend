import { FlexProps } from "../Box";

export type FooterLinkType = {
  label: string;
  items: { label: string; href?: string; isHighlighted?: boolean }[];
};

export type FooterProps = {
  appName: string;
  items?: FooterLinkType[];
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
} & FlexProps;
