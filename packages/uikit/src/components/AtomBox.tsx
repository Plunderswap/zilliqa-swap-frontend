/* eslint-disable no-restricted-syntax */
import { Slot } from "@radix-ui/react-slot";
import clsx, { ClassValue } from "clsx";
import * as React from "react";
import styled from "styled-components";
import { Atoms } from "../css/atoms";
import { breakpointNames, breakpoints } from "../css/breakpoints";
import * as resetStyles from "../css/reset.css";
import { atomProperties, AtomProperty } from "../css/sprinkles";
import { vars } from "../css/vars";

type CSSObject = Record<string, any>;

type HTMLProperties<T = HTMLElement> = Omit<
  React.AllHTMLAttributes<T>,
  "as" | "className" | "color" | "height" | "width" | "size"
>;

type Props = Atoms &
  HTMLProperties & {
    as?: React.ElementType;
    asChild?: boolean;
    className?: ClassValue;
  };

const propertySet = new Set<string>(atomProperties);
const shorthands: Partial<Record<AtomProperty, string[]>> = {
  borderLeftRadius: ["borderBottomLeftRadius", "borderTopLeftRadius"],
  borderRightRadius: ["borderBottomRightRadius", "borderTopRightRadius"],
  borderTopRadius: ["borderTopLeftRadius", "borderTopRightRadius"],
  borderBottomRadius: ["borderBottomLeftRadius", "borderBottomRightRadius"],
  mt: ["marginTop"],
  mb: ["marginBottom"],
  m: ["margin"],
  ml: ["marginLeft"],
  mr: ["marginRight"],
  mx: ["marginLeft", "marginRight"],
  marginX: ["marginLeft", "marginRight"],
  my: ["marginTop", "marginBottom"],
  marginY: ["marginTop", "marginBottom"],
  pl: ["paddingLeft"],
  pr: ["paddingRight"],
  pt: ["paddingTop"],
  pb: ["paddingBottom"],
  p: ["padding"],
  px: ["paddingLeft", "paddingRight"],
  paddingX: ["paddingLeft", "paddingRight"],
  py: ["paddingTop", "paddingBottom"],
  paddingY: ["paddingTop", "paddingBottom"],
  size: ["width", "height"],
  bg: ["background"],
  bgc: ["backgroundColor"],
};

const colorProperties = new Set([
  "background",
  "backgroundColor",
  "borderBottomColor",
  "borderColor",
  "color",
  "outlineColor",
]);
const spaceProperties = new Set([
  "columnGap",
  "gap",
  "height",
  "margin",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "marginTop",
  "maxHeight",
  "maxWidth",
  "minHeight",
  "minWidth",
  "padding",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "rowGap",
  "width",
]);

function resolveValue(property: string, value: string | number) {
  if (colorProperties.has(property)) return vars.colors[value as keyof typeof vars.colors] ?? value;
  if (spaceProperties.has(property)) {
    if (value === "screenSm") return `${breakpoints.sm}px`;
    if (value === "screenMd") return `${breakpoints.md}px`;
    if (value === "screenLg") return `${breakpoints.lg}px`;
    if (value === "screenXl") return `${breakpoints.xl}px`;
    if (value === "sm") return vars.space["8px"];
    if (value === "md") return vars.space["12px"];
    if (value === "lg") return vars.space["24px"];
    return vars.space[value as keyof typeof vars.space] ?? value;
  }
  if (property === "fontSize") return vars.fontSizes[value as keyof typeof vars.fontSizes] ?? value;
  if (property === "boxShadow") return vars.shadows[value as keyof typeof vars.shadows] ?? value;
  if (property.toLowerCase().includes("radius")) return vars.radii[value as keyof typeof vars.radii] ?? value;
  if (property === "border" || property === "borderTop" || property === "borderBottom") {
    return value === "1" ? `1px solid ${vars.colors.cardBorder}` : value;
  }
  if (property === "flex") {
    return { 1: "1 1 0%", auto: "1 1 auto", initial: "0 1 auto", none: "none" }[value] ?? value;
  }
  if (property === "zIndex") {
    return { ribbon: 9, dropdown: 10, modal: 100 }[value] ?? value;
  }
  return value;
}

function applyValue(target: CSSObject, property: AtomProperty, value: string | number) {
  const properties = shorthands[property] ?? [property];
  properties.forEach((name) => {
    target[name] = resolveValue(name, value);
  });
}

function atomStyles(props: Partial<Record<AtomProperty, unknown>>) {
  const styles: CSSObject = {};

  Object.entries(props).forEach(([key, rawValue]) => {
    if (rawValue === undefined || rawValue === null) return;
    const property = key as AtomProperty;

    if (Array.isArray(rawValue)) {
      rawValue.forEach((value, index) => {
        if (value === undefined || value === null) return;
        if (index === 0) applyValue(styles, property, value);
        else {
          const breakpoint = breakpointNames[index];
          if (!breakpoint) return;
          const media = `@media screen and (min-width: ${breakpoints[breakpoint]}px)`;
          const mediaStyles = (styles[media] ?? {}) as CSSObject;
          applyValue(mediaStyles, property, value);
          styles[media] = mediaStyles;
        }
      });
      return;
    }

    if (typeof rawValue === "object") {
      Object.entries(rawValue as Record<string, string | number>).forEach(([condition, value]) => {
        if (condition === "xs") applyValue(styles, property, value);
        else if (condition in breakpoints) {
          const media = `@media screen and (min-width: ${breakpoints[condition as keyof typeof breakpoints]}px)`;
          const mediaStyles = (styles[media] ?? {}) as CSSObject;
          applyValue(mediaStyles, property, value);
          styles[media] = mediaStyles;
        } else {
          const selector = condition === "base" ? "&" : `&:${condition}`;
          const selectorStyles = (styles[selector] ?? {}) as CSSObject;
          applyValue(selectorStyles, property, value);
          styles[selector] = selectorStyles;
        }
      });
      return;
    }

    applyValue(styles, property, rawValue as string | number);
  });

  return styles;
}

const StyledAtomBox = styled.div.withConfig({
  shouldForwardProp: (property) => property !== "$atomProps" && property !== "$reset",
})<{ $atomProps: Partial<Record<AtomProperty, unknown>>; $reset?: string }>(({ $atomProps, $reset }) => ({
  ...resetStyles.base,
  ...($reset ? resetStyles.element[$reset] : undefined),
  ...atomStyles($atomProps),
}));

export const AtomBox = React.forwardRef<HTMLElement, Props>(
  ({ as = "div", asChild, className, reset, ...props }: Props, ref) => {
    const atomProps: Partial<Record<AtomProperty, unknown>> = {};
    const nativeProps: Record<string, unknown> = {};

    for (const key in props) {
      if (propertySet.has(key)) atomProps[key as AtomProperty] = props[key as keyof typeof props];
      else nativeProps[key] = props[key as keyof typeof props];
    }

    return (
      <StyledAtomBox
        as={asChild ? Slot : as}
        className={clsx(className)}
        $atomProps={atomProps}
        $reset={reset ?? (typeof as === "string" ? as : "div")}
        {...nativeProps}
        ref={ref as React.Ref<HTMLDivElement>}
      />
    );
  },
);

export type AtomBoxProps = Parameters<typeof AtomBox>[0];

AtomBox.displayName = "AtomBox";
