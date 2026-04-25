import { X } from "lucide-react";

interface Props {
  tag: string;
  onClick: () => void;
}

const CompleteProfileTagSelector = ({ tag, onClick }: Props) => {
  return (
    <span className="inline-flex items-center gap-2 bg-black text-white border-2 border-black px-4 py-2 rounded-xl text-sm font-semibold group hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-soft hover:shadow-medium">
      {tag}
      <button
        type="button"
        onClick={onClick}
        className="w-5 h-5 flex items-center justify-center bg-white/20 rounded-full hover:bg-red-500 transition-colors group-hover:rotate-90 duration-300"
        title="Remove tag"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
};

export default CompleteProfileTagSelector;
