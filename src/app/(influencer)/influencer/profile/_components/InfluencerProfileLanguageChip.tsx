interface Props {
  label: string;
}
const InfluencerProfileLanguageChip = (props: Props) => {
  const { label } = props;
  return (
    <span className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-soft">
      {label}
    </span>
  );
};

export default InfluencerProfileLanguageChip;
