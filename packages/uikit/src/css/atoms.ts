import { Sprinkles } from "./sprinkles";

export type Atoms = Sprinkles & {
  reset?: keyof React.JSX.IntrinsicElements;
};
