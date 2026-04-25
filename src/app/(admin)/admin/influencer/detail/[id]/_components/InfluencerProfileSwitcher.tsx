import { cn } from "@/lib/utils";

interface Props {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

const InfluencerProfileSwitcher = (props: Props) => {
  const { label, active, onClick, count } = props;
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative pb-4 px-4 font-bold text-sm transition-all duration-300 flex items-center gap-2 group",
        active 
          ? "text-emerald-600" 
          : "text-gray-400 hover:text-gray-600"
      )}
    >
      <span className="uppercase tracking-widest">{label}</span>
      {count !== undefined && (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-black transition-colors",
          active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
        )}>
          {count}
        </span>
      )}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 rounded-t-full" />
      )}
    </button>
  );
};

export default InfluencerProfileSwitcher;