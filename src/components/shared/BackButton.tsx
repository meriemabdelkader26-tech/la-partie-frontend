import Image from "next/image";
import Link from "next/link";

const BackButton = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
    >
      <Image
        src="/arrow.svg"
        alt="arrow-back"
        width={28}
        height={28}
        priority
      />
      <span>Back</span>
    </Link>
  );
};

export default BackButton;
