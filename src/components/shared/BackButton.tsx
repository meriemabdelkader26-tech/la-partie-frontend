import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const BackButton = () => {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors group"
    >
      <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
        <ArrowLeft className="w-4 h-4" />
      </div>
      <span className="font-medium">Back</span>
    </Link>
  );
};

export default BackButton;
