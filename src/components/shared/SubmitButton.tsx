import Image from "next/image";
import { Button } from "../ui/button";

interface ButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  loadingText?: string;
}

const SubmitButton = ({
  isLoading,
  disabled,
  className,
  children,
  loadingText,
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading || disabled}
      className={
        className ??
        "w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold text-base rounded-xl shadow-medium hover:shadow-large transition-all duration-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          {loadingText || "Loading..."}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
