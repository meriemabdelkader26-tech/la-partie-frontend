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
import { Mail, Loader2, Sparkles, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float delay-700"></div>
      </div>

      <Card className="w-full max-w-xl bg-white border-2 border-black/5 shadow-2xl rounded-3xl overflow-hidden relative z-10">
        <div className="p-10">
          {/* Back Button */}
          <div className="mb-8">
            <BackButton />
          </div>

          {/* Header Section */}
          <div className="mb-10 text-center">
            {/* Icon Container */}
            <div className="relative inline-block mb-6">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-black/10 rounded-full blur-2xl animate-pulse"></div>
              
              {/* Main Icon */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-black to-gray-800 rounded-2xl flex items-center justify-center shadow-large animate-scaleIn">
                <Mail className="w-12 h-12 text-white" />
              </div>

              {/* Floating Sparkles */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center animate-float">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-black rounded-full flex items-center justify-center animate-float delay-300">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-black mb-4 animate-fadeInUp">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-lg animate-fadeInUp delay-100">
              We've sent a 6-digit code to
            </p>
            <p className="text-black font-bold text-lg mt-2 animate-fadeInUp delay-200">
              {email}
            </p>
          </div>

          {/* Show loading message during automatic verification */}
          {verifyTokenMutation.isPending ? (
            <div className="text-center py-12 animate-fadeIn">
              <div className="relative inline-block mb-6">
                <Loader2 className="h-16 w-16 animate-spin text-black" />
                <div className="absolute inset-0 bg-black/10 rounded-full blur-2xl animate-pulse"></div>
              </div>
              <p className="text-black text-xl font-semibold mb-2">Verifying your email...</p>
              <p className="text-gray-600">Please wait a moment</p>
            </div>
          ) : token === "pending" ? (
            <>
              {/* OTP Form */}
              <div className="animate-fadeInUp delay-300">
                <VerifyEmailForm
                  formatTime={formatTime}
                  resendTimer={resendTimer}
                  token={token}
                  email={email!}
                />
              </div>

              {/* Separator */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-black/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500 font-medium">OR</span>
                </div>
              </div>

              {/* Resend Section */}
              <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-2xl border-2 border-black/5 animate-fadeInUp delay-400">
                <p className="text-gray-600 font-medium">Didn't receive the code?</p>
                <Button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendMutation.isPending || resendTimer > 0}
                  className="px-6 py-3 h-12 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:scale-100"
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
            <div className="text-center py-12 animate-fadeIn">
              <Loader2 className="h-12 w-12 animate-spin text-black mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Processing verification...</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-black/5 rounded-xl border border-black/10 animate-fadeInUp delay-500">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 leading-relaxed">
                For your security, this code will expire in {formatTime(resendTimer)}. Never share this code with anyone.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
