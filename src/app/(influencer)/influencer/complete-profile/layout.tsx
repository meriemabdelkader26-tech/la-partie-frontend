interface Props {
  children: React.ReactNode;
}

const CompleteProfileLayout = ({ children }: Props) => {
  return <div className="min-h-screen w-full">{children}</div>;
};

export default CompleteProfileLayout;
