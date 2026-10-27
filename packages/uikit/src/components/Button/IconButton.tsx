import { styled } from "styled-components";
import Button from "./Button";
import { BaseButtonProps } from "./types";

const IconButton = styled(Button)<BaseButtonProps>`
  padding: 2px;
  width: ${({ scale }) => (scale === "xs" ? "auto" : scale === "sm" ? "32px" : "48px")};
`;

export default IconButton;
