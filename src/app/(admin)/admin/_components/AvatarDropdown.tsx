import React, { useState, useRef, useEffect } from "react";
// Remplacer ce hook par votre vrai hook/session store
import { useSessionStore } from "@/stores/use-session-store";

export default function AvatarDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Récupérer l'utilisateur connecté depuis le store/context
  const user = useSessionStore((s) => s.user);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-12 h-12 rounded-xl bg-background flex items-center justify-center border border-primary hover:shadow-lg focus:outline-none transition"
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="8" className="fill-background" />
          <circle cx="12" cy="10" r="4" className="stroke-primary" strokeWidth="2" />
          <path d="M6 18c0-2.21 3.134-4 6-4s6 1.79 6 4" className="stroke-primary" strokeWidth="2" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-popover border border-primary rounded-xl shadow-lg z-50 animate-fade-in">
          <div className="p-4 border-b border-primary dropdown-menu-header">
            <div className="text-xs font-bold mb-1">{user?.role || "USER"}</div>
            <div className="text-sm truncate">{user?.email || "user@email.com"}</div>
          </div>
          <div className="flex flex-col p-2">
            <button className="dropdown-menu-item text-left px-4 py-2 hover:bg-primary/10 rounded transition">Profile Settings</button>
            <button className="dropdown-menu-item text-left px-4 py-2 hover:bg-primary/10 rounded transition">Preferences</button>
            <button className="dropdown-menu-item text-left px-4 py-2 hover:bg-primary/10 rounded transition">Help & Support</button>
          </div>
          <div className="p-4">
            <button className="w-full py-2 rounded bg-primary text-background font-bold hover:bg-primary/80 transition">Logout</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
