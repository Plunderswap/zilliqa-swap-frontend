import { ElementType, ReactElement, ReactNode } from "react";
import type { Language } from "../../components/LangSelector/types";
import { FooterLinkType } from "../../components/Footer/types";
import { MenuItemsType } from "../../components/MenuItems/types";
import { SubMenuItemsType } from "../../components/SubMenuItems/types";
import { Colors } from "../../theme/types";

export interface LinkStatus {
  text: string;
  color: keyof Colors;
}

export interface NavProps {
  linkComponent?: ElementType;
  rightSide?: ReactNode;
  banner?: ReactElement;
  links: Array<MenuItemsType>;
  subLinks?: Array<SubMenuItemsType>;
  appName: string;
  footerLinks?: Array<FooterLinkType>;
  activeItem?: string;
  activeSubItem?: string;
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
  currentLang?: string;
  langs?: Language[];
  setLang?: (lang: Language) => void;
}
