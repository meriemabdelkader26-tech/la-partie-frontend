interface Props {
  label: string;
  value: string;
  className?: string;
  style?: React.CSSProperties;
}

const InfluencerProfileStat = (props: Props) => {
  const { label, value, className, style } = props;
  return (
    <div 
      className={`bg-gray-50 border border-black/5 rounded-2xl p-6 text-center shadow-inner-soft hover:bg-white hover:shadow-soft transition-all duration-300 group ${className || ""}`}
      style={style}
    >
      <p className="text-gray-400 font-black uppercase tracking-widest text-[10px] mb-2 group-hover:text-gray-500 transition-colors">{label}</p>
      <p className="text-3xl font-black text-black group-hover:scale-110 transition-transform duration-300">{value}</p>
    </div>
  );
};

export default InfluencerProfileStat;
