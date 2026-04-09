"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <h1 className="text-5xl font-bold mb-2 text-white">401</h1>
        <h2 className="text-2xl font-semibold mb-4 text-slate-200">
          Unauthorized
        </h2>

        <p className="text-slate-400 mb-8">
          Sorry, you don't have permission to access this resource. Please log
          in or contact support if you believe this is a mistake.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Login
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            <Home className="w-4 h-4" />
            Home Page
          </Link>
        </div>

        <p className="text-slate-500 text-sm mt-8">
          If you think this is an error, please{" "}
          <a
            href="mailto:support@example.com"
            className="text-green-500 hover:text-green-400 underline"
          >
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}
