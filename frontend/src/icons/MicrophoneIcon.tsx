import * as React from "react";
const MicrophoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 4.333a2.889 2.889 0 0 0-2.889 2.89v5.777a2.889 2.889 0 1 0 5.778 0V7.222A2.889 2.889 0 0 0 13 4.333Zm-1.444 2.89a1.444 1.444 0 0 1 2.888 0v5.777a1.444 1.444 0 0 1-2.888 0V7.222ZM7.944 12.278a.722.722 0 0 0-1.444 0V13a6.5 6.5 0 0 0 5.778 6.46v1.874h-2.167a.722.722 0 1 0 0 1.444h5.778a.722.722 0 1 0 0-1.444h-2.167V19.46A6.5 6.5 0 0 0 19.5 13v-.722a.722.722 0 0 0-1.444 0V13a5.056 5.056 0 0 1-10.112 0v-.722Z"
      fill="currentColor"
    />
  </svg>
);
export default MicrophoneIcon;
