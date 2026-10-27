import noop from "lodash/noop";
import type { Language } from "@dex/localization";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { renderWithProvider } from "../../testHelpers";
import { Menu, menuConfig } from "../../widgets/Menu";
import { footerLinks } from "../../components/Footer/config";
import { SubMenuItemsType } from "../../components";

/**
 * @see https://jestjs.io/docs/en/manual-mocks
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `en${i}-locale`,
}));

it("renders correctly", () => {
  const { asFragment } = renderWithProvider(
    <BrowserRouter>
      <Menu
        appName="Swap"
        isDark={false}
        toggleTheme={noop}
        langs={langs}
        setLang={noop}
        currentLang="en-US"
        links={menuConfig}
        subLinks={menuConfig[0].items as SubMenuItemsType[]}
        footerLinks={footerLinks}
        activeItem="Trade"
        activeSubItem="Exchange"
      >
        body
      </Menu>
    </BrowserRouter>,
  );

  expect(asFragment()).toMatchSnapshot();
});
