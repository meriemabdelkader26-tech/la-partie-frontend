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
        "pb-3 px-2 font-semibold transition-colors",
        active ? "text-green-400 border-b-2 border-green-400" : "text-slate-400"
      )}
    >
      {label}
    </button>
  );
};

export default InfluencerProfileSwitcher;
