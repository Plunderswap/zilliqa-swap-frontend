# Swap Frontend

An open-source frontend for a Uniswap V2/V3-style AMM on [Zilliqa](https://www.zilliqa.com). It supports:

- Swapping, with on-chain routing across V2 and V3 pools
- Adding and removing V2 liquidity and V3 concentrated-liquidity positions
- A Pairs & Pools page, built from on-chain data only

It runs as a [TanStack Start](https://tanstack.com/start) app on Cloudflare Workers. It has no backend of its own. Everything comes from the chain RPC, plus the public Blockscout API for discovering V3 pools.

## Getting started

Install dependencies with [Bun](https://bun.sh) (Node 22.12+ is also required):

```sh
bun install
cp apps/web/.env.example apps/web/.env
bun run dev        # http://localhost:3000
```

Build and preview a production bundle:

```sh
bun run build
bun run preview
```

## Configuration

| What                                                                  | Where                                                                                                                                                                               |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App name (header, footer, titles, wallet prompts)                     | `NEXT_PUBLIC_APP_NAME` in `apps/web/.env`                                                                                                                                           |
| WalletConnect project ID ([cloud.reown.com](https://cloud.reown.com)) | `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `apps/web/.env`                                                                                                                           |
| PWA name and theme colour                                             | `apps/web/public/manifest.json`                                                                                                                                                     |
| Logo mark                                                             | `packages/uikit/src/components/Svg/Icons/Logo.tsx`, plus the PNGs in `apps/web/public/` and `apps/web/public/icons/`                                                                |
| Colour palette                                                        | `packages/uikit/src/tokens/colors.ts`                                                                                                                                               |
| Menu items                                                            | `apps/web/src/components/Menu/config/config.ts`                                                                                                                                     |
| Chains and RPC endpoints                                              | `apps/web/src/config/chains.ts`, `apps/web/src/config/nodes.ts`                                                                                                                     |
| Contract addresses                                                    | `packages/swap-sdk/src/constants.ts` (V2), `packages/v3-sdk/src/constants.ts` (V3), `packages/smart-router/evm/constants/exchange.ts`, `apps/web/src/config/constants/contracts.ts` |

### Token list

The default token list ships with the site. It isn't fetched at runtime.

- Tokens: `apps/web/src/config/constants/tokenLists/default.tokenlist.json` (mainnet and testnet in one list)
- Logos: `apps/web/public/images/tokens/<checksummed address>.<png|svg>`, referenced from each token's `logoURI`

To add a token, add an entry to the list and drop its logo into `public/images/tokens/`. If you also want users to see a hosted list, add its URL to `apps/web/src/config/constants/lists.ts`.

### Base tokens and stablecoins

Base tokens are the intermediaries the router tries when it looks for a path between two tokens. Stablecoins are used to show USD values. Both are set in code, in a few places. When a new stablecoin launches, or an existing one loses its backing, update all of these:

| Setting                                             | What it controls                              | Where                                                                                                                                                 | Mainnet today                   |
| --------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Token definition                                    | The token object the settings below refer to  | `packages/tokens/src/constants/zilliqa.ts` (`zilliqaTokens`), plus `USDC_ZIL`, `USDT_ZIL` and `KUSD_ZIL` in `packages/tokens/src/constants/common.ts` |                                 |
| `BASES_TO_CHECK_TRADES_AGAINST`                     | Intermediary tokens for multi-hop routes      | `packages/smart-router/evm/constants/exchange.ts`                                                                                                     | WZIL, zUSDC, zUSDT, kUSD        |
| `CUSTOM_BASES`                                      | Extra bases for specific tokens only          | `packages/smart-router/evm/constants/exchange.ts`                                                                                                     | TACO ↔ GUAC                     |
| `STABLE_COIN`                                       | Reference token for USD prices in the UI      | `packages/tokens/src/constants/common.ts`                                                                                                             | zUSDC                           |
| `usdGasTokensByChain`                               | Token used to price gas when comparing routes | `packages/smart-router/evm/constants/gasModel/index.ts`                                                                                               | zUSDT                           |
| `SUGGESTED_BASES`                                   | Quick-pick tokens in the token selector       | `apps/web/src/config/constants/exchange.ts`                                                                                                           | zUSDC, kUSD, pZIL, SEED, zUSDT  |
| `BASES_TO_TRACK_LIQUIDITY_FOR`, `PINNED_PAIRS`      | Pairs checked for a user's V2 liquidity       | `apps/web/src/config/constants/exchange.ts`                                                                                                           | WZIL with zUSDC, zUSDT and kUSD |
| `DEFAULT_INPUT_CURRENCY`, `DEFAULT_OUTPUT_CURRENCY` | Default pair on the swap page                 | `apps/web/src/config/constants/exchange.ts`                                                                                                           | ZIL → zUSDC                     |

Each base token adds candidate pools to every quote, which means more RPC reads. Keep the list to the few most liquid tokens. Testnet has its own entries next to the mainnet ones (`ChainId.ZILLIQA_TESTNET`).

> zUSDC and zUSDT are bridged through X-Bridge and are currently unbacked. USD values derived from them are unreliable. Replace them in the settings above once a backed stablecoin has liquidity.

### Pairs & Pools data

The `/stats` page reads from `/api/pools` (`apps/web/src/routes/api/pools.ts`), which runs on the Worker and builds the list in three steps:

1. V2 pairs come from the V2 factory.
2. V3 pools come from the V3 factory's `getPool` for every pair of known tokens and fee tiers, plus `PoolCreated` logs from Blockscout for tokens that aren't in the list. Pools created before the explorer's indexed history have no logs, which is why the factory lookup is needed.
3. Reserves and prices are read on-chain. Each token is priced in ZIL from its deepest ZIL pool, then converted to USD at the CoinGecko ZIL price.

The response is cached at the Cloudflare edge for an hour, and the CoinGecko price for six hours. Change `POOLS_TTL_SECONDS` and `PRICE_TTL_SECONDS` in that file to adjust. If CoinGecko is unavailable, TVL is shown in ZIL. Pairs with unbacked or exploited tokens (`apps/web/src/config/constants/unbackedTokens.ts`) are flagged on each row.

## Deploying

The app deploys to Cloudflare Workers with Wrangler:

```sh
bun run deploy
```

Set the worker name in `apps/web/wrangler.jsonc`. `NEXT_PUBLIC_*` variables are inlined at build time, so set them in the environment that runs the build.

## Repository layout

- `apps/web`: the application (routes, pages, views, state, config)
- `packages/*`: SDKs (`swap-sdk`, `v3-sdk`, `smart-router`), UI kit, wallet UI, tokens and shared utilities

## Credits and licence

Forked from the [PancakeSwap frontend](https://github.com/pancakeswap/pancake-frontend). Licensed under GPL-3.0, see [LICENSE](./LICENSE).
