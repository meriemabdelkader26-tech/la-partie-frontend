"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}

const Preview = ({ value }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  return (
    <ReactQuill
      theme="bubble"
      value={value}
      readOnly
      className="prose prose-invert max-w-none text-slate-300 bg-slate-800/50 border-slate-700/50 rounded-md p-4"
    />
  );
};

export default Preview;
