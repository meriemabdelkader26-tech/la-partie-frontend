import React from "react";

interface Props {
  icon: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isActive?: boolean;
}

export default function ToolbarButton({ icon, onClick, isActive }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-slate-600 text-white transition ${
        isActive ? "bg-slate-600" : ""
      }`}
    >
      {icon}
    </button>
  );
}
