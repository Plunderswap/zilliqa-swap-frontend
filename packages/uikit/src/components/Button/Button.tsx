import clsx from "clsx";
import { cloneElement, ElementType, isValidElement } from "react";
import EXTERNAL_LINK_PROPS from "../../util/externalLinkProps";
import StyledButton from "./StyledButton";
import { ButtonProps, scales, variants } from "./types";

const Button = <E extends ElementType = "button">(props: ButtonProps<E>): React.JSX.Element => {
  const {
    startIcon,
    endIcon,
    external = false,
    className,
    isLoading = false,
    disabled = false,
    children,
    variant = variants.PRIMARY,
    scale = scales.MD,
    ...rest
  } = props;
  const internalProps = external ? EXTERNAL_LINK_PROPS : {};
  const isDisabled = isLoading || disabled;

  return (
    <StyledButton
      $isLoading={isLoading}
      className={clsx(className, {
        "button--loading": isLoading,
        "button--disabled": isDisabled && !isLoading,
      })}
      disabled={isDisabled}
      variant={variant}
      scale={scale}
      {...internalProps}
      {...rest}
    >
      <>
        {isValidElement(startIcon) &&
          cloneElement(startIcon, {
            // @ts-ignore
            mr: "0.5rem",
          })}
        {children}
        {isValidElement(endIcon) &&
          cloneElement(endIcon, {
            // @ts-ignore
            ml: "0.5rem",
          })}
      </>
    </StyledButton>
  );
};

export default Button;
