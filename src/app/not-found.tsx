import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchX, Home, LogIn } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl opacity-50 -z-10" />

      <div className="text-center max-w-lg mx-auto relative z-10">
        <div className="mb-10 relative">
          <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-sm rotate-3">
            <SearchX className="w-10 h-10 text-slate-900 -rotate-3" />
          </div>
          <h1 className="text-8xl md:text-9xl font-bold text-slate-900 tracking-tighter mb-4 font-sans leading-none">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            Page not found
          </h2>
          <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another coordinate.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-14 px-8 bg-slate-900 hover:bg-black text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-14 px-8 border border-gray-200 hover:border-slate-900 hover:bg-gray-50 text-slate-700 hover:text-slate-900 font-semibold rounded-xl transition-all active:scale-95 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Back to Login
            </Button>
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-gray-400 text-sm font-medium">
            If you believe this is an error, please <Link href="/contact" className="text-slate-900 hover:underline font-bold">contact support</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
