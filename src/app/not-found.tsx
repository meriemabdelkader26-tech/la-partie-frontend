import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-pastel-blue flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-pastel-red mb-4">404</h1>
          <h2 className="text-3xl font-bold text-pastel-dark-blue mb-2">Page Not Found</h2>
          <p className="text-pastel-blue text-lg">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="mb-12 flex justify-center">
          <div className="w-48 h-48 bg-linear-to-br from-pastel-red/10 to-pastel-green/10 rounded-full flex items-center justify-center border border-pastel-red/20">
            <div className="text-6xl">🔍</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-pastel-red hover:bg-pastel-green text-pastel-dark-blue">
              Go Home
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-pastel-red/30 text-pastel-red hover:bg-pastel-red/10 bg-transparent hover:text-pastel-red"
            >
              Back to Auth
            </Button>
          </Link>
        </div>

        <p className="text-pastel-dark-blue text-sm mt-8">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
