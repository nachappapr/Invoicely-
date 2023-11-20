import * as React from "react";
import type { SVGProps } from "react";
const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={103}
    height={103}
    fill="none"
    viewBox="0 0 103 103"
    {...props}
  >
    <path
      fill="#7C5DFA"
      d="M0 0h83c11.046 0 20 8.954 20 20v63c0 11.046-8.954 20-20 20H0z"
    />
    <mask
      id="a"
      width={103}
      height={103}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <path
        fill="#fff"
        d="M0 0h83c11.046 0 20 8.954 20 20v63c0 11.046-8.954 20-20 20H0z"
      />
    </mask>
    <g mask="url(#a)">
      <path
        fill="#9277FF"
        d="M103 52H20C8.954 52 0 60.954 0 72v63c0 11.046 8.954 20 20 20h83z"
      />
    </g>
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M42.694 33.292 52 52l9.306-18.708C67.665 36.641 72 43.314 72 51c0 11.046-8.954 20-20 20s-20-8.954-20-20c0-7.686 4.336-14.36 10.694-17.708"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgLogo;
