interface Props {
  label: string;
}
const InfluencerProfileLanguageChip = (props: Props) => {
  const { label } = props;
  return (
    <span className="bg-green-400/20 text-green-300 px-3 py-1 rounded-full text-sm">
      {label}
    </span>
  );
};

export default InfluencerProfileLanguageChip;