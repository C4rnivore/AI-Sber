import React from "react";
import clsx from "clsx";
import { ButtonProps } from "@/utils/interfaces";

export default function Button({
  children,
  onClick,
  className,
  disabled,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx("flex font-normal hover:cursor-pointer", className)}
    >
      {children}
    </button>
  );
}
