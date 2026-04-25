"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackButton from "@/components/shared/BackButton";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { graphqlClient } from "@/lib/graphql-client";
import { gql } from "graphql-request";

const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($email: String!, $newPassword: String!, $code: String) {
    resetPassword(email: $email, newPassword: $newPassword, code: $code) {
      success
      message
    }
  }
`;

const ResetPasswordRequestPage = () => {
  const router = useRouter();
  
  // Step 1: Request Code
  // Step 2: Enter Code & Reset Password
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  
  // Step 2 State
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res: any = await graphqlClient.request(FORGOT_PASSWORD_MUTATION, { email });
      if (!res.forgotPassword?.success) {
        throw new Error(res.forgotPassword?.message || "Error during request.");
      }
      setStep(2);
      toast.success(res.forgotPassword.message || "A reset code has been sent to your email.");
    } catch (err: any) {
      setError(err.response?.errors?.[0]?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirm || !code) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res: any = await graphqlClient.request(RESET_PASSWORD_MUTATION, {
        email,
        newPassword: password,
        code
      });

      if (!res.resetPassword?.success) {
        throw new Error(res.resetPassword?.message || "Error resetting password.");
      }
      
      toast.success(res.resetPassword.message || "Password reset successfully.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.errors?.[0]?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <Card className="w-full max-w-md p-8 relative z-10">
        <div className="mb-8">
          <BackButton />
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>
            <p className="text-gray-600 text-center mb-8">
              Enter your email to receive a password reset code.
            </p>

            <form onSubmit={handleRequestReset} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-black">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="h-12 bg-white border-2 border-black/10 text-black placeholder:text-gray-400 focus:border-black transition-all rounded-xl w-full"
                />
              </div>
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <Button 
                type="submit" 
                className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold text-base shadow-medium hover:shadow-large transition-all duration-300 hover:scale-[1.02] disabled:bg-gray-300 disabled:text-gray-500" 
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
            <p className="text-gray-600 text-center mb-8 text-sm">
              Enter the code sent to <span className="font-semibold text-black">{email}</span> and your new password.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-semibold text-black">Reset Code</label>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                  placeholder="Enter 6-digit code"
                  className="h-12 bg-white border-2 border-black/10 text-black placeholder:text-gray-400 focus:border-black transition-all rounded-xl w-full text-center tracking-widest font-mono text-lg"
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-semibold text-black">New Password</label>
                <Input
                  id="newPassword"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="h-12 bg-white border-2 border-black/10 text-black placeholder:text-gray-400 focus:border-black transition-all rounded-xl w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-black">Confirm Password</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  placeholder="Confirm new password"
                  className="h-12 bg-white border-2 border-black/10 text-black placeholder:text-gray-400 focus:border-black transition-all rounded-xl w-full"
                />
              </div>
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <Button 
                type="submit" 
                className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold text-base shadow-medium hover:shadow-large transition-all duration-300 hover:scale-[1.02] disabled:bg-gray-300 disabled:text-gray-500" 
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordRequestPage;