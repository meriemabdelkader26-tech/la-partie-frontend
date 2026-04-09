"use client";
import { useQueryState } from "nuqs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/shared/BackButton";
import TextLinkButton from "@/components/shared/TextLinkButton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import RegisterFormBody from "./_components/RegisterFormBody";

const RegisterPage = () => {
  const [role, setRole] = useQueryState("role");
  const isCompany = role === "company";

  // Si role n'est pas défini, afficher la sélection du rôle
  if (!role) {
    return (
      <div className="min-h-screen pageBackgroundColor flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-rose-100 border-rose-200">
          <div className="p-8">
            <div className="mb-8">
              <BackButton />
              <h1 className="text-3xl font-bold text-white mb-4">
                Create Your Account
              </h1>
              <p className="text-rose-600 text-lg mb-8">
                Choose your account type to get started
              </p>
            </div>

            {/* Role Selection Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Influencer Option */}
              <button
                onClick={() => setRole("influencer")}
                className="group relative overflow-hidden rounded-lg border-2 border-rose-300 hover:border-pink-500 transition-all hover:shadow-lg p-8 text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-5xl mb-4">✨</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    I'm an Influencer
                  </h2>
                  <p className="text-rose-600">
                    Grow your reach, collaborate with brands, and monetize your content
                  </p>
                </div>
              </button>

              {/* Company Option */}
              <button
                onClick={() => setRole("company")}
                className="group relative overflow-hidden rounded-lg border-2 border-rose-300 hover:border-pink-500 transition-all hover:shadow-lg p-8 text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-5xl mb-4">🏢</div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    I'm a Brand
                  </h2>
                  <p className="text-rose-600">
                    Find the perfect influencers for your campaigns and grow your brand
                  </p>
                </div>
              </button>
            </div>

            <Separator className="mt-8 mb-4 border-t border-rose-200" />
            <TextLinkButton
              label="Already have an account?"
              subLabel=" Sign in"
              href="/login"
            />
          </div>
        </Card>
      </div>
    );
  }

  // Afficher le formulaire d'inscription après sélection du rôle
  return (
    <div className="min-h-screen pageBackgroundColor flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-rose-100 border-rose-200">
        <div className="p-8">
          <div className="mb-8">
            <BackButton />
            <div
              className={cn(
                "size-12 rounded-full flex items-center justify-center mb-4",
                isCompany ? "bg-pink-500" : "bg-purple-500"
              )}
            >
              <span className="text-xl">{isCompany ? "🏢" : "✨"}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Join as {isCompany ? "Brand" : "Influencer"}
            </h1>
            <p className="text-rose-500">
              {isCompany
                ? "Create your account and connect with the right influencers to boost your brand visibility and drive authentic engagement."
                : "Create your account and start collaborating with leading brands to grow your reach and unlock new partnership opportunities."}
            </p>
          </div>
          <RegisterFormBody />
          <Separator className="mt-6 mb-4 border-t border-rose-200 text-center" />
          <TextLinkButton
            label="Already have an account?"
            subLabel=" Sign in"
            href="/login"
          />
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
