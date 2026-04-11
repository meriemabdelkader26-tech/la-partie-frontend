import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import Link from "next/link";

const HomeCTA = () => {
  return (
    <section className="py-20 px-4 border-t border-pastel-blue">
      <div className="max-w-4xl mx-auto text-center bg-linear-to-r from-pastel-green/20 to-pastel-green/10 border border-pastel-green/30 rounded-lg p-12">
        <h2 className="text-4xl font-bold text-pastel-dark-blue mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-pastel-blue mb-8">
          Join thousands of influencers and brands already using {APP_NAME}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?role=influencer">
            <Button
              size="lg"
              className="bg-pastel-green hover:bg-pastel-red text-pastel-dark-blue"
            >
              Create Account
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-pastel-green text-pastel-green hover:bg-pastel-blue bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;