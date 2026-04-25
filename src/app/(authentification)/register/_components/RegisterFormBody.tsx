import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RegisterFormSchema } from "./schema";
import { useState } from "react";
import { useSessionStore } from "@/stores/use-session-store";
import { useMutation } from "@tanstack/react-query";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { toast } from "sonner";
import { RoleEnum } from "@/app/enums";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";

const REGISTER_MUTATION = `
  mutation RegisterUser($email: String!, $name: String!, $password: String!, $phoneNumber: String!, $role: UserRoleEnum!) {
    registerUser(
      email: $email
      name: $name
      password: $password
      phoneNumber: $phoneNumber
      role: $role
    ) {
      success
      message
    }
  }
`;

interface RegisterMutationResult {
  registerUser: {
    success: boolean;
    message: string;
  };
}

const RegisterFormBody = () => {
  const [role, setRole] = useQueryState("role");

  const [error, setError] = useState<string | null>(null);
  const { setLoggedIn, setCurrentUser } = useSessionStore();

  // Determine if user is registering as company
  const isCompany = role?.toLowerCase() === "company";

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    mode: "all",
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phoneNumber: "",
      role: RoleEnum.INFLUENCER,
    },
  });

  const mutation = useMutation<
    RegisterMutationResult,
    Error,
    z.infer<typeof RegisterFormSchema>
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<RegisterMutationResult>(
        REGISTER_MUTATION,
        data
      );
    },
    onSuccess: (data, variables) => {
      toast.success(
        data.registerUser.message ||
          "Registration successful! Please verify your email."
      );
      window.location.href = `/verify-email/pending?email=${encodeURIComponent(
        variables.email
      )}`;
    },
    onError: (error) => {
      setError(handleGraphQLError(error).message);
      setLoggedIn(false);
      setCurrentUser(null);
    },
  });

  function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    setError(null);
    console.log("Submitting registration form with values:", values);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Role Tabs */}
        <div className="mb-6">
          <Tabs
            defaultValue={role?.toLowerCase() || "influencer"}
            onValueChange={(value) => {
              const roleValue =
                value === "influencer" ? RoleEnum.INFLUENCER : RoleEnum.COMPANY;
              setRole(roleValue.toLowerCase());
              form.setValue("role", roleValue);
            }}
          >
            <TabsList className="grid w-full grid-cols-2 h-14 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger 
                value="influencer"
                className="rounded-lg font-semibold data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-medium transition-all"
              >
                Influencer
              </TabsTrigger>
              <TabsTrigger 
                value="company"
                className="rounded-lg font-semibold data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-medium transition-all"
              >
                Brand
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <CustomFormField
            name="name"
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label={isCompany ? "Company Name" : "Full Name"}
            placeholder={isCompany ? "Acme Corporation" : "John Doe"}
          />
          <CustomFormField
            name="email"
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label={isCompany ? "Company Email" : "Email Address"}
            placeholder={isCompany ? "contact@company.com" : "john@example.com"}
          />
          <CustomFormField
            name="phoneNumber"
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            label={isCompany ? "Company Phone Number" : "Phone Number"}
            placeholder={isCompany ? "+1 234 567 8900" : "+1 234 567 8900"}
          />
          <CustomFormField
            name="password"
            control={form.control}
            fieldType={FormFieldType.PASSWORD}
            label="Password"
            placeholder="Create a strong password"
          />

          <CustomFormField
            name="confirmPassword"
            control={form.control}
            fieldType={FormFieldType.PASSWORD}
            label="Confirm Password"
            placeholder="Re-enter your password"
          />
        </div>

        {error && (
          <div className="animate-fadeInUp">
            <ErrorTriangle message={error} />
          </div>
        )}

        {/* Submit Button */}
        <SubmitButton
          isLoading={mutation.isPending}
          loadingText={
            isCompany ? "Creating company account..." : "Creating account..."
          }
          className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-xl font-semibold text-base shadow-medium hover:shadow-large transition-all duration-300 hover:scale-[1.02] disabled:bg-gray-300 disabled:text-gray-500"
        >
          {isCompany ? "Create Company Account" : "Create Account"}
        </SubmitButton>

        {/* Terms & Privacy */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-black font-semibold hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-black font-semibold hover:underline">Privacy Policy</a>
        </p>
      </form>
    </Form>
  );
};

export default RegisterFormBody;