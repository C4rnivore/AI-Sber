import * as React from "react";
const HeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.915 5.46c2.4-1.674 5.797-1.482 7.97.577 2.393 2.269 2.393 5.949 0 8.219l-7.595 7.199a.795.795 0 0 1-1.081 0l-7.595-7.2c-2.394-2.27-2.394-5.949 0-8.218 2.172-2.06 5.569-2.251 7.97-.576l.165.12zm2.667 10.217 3.575-3.389a.695.695 0 0 0-.002-1.021.795.795 0 0 0-1.08.001L15.5 14.657a.695.695 0 0 0 .001 1.021.795.795 0 0 0 1.08-.001"
      fill="currentColor"
    />
  </svg>
);
export default HeartIcon;
