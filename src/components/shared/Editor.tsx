"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill-new"), { ssr: false }),
    []
  );

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        [{ align: [] }],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "blockquote",
    "code-block",
    "align",
    "link",
  ];

  return (
    <div className="bg-slate-700 border border-slate-600 rounded-md overflow-hidden">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="quill-editor"
        placeholder="Enter requirements..."
      />
      <style jsx global>{`
        .quill-editor .ql-toolbar {
          background: rgb(51 65 85);
          border: none;
          border-bottom: 1px solid rgb(71 85 105);
        }
        .quill-editor .ql-container {
          background: rgb(51 65 85);
          border: none;
          min-height: 180px;
          color: white;
        }
        .quill-editor .ql-editor {
          min-height: 180px;
          color: white;
        }
        .quill-editor .ql-editor.ql-blank::before {
          color: rgb(148 163 184);
        }
        .quill-editor .ql-stroke {
          stroke: white;
        }
        .quill-editor .ql-fill {
          fill: white;
        }
        .quill-editor .ql-picker-label {
          color: white;
        }
        .quill-editor .ql-picker-options {
          background: rgb(51 65 85);
          border: 1px solid rgb(71 85 105);
        }
        .quill-editor .ql-toolbar button:hover,
        .quill-editor .ql-toolbar button.ql-active {
          background: rgb(71 85 105);
        }
      `}</style>
    </div>
  );
}
