"use client";

import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function ToolbarButton({
  label,
  ...props
}: Props) {
  return (
    <button
      className="px-3 py-1 text-sm border rounded hover:bg-gray-100 transition"
      {...props}
    >
      {label}
    </button>
  );
}
