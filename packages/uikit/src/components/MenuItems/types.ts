/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementType } from "react";
import { BoxProps } from "../Box";
import { DropdownMenuItemType, DropdownMenuItems } from "../DropdownMenu/types";

export type MenuItemsType = {
  label: string;
  href: string;
  icon?: ElementType<any>;
  fillIcon?: ElementType<any>;
  items?: DropdownMenuItems[];
  type?: DropdownMenuItemType;
  disabled?: boolean;
  showOnMobile?: boolean;
  showItemsOnMobile?: boolean;
};

export interface MenuItemsProps extends BoxProps {
  items: MenuItemsType[];
  activeItem?: string;
  activeSubItem?: string;
}
