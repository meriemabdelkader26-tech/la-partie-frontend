"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.bubble.css";
import { cn } from "@/lib/utils";

interface PreviewProps {
  value: string;
  className?: string;
}

const Preview = ({ value, className }: PreviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );
  return (
    <ReactQuill
      theme="bubble"
      value={value}
      readOnly
      className={cn("max-w-none ql-editor-preview", className)}
    />
  );
};

export default Preview;
