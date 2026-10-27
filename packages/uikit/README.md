# @dex/uikit

React components, hooks and the light/dark theme used by the app.

Wrap your app in `UIKitProvider` with a theme:

```tsx
import { UIKitProvider, light } from "@dex/uikit";

<UIKitProvider theme={light}>{children}</UIKitProvider>;
```

Colours are defined in `src/tokens/colors.ts`. Run `bun run storybook` to browse the components.
