"use client";
import { useTokenVerifyEmail } from "@/app/hooks/use-token-verify-email";
import BackButton from "@/components/shared/BackButton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import VerifyEmailForm from "./_components/VerifyEmailForm";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import { useMutation } from "@tanstack/react-query";

const TIMER_SECONDS = 120;

const RESEND_VERIFICATION_EMAIL_MUTATION = `
mutation ResendVerificationEmail($email: String!) {
  resendVerificationEmail(email: $email) {
    success
    message
  }
}
`;

const VERIFY_EMAIL_WITH_TOKEN_MUTATION = `
mutation VerifyEmailWithToken($token: String!, $email: String!) {
  verifyEmailWithToken(token: $token, email: $email) {
    success
    message
  }
}
`;

interface ResendMutationResult {
  resendVerificationEmail: {
    success: boolean;
    message: string;
  };
}

interface VerifyTokenMutationResult {
  verifyEmailWithToken: {
    success: boolean;
    message: string;
  };
}

const VerifyEmailPage = () => {
  const [email] = useQueryState("email");

  const token = useTokenVerifyEmail();
  const [resendTimer, setResendTimer] = useState<number>(TIMER_SECONDS);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // Mutation for automatic verification via email link
  const verifyTokenMutation = useMutation<
    VerifyTokenMutationResult,
    Error,
    { token: string; email: string }
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<VerifyTokenMutationResult>(
        VERIFY_EMAIL_WITH_TOKEN_MUTATION,
        data
      );
    },
    onSuccess: (data) => {
      if (data.verifyEmailWithToken.success) {
        toast.success(data.verifyEmailWithToken.message || "Email verified successfully!");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        toast.error(data.verifyEmailWithToken.message || "Verification failed");
        setIsVerifying(false);
      }
    },
    onError: (error) => {
      const errorInfo = handleGraphQLError(error);
      toast.error(errorInfo.message || "Failed to verify email");
      setIsVerifying(false);
    },
  });

  const resendMutation = useMutation<
    ResendMutationResult,
    Error,
    { email: string }
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<ResendMutationResult>(
        RESEND_VERIFICATION_EMAIL_MUTATION,
        data
      );
    },
    onSuccess: (data) => {
      if (data.resendVerificationEmail.success) {
        setResendTimer(TIMER_SECONDS);
        toast.success(data.resendVerificationEmail.message || "OTP has been resent to your email");
      } else {
        toast.error(data.resendVerificationEmail.message || "Failed to resend OTP");
      }
    },
    onError: (error) => {
      const errorInfo = handleGraphQLError(error);
      toast.error(errorInfo.message || "Failed to resend OTP. Please try again.");
    },
  });

  // Automatic verification when user arrives via email link
  useEffect(() => {
    if (token && token !== "pending" && email && !isVerifying) {
      setIsVerifying(true);
      verifyTokenMutation.mutate({ token, email });
    }
  }, [token, email]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendOtp = () => {
    if (!email) {
      toast.error("Email address is missing");
      return;
    }
    resendMutation.mutate({ email });
  };

  return (
    <div className="min-h-screen pageBackgroundColor flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-slate-800 border-slate-700">
        <div className="p-8">
          <div className="mb-8">
            <BackButton />
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Verify Your Email
              </h1>
              <p className="text-slate-400">
                We've sent a 6-digit code to{" "}
                <span className="text-green-400 font-medium">{email}</span>
              </p>
            </div>
          </div>

          {/* Show loading message during automatic verification */}
          {verifyTokenMutation.isPending ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
              <p className="text-white text-lg">Verifying your email...</p>
              <p className="text-slate-400 text-sm mt-2">Please wait a moment</p>
            </div>
          ) : token === "pending" ? (
            <>
              <VerifyEmailForm
                formatTime={formatTime}
                resendTimer={resendTimer}
                token={token}
                email={email!}
              />

              <Separator className="mt-6 mb-4 border-t border-slate-700 text-center" />

              <div className="flex items-center justify-center gap-2">
                <p className="text-slate-400 text-sm">Didn't receive the code?</p>
                <Button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendMutation.isPending || resendTimer > 0}
                  variant="ghost"
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendMutation.isPending
                    ? "Sending..."
                    : resendTimer > 0
                    ? `Resend in ${formatTime(resendTimer)}`
                    : "Resend OTP"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">Processing verification...</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
