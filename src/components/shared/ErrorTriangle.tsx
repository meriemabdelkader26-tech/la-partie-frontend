import { TriangleAlert } from "lucide-react";

interface Props {
  message: string;
}

const ErrorTriangle = ({ message }: Props) => {
  return (
    <div className="flex items-center gap-2.5 text-rose-500 bg-rose-500/10 text-sm px-4 py-3 border border-rose-500 rounded-md">
      <TriangleAlert className="size-5" />
      <span className="text-md font-semibold">{message}</span>
    </div>
  );
};

export default ErrorTriangle;
