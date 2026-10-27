import { createGlobalStyle } from "styled-components";
import { tokens } from "../tokens";

interface TokenObject {
  [key: string]: string | number | TokenObject;
}

const contract = (value: TokenObject, path: string[] = []): TokenObject =>
  Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      typeof child === "object" ? contract(child, [...path, key]) : `var(--${[...path, key].join("-")})`,
    ]),
  );

const declarations = (value: TokenObject, path: string[] = []): string =>
  Object.entries(value)
    .map(([key, child]) =>
      typeof child === "object"
        ? declarations(child, [...path, key])
        : `--${[...path, key].join("-")}: ${String(child)};`,
    )
    .join("\n");

const { colors, ...baseTokens } = tokens;
const baseVars = contract(baseTokens as unknown as TokenObject);
const modeVars = contract({ colors: colors.light } as unknown as TokenObject);

export const vars = { ...baseVars, ...modeVars } as unknown as Omit<typeof tokens, "colors"> & {
  colors: typeof colors.light;
};

export const TokenGlobalStyles = createGlobalStyle`
  :root {
    ${declarations(baseTokens as unknown as TokenObject)}
    ${declarations({ colors: colors.light } as unknown as TokenObject)}
  }

  [data-theme='light'] {
    ${declarations({ colors: colors.light } as unknown as TokenObject)}
  }

  [data-theme='dark'] {
    ${declarations({ colors: colors.dark } as unknown as TokenObject)}
  }
`;
