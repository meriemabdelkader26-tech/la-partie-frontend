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
  }
}
`;

interface VerifyMutationResult {
  verifyEmailWithCode: {
    success: boolean;
    message: string;
  };
}

const VerifyEmailForm = ({ formatTime, resendTimer, email }: Props) => {
  const [error, setError] = useState<string | null>(null);

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
    onSuccess: () => {
      toast.success("Email verified successfully! You can now log in.");
      window.location.href = "/login";
    },
    onError: (error) => {
      setError(handleGraphQLError(error).message);
    },
  });

  function onSubmit(data: z.infer<typeof VerifyEmailSchema>) {
    console.log("Form submitted with data:", data);
    setError(null);
    mutation.mutate({
      code: data.code,
      email: email,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="flex flex-col items-center">
              <FormLabel className="block text-sm font-medium text-white mb-2">
                One-Time Password
              </FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription className="text-slate-400 text-sm mt-2 text-center">
                Please enter the one-time password sent to your email.
              </FormDescription>
              {resendTimer > 0 && (
                <p className="text-slate-500 text-sm mt-2">
                  Code expires in{" "}
                  <span className="text-white font-medium">
                    {formatTime(resendTimer)}
                  </span>
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <ErrorTriangle message={error} />}
        <SubmitButton isLoading={mutation.isPending}>Submit</SubmitButton>
      </form>
    </Form>
  );
};

export default VerifyEmailForm;
