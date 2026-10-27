import { forwardRef } from "react";
import { styled } from "styled-components";
import { Link } from "@tanstack/react-router";

// react-router-dom LinkProps types
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: any;
  replace?: boolean;
  innerRef?: React.Ref<HTMLAnchorElement>;
  // next
  prefetch?: boolean;
}

const A = styled("a").withConfig({
  shouldForwardProp: (props) => !["hideSubNav", "supportChainIds"].includes(props),
})``;

/**
 * temporary solution for migrating React Router to Next.js Link
 */
const NextLinkFromReactRouter = forwardRef<any, LinkProps>(({ to, replace, children, prefetch, ...props }, ref) => (
  <A as={Link} ref={ref} to={to as string} replace={replace} preload={prefetch ? "intent" : false} {...props}>
    {children}
  </A>
));

export default NextLinkFromReactRouter;
