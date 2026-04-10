"use client";
import { useQueryState } from "nuqs";
import { Card } from "@/components/ui/card";
import BackButton from "@/components/shared/BackButton";
import TextLinkButton from "@/components/shared/TextLinkButton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import RegisterFormBody from "./_components/RegisterFormBody";

const LoginPage = () => {
  const [role] = useQueryState("role") ?? "influencer";
  const isCompany = role === "company";

  return (
    <div className="min-h-screen pageBackgroundColor flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-slate-800 border-slate-700">
        <div className="p-8">
          <div className="mb-8">
            <BackButton />
            <div
              className={cn(
                "size-12 rounded-full flex items-center justify-center mb-4",
                isCompany ? "bg-emerald-500" : "bg-purple-500"
              )}
            >
              <span className="text-xl">{isCompany ? "🏢" : "✨"}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Join as {isCompany ? "Company" : "Influencer"}
            </h1>
            <p className="text-slate-400">
              {isCompany
                ? "Create your account and connect with the right influencers to boost your brand visibility and drive authentic engagement."
                : "Create your account and start collaborating with leading brands to grow your reach and unlock new partnership opportunities."}
            </p>
          </div>
          <RegisterFormBody />
          <Separator className="mt-6 mb-4 border-t border-slate-700 text-center" />
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

export default LoginPage;