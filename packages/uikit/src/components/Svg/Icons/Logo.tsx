import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 32 32" color="primary" {...props}>
      <rect width="32" height="32" rx="9" />
      <path
        d="M9 12.5h13.5l-3.5-3.5M23 19.5H9.5l3.5 3.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Icon;
