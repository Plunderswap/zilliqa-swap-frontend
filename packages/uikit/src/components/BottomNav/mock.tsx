import ItemsMock from "../DropdownMenu/mock";
import { MenuItemsType } from "../MenuItems/types";
import { FarmIcon, InfoFilledIcon, InfoIcon, SwapFillIcon, SwapIcon } from "../Svg";

const MenuItemsMock: MenuItemsType[] = [
  {
    label: "Swap",
    href: "/swap",
    icon: SwapIcon,
    fillIcon: SwapFillIcon,
    items: ItemsMock,
    showItemsOnMobile: false,
  },
  {
    label: "Earn",
    href: "/earn",
    icon: FarmIcon,
    fillIcon: FarmIcon,
    items: ItemsMock,
    showItemsOnMobile: true,
  },
  {
    label: "Gagnez des jetons",
    href: "/win",
    icon: InfoIcon,
    fillIcon: InfoFilledIcon,
    items: ItemsMock,
    showItemsOnMobile: true,
  },
  {
    label: "NFT",
    href: "/nft",
    icon: InfoIcon,
    fillIcon: InfoFilledIcon,
    items: ItemsMock,
  },
  {
    label: "More",
    href: "/more",
    icon: InfoIcon,
    items: ItemsMock,
    showItemsOnMobile: true,
  },
];

export default MenuItemsMock;
