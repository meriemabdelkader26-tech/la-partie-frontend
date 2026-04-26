import SubmitButton from "@/components/shared/SubmitButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { VerifyEmailSchema } from "./schema";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import Cookies from "js-cookie";
import { useSessionStore } from "@/stores/use-session-store";
import {
  COOKIE_REFRESH_TOKEN_KEY,
  COOKIE_TOKEN_KEY,
  COOKIE_USER_ROLE_KEY,
} from "@/config";

interface Props {
  email: string;
  token: string;
  resendTimer: number;
  formatTime: (seconds: number) => string;
}

const VERIFY_EMAIL_MUTATION = `
mutation VerifyEmailWithCode($code: String!, $email: String!) {
  verifyEmailWithCode(code: $code, email: $email) {
    success
    message
    token
    refreshToken
    user {
      id
      email
      name
      role
      isStaff
      isVerifyByAdmin
      isCompletedProfile
    }
  }
}
`;

interface VerifyMutationResult {
  verifyEmailWithCode: {
    success: boolean;
    message: string;
    token?: string;
    refreshToken?: string;
    user?: {
      id: string;
      email: string;
      name: string;
      role: string;
      isStaff: boolean;
      isVerifyByAdmin: boolean;
      isCompletedProfile: boolean;
    };
  };
}

const cookieOptions = (exp: number) => ({
  expires: new Date(exp * 1000),
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
});

const VerifyEmailForm = ({ formatTime, resendTimer, email }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const { setLoggedIn, setCurrentUser } = useSessionStore();

  const form = useForm<z.infer<typeof VerifyEmailSchema>>({
    resolver: zodResolver(VerifyEmailSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
      email: email,
    },
  });

  const mutation = useMutation<
    VerifyMutationResult,
    Error,
    z.infer<typeof VerifyEmailSchema>
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<VerifyMutationResult>(
        VERIFY_EMAIL_MUTATION,
        data
      );
    },
    onSuccess: (data) => {
      const result = data.verifyEmailWithCode;
      if (result.success && result.token && result.user) {
        const user = result.user;
        const token = result.token;
        const refreshToken = result.refreshToken;

        // Auto-login after verification
        setLoggedIn(true);
        setCurrentUser({
          email: user.email,
          name: user.name,
          exp: Math.floor(Date.now() / 1000) + 86400, // Placeholder expiry
          id: user.id,
          role: user.role,
          isStaff: user.isStaff,
          isVerifyByAdmin: user.isVerifyByAdmin,
          isCompletedProfile: user.isCompletedProfile,
        });

      // Set cookies
      const cookieOptions = {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      };

      Cookies.set(COOKIE_TOKEN_KEY, token, { ...cookieOptions });
      Cookies.set("access_token", token, { ...cookieOptions });
      Cookies.set(COOKIE_USER_ROLE_KEY, user.role, { ...cookieOptions });
      if (refreshToken) {
        Cookies.set(COOKIE_REFRESH_TOKEN_KEY, refreshToken, { ...cookieOptions });
        Cookies.set("refresh_token", refreshToken, { ...cookieOptions });
        localStorage.setItem("refreshToken", refreshToken);
      }

        toast.success("Email verified! Redirecting to profile completion...");
        
        // Redirection logic based on role
        const role = user.role.toLowerCase();
        setTimeout(() => {
          window.location.href = `/${role}/complete-profile`;
        }, 1500);
      } else {
        toast.success("Email verified successfully! You can now log in.");
        window.location.href = "/login";
      }
    },
    onError: (error) => {
      setError(handleGraphQLError(error).message);
    },
  });

  function onSubmit(data: z.infer<typeof VerifyEmailSchema>) {
    console.log("Form submitted with data:", data);
    setError(null);
    mutation.mutate({
      code: data.code.trim(),
      email: email.trim(),
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel className="block text-sm font-bold text-black mb-4 uppercase tracking-wider">
                One-Time Password
              </FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-14 h-16 text-2xl font-bold bg-white border-2 border-black/10 rounded-xl focus:border-black transition-colors" />
                    <InputOTPSlot index={1} className="w-14 h-16 text-2xl font-bold bg-white border-2 border-black/10 rounded-xl focus:border-black transition-colors" />
                  </InputOTPGroup>
                  <InputOTPSeparator>
                    <div className="w-3 h-1 bg-black/20 rounded-full"></div>
                  </InputOTPSeparator>
                  <InputOTPGroup>
                    <InputOTPSlot index={2} className="w-14 h-16 text-2xl font-bold bg-white border-2 border-black/10 rounded-xl focus:border-black transition-colors" />
                    <InputOTPSlot index={3} className="w-14 h-16 text-2xl font-bold bg-white border-2 border-black/10 rounded-xl focus:border-black transition-colors" />
                  </InputOTPGroup>
                  <InputOTPSeparator>
                    <div className="w-3 h-1 bg-black/20 rounded-full"></div>
                  </InputOTPSeparator>
                  <InputOTPGroup>
                    <InputOTPSlot index={4} className="w-14 h-16 text-2xl font-bold bg-white border-2 border-black/10 rounded-xl focus:border-black transition-colors" />
                    <InputOTPSlot index={5} className="w-14 h-16 text-2xl font-bold bg-white border-2 border-black/10 rounded-xl focus:border-black transition-colors" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="text-gray-500 text-sm mt-4 text-center max-w-md leading-relaxed">
                Please enter the 6-digit code sent to your email address.
              </FormDescription>
              {resendTimer > 0 && (
                <div className="mt-4 px-4 py-2 bg-black/5 rounded-lg border border-black/10">
                  <p className="text-sm text-gray-600">
                    Code expires in{" "}
                    <span className="text-black font-bold text-base">
                      {formatTime(resendTimer)}
                    </span>
                  </p>
                </div>
              )}
              <FormMessage className="text-red-500 font-medium text-sm mt-1" />
            </FormItem>
          )}
        />
        {error && (
          <div className="animate-fadeInUp">
            <ErrorTriangle message={error} />
          </div>
        )}
        <SubmitButton 
          isLoading={mutation.isPending}
          className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold text-base shadow-medium hover:shadow-large transition-all duration-300 hover:scale-[1.02] disabled:bg-gray-300 disabled:text-gray-500"
        >
          Verify Email
        </SubmitButton>
      </form>
    </Form>
  );
};

export default VerifyEmailForm;
