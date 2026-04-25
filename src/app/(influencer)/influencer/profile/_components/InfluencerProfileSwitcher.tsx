import { cn } from "@/lib/utils";

interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
}

const InfluencerProfileSwitcher = (props: Props) => {
  const { label, active, onClick } = props;
  return (
    <button
      onClick={onClick}
      className={cn(
        "pb-3 px-4 font-bold transition-all duration-300 relative",
        active 
          ? "text-black border-b-2 border-black" 
          : "text-gray-400 hover:text-gray-600 border-b-2 border-transparent"
      )}
    >
      {label}
    </button>
  );
};

export default InfluencerProfileSwitcher;
