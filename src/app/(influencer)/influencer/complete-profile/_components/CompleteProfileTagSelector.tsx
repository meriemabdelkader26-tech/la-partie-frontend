import { X } from "lucide-react";

interface Props {
  tag: string;
  onClick: () => void;
}

const CompleteProfileTagSelector = ({ tag, onClick }: Props) => {
  return (
    <span className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-3 py-1.5 rounded-full text-sm font-medium">
      {tag}
      <button
        type="button"
        onClick={onClick}
        className="hover:text-emerald-300 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
};

export default CompleteProfileTagSelector;
