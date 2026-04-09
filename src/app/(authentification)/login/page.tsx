"use client";
import { Card } from "@/components/ui/card";
import LoginFormBody from "./_components/LoginFormBody";
import BackButton from "@/components/shared/BackButton";
import TextLinkButton from "@/components/shared/TextLinkButton";
import { Separator } from "@/components/ui/separator";

const LoginPage = () => {
  return (
    <div className="min-h-screen pageBackgroundColor flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-rose-100 border-rose-200">
        <div className="p-8">
          <div className="mb-8">
            <BackButton />
            <div className="size-12 bg-pink-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">🏢</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-rose-500">Sign in to your company account</p>
          </div>
          <LoginFormBody />
          <Separator className="mt-6 mb-4 border-t border-rose-200 text-center" />
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
