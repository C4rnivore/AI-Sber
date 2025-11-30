import * as React from "react";
const HeartEmptyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.158 5.46a5.79 5.79 0 0 1 7.534.576 5.823 5.823 0 0 1 0 8.22l-7.18 7.199a.72.72 0 0 1-1.023 0l-7.18-7.2a5.823 5.823 0 0 1 0-8.219 5.79 5.79 0 0 1 7.535-.576l.157.12zm6.51 7.776a4.38 4.38 0 0 0 .001-6.18 4.346 4.346 0 0 0-6.157 0 .72.72 0 0 1-1.023 0 4.346 4.346 0 0 0-6.157 0 4.38 4.38 0 0 0 0 6.18L13 19.922zm-3.99 2.44 3.38-3.388a.722.722 0 1 0-1.022-1.02l-3.38 3.388a.722.722 0 0 0 1.022 1.02"
      fill="currentColor"
    />
  </svg>
);
export default HeartEmptyIcon;
