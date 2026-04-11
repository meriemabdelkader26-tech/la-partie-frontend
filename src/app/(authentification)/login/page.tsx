"use client";
import { Card } from "@/components/ui/card";
import LoginFormBody from "./_components/LoginFormBody";
import BackButton from "@/components/shared/BackButton";
import TextLinkButton from "@/components/shared/TextLinkButton";
import { Separator } from "@/components/ui/separator";

const LoginPage = () => {
  return (
    <div className="min-h-screen pageBackgroundColor flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-pastel-red/10 border-pastel-red/20">
        <div className="p-8">
          <div className="mb-8">
            <BackButton />
            <div className="size-12 bg-pastel-red rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">🏢</span>
            </div>
            <h1 className="text-3xl font-bold text-pastel-dark-blue mb-2">Welcome Back</h1>
            <p className="text-pastel-red">Sign in to your company account</p>
          </div>
          <LoginFormBody />
          <Separator className="mt-6 mb-4 border-t border-pastel-red/20 text-center" />
          <TextLinkButton
            label="Don't have an account?"
            subLabel=" Create one"
            href="register?role=influencer"
          />
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
