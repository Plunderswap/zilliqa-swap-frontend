import { createRequire } from "node:module";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { mergeConfig } from "vite";

const require = createRequire(import.meta.url);

export default {
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  async viteFinal(config) {
    const finalConfig = mergeConfig(config, {
      resolve: {
        alias: {
          // @see https://github.com/nuxt/vite/issues/160#issuecomment-983080874
          crypto: require.resolve("rollup-plugin-node-builtins"),
        },
      },
      plugins: [vanillaExtractPlugin()],
    });

    return finalConfig;
  },
};
