interface Props {
  label: string;
  value: string;
}

const InfluencerProfileStat = (props: Props) => {
  const { label, value } = props;
  return (
    <div className="bg-slate-700/50 rounded-lg p-4 text-center">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-green-400">{value}</p>
    </div>
  );
};

export default InfluencerProfileStat;