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
        exp,
        id: user.id,
        role: user.role,
        isStaff: user.isStaff,
      });

      Cookies.set(COOKIE_TOKEN_KEY, data.tokenAuth.token, cookieOptions(exp));

      Cookies.set(COOKIE_USER_ROLE_KEY, user.role, cookieOptions(exp));

      Cookies.set(
        COOKIE_REFRESH_TOKEN_KEY,
        data.tokenAuth.refreshExpiresIn.toString(),
        cookieOptions(data.tokenAuth.refreshExpiresIn)
      );

      toast.success("Successfully logged in!");

      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirect");

      if (redirectTo) {
        window.location.href = redirectTo;
      } else if (user.isStaff) {
        window.location.href = "/admin/category";
      } else if (user.role === "INFLUENCER") {
        if (!user.isVerifyByAdmin) {
          window.location.href = "/influencer/complete-profile";
        } else {
          window.location.href = "/influencer";
        }
      } else if (user.role === "COMPANY") {
        if (!user.isVerifyByAdmin) {
          window.location.href = "/company/complete-profile";
        } else {
          window.location.href = "/company";
        }
      } else {
        window.location.href = "/";
      }
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          name="email"
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="Email"
          placeholder="company@example.com"
        />

        <CustomFormField
          name="password"
          control={form.control}
          fieldType={FormFieldType.PASSWORD}
          label="Password"
          placeholder="••••••••"
        />

        {error && <ErrorTriangle message={error} />}

        <SubmitButton
          isLoading={mutation.isPending}
          loadingText="Signing in..."
        >
          Sign In
        </SubmitButton>
      </form>
    </Form>
  );
};

export default LoginFormBody;