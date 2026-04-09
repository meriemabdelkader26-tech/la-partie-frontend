import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen pageBackgroundColor flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/loader.svg"
          alt="Loading..."
          width={70}
          height={70}
          className="animate-spin"
        />
        <p className="text-slate-400 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}
