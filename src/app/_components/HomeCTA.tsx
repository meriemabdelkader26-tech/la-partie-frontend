import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import Link from "next/link";

const HomeCTA = () => {
  return (
    <section className="py-20 px-4 border-t border-slate-700">
      <div className="max-w-4xl mx-auto text-center bg-linear-to-r from-green-600/20 to-green-500/10 border border-green-500/30 rounded-lg p-12">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-slate-300 mb-8">
          Join thousands of influencers and brands already using {APP_NAME}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?role=influencer">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Create Account
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-green-600 text-green-400 hover:bg-slate-700 bg-transparent"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;
