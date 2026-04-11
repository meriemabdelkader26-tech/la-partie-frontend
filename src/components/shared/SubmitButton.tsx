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
        "w-full bg-primary hover:bg-primary-dark text-primary-foreground font-medium py-2 disabled:bg-primary/50"
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          {loadingText || "Loading..."}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
