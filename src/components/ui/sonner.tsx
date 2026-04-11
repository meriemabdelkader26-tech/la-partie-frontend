"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-primary" />,
        info: <InfoIcon className="size-4 text-blue-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-rose-400" />,
        loading: (
          <Loader2Icon className="size-4 animate-spin text-primary" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "bg-slate-800 border-slate-700 text-white shadow-lg",
          title: "text-white font-semibold",
          description: "text-slate-300",
          actionButton: "bg-primary hover:bg-primary-dark text-white",
          cancelButton: "bg-slate-700 hover:bg-slate-600 text-white",
          closeButton:
            "bg-slate-700 hover:bg-slate-600 text-white border-slate-600",
          success: "border-primary/30 bg-slate-800",
          error: "border-rose-500/30 bg-slate-800",
          warning: "border-amber-500/30 bg-slate-800",
          info: "border-blue-500/30 bg-slate-800",
        },
      }}
      style={
        {
          "--normal-bg": "rgb(30, 41, 59)", // slate-800
          "--normal-text": "rgb(255, 255, 255)", // white
          "--normal-border": "rgb(51, 65, 85)", // slate-700
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
