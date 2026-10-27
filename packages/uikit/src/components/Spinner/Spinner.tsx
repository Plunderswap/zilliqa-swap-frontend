import React from "react";
import styled, { keyframes } from "styled-components";
import { SpinnerProps } from "./types";

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Ring = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: ${({ $size }) => Math.max(3, Math.round($size / 12))}px solid ${({ theme }) => theme.colors.inputSecondary};
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: ${rotate} 0.9s linear infinite;
`;

const Spinner: React.FC<React.PropsWithChildren<SpinnerProps>> = ({ size = 300 }) => {
  return <Ring $size={size * 0.25} role="status" aria-label="Loading" />;
};

export default Spinner;
