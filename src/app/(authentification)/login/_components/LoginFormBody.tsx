import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import Cookies from "js-cookie";
import SubmitButton from "@/components/shared/SubmitButton";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginFormSchema } from "./schema";
import { useState } from "react";
import { useSessionStore } from "@/stores/use-session-store";
import { useMutation } from "@tanstack/react-query";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import {
  COOKIE_REFRESH_TOKEN_KEY,
  COOKIE_TOKEN_KEY,
  COOKIE_USER_ROLE_KEY,
} from "@/config";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { toast } from "sonner";
import SuccessAnimation from "@/components/shared/SuccessAnimation";

const LOGIN_MUTATION = `
    mutation Login($email: String!, $password: String!) {
    tokenAuth(email: $email, password: $password) {
      payload
      refreshExpiresIn
      token
      user {
        id
        email
        emailVerified
        isBanned
        isVerifyByAdmin
        isStaff
        name
        role
        influencerProfile {
          id
          images {
            url
            isDefault
          }
        }
      }
    }
    }
`;

interface LoginMutationResult {
  tokenAuth: {
    token: string;
    payload: {
      email: string;
      exp: number;
      origIat: number;
    };
    refreshExpiresIn: number;
    user: {
      id: string;
      email: string;
      emailVerified: boolean;
      isBanned: boolean;
      isVerifyByAdmin: boolean;
      isStaff: boolean;
      name: string;
      role: string;
      influencerProfile?: {
        id: string;
        images?: {
          url: string;
          isDefault: boolean;
        }[];
      };
    };
  };
}

const cookieOptions = (exp: number) => ({
  expires: new Date(exp * 1000),
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
});

const LoginFormBody = () => {
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string>("/");
  const { setLoggedIn, setCurrentUser } = useSessionStore();
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    mode: "all",
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation<
    LoginMutationResult,
    Error,
    z.infer<typeof LoginFormSchema>
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<LoginMutationResult>(
        LOGIN_MUTATION,
        data
      );
    },
    onSuccess: (data) => {
      const { email, exp } = data.tokenAuth.payload;
      const user = data.tokenAuth.user;

      setLoggedIn(true);
      setCurrentUser({
        email,
        name: user.name,
        exp,
        id: user.id,
        role: user.role,
        isStaff: user.isStaff,
        profilePicture: user.influencerProfile?.images?.find(i => i.isDefault)?.url || user.influencerProfile?.images?.[0]?.url,
      });

      Cookies.set(COOKIE_TOKEN_KEY, data.tokenAuth.token, cookieOptions(exp));

      Cookies.set(COOKIE_USER_ROLE_KEY, user.role, cookieOptions(exp));

      Cookies.set(
        COOKIE_REFRESH_TOKEN_KEY,
        data.tokenAuth.refreshExpiresIn.toString(),
        cookieOptions(data.tokenAuth.refreshExpiresIn)
      );

      // Determine redirect URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirect");

      let targetUrl = "/";
      if (redirectTo) {
        targetUrl = redirectTo;
      } else if (user.isStaff) {
        targetUrl = "/admin/category";
      } else if (user.role === "INFLUENCER") {
        if (!user.isVerifyByAdmin) {
          targetUrl = "/influencer/complete-profile";
        } else {
          targetUrl = "/influencer";
        }
      } else if (user.role === "COMPANY") {
        if (!user.isVerifyByAdmin) {
          targetUrl = "/company/complete-profile";
        } else {
          targetUrl = "/company";
        }
      }

      // Show success animation, then redirect
      setRedirectUrl(targetUrl);
      setShowSuccess(true);
    },
    onError: (error) => {
      setError(handleGraphQLError(error).message);
      setLoggedIn(false);
      setCurrentUser(null);
    },
  });

  function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setError(null);
    mutation.mutate(values);
  }

  return (
    <>
      {/* Success Animation Overlay */}
      {showSuccess && (
        <SuccessAnimation
          message="Welcome Back!"
          onComplete={() => {
            window.location.href = redirectUrl;
          }}
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            <CustomFormField
              name="email"
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Email Address"
              placeholder="your.email@example.com"
            />

            <CustomFormField
              name="password"
              control={form.control}
              fieldType={FormFieldType.PASSWORD}
              label="Password"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="animate-fadeInUp">
              <ErrorTriangle message={error} />
            </div>
          )}

          <SubmitButton
            isLoading={mutation.isPending}
            loadingText="Signing in..."
            className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold text-base shadow-medium hover:shadow-large transition-all duration-300 hover:scale-[1.02] disabled:bg-gray-300 disabled:text-gray-500"
          >
            Sign In
          </SubmitButton>
        </form>
      </Form>
    </>
  );
};

export default LoginFormBody;