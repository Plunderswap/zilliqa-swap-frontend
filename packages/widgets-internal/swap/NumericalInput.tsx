import clsx from "clsx";
import { memo } from "react";
import styled from "styled-components";
import { useTranslation } from "@dex/localization";
import { escapeRegExp } from "@dex/utils/escapeRegExp";

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

export type NumericalInputProps = {
  value: string | number | undefined;
  onUserInput: (input: string) => void;
  fontSize?: string;
} & InputVariants &
  Omit<React.HTMLProps<HTMLInputElement>, "ref" | "onChange" | "as">;

interface InputVariants {
  error?: boolean;
  loading?: boolean;
  align?: "left" | "center" | "right";
}

const Input = styled.input<{ $error?: boolean; $loading?: boolean; $align?: InputVariants["align"] }>`
  width: 0;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: transparent;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0;
  appearance: textfield;
  color: ${({ theme, $error, $loading }) =>
    $error ? theme.colors.failure : $loading ? theme.colors.textDisabled : theme.colors.text};
  text-align: ${({ $align = "right" }) => $align};

  &::-webkit-search-decoration,
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }
`;

export const NumericalInput = memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  error,
  align,
  className,
  loading,
  ...rest
}: NumericalInputProps) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput);
    }
  };

  const { t } = useTranslation();

  return (
    <Input
      className={clsx(className)}
      $error={error}
      $align={align}
      $loading={loading}
      {...rest}
      value={value}
      onChange={(event) => {
        // replace commas with periods, because we exclusively uses period as the decimal separator
        enforcer(event.target.value.replace(/,/g, "."));
      }}
      // universal input options
      inputMode="decimal"
      title={t("Token Amount")}
      autoComplete="off"
      autoCorrect="off"
      // text-specific options
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      placeholder={placeholder || "0.0"}
      minLength={1}
      maxLength={79}
      spellCheck="false"
    />
  );
});
