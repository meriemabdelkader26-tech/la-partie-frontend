import Link from "next/link";

interface Props {
  label: String;
  href: String;
  subLabel: String;
}

const TextLinkButton = ({ label, subLabel, href }: Props) => {
  return (
    <p className="text-slate-400 text-sm">
      {label}{" "}
      <Link
        href={`${href}`}
        className="text-primary hover:text-primary-dark font-medium"
      >
        {subLabel}
      </Link>
    </p>
  );
};

export default TextLinkButton;
