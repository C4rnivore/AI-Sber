import * as React from "react";
const SwitchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 18 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 18a1 1 0 0 1-.363.771 1 1 0 0 1-.071.078l-4.859 4.858a1 1 0 0 1-1.414-1.414L14.586 19H1a1 1 0 1 1 0-2h13.586l-3.293-3.293a1 1 0 0 1 1.414-1.414l4.859 4.858q.037.037.07.078c.223.183.364.46.364.771M0 6c0-.31.142-.588.364-.771q.033-.04.07-.078L5.293.293a1 1 0 1 1 1.414 1.414L3.414 5H17a1 1 0 1 1 0 2H3.414l3.293 3.293a1 1 0 1 1-1.414 1.414L.434 6.85a1 1 0 0 1-.07-.078A1 1 0 0 1 0 6"
      fill="currentColor"
    />
  </svg>
);
export default SwitchIcon;
