import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import Link from "next/link";

const HomeCTA = () => {
  return (
    <section className="py-20 px-4 border-t border-rose-200">
      <div className="max-w-4xl mx-auto text-center bg-linear-to-r from-pink-600/20 to-pink-500/10 border border-pink-500/30 rounded-lg p-12">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-rose-600 mb-8">
          Join thousands of influencers and brands already using {APP_NAME}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?role=influencer">
            <Button
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              Create Account
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-pink-600 text-pink-400 hover:bg-rose-200 bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
