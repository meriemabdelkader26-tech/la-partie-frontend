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
import { getRedirectAfterAuth } from "@/lib/auth-redirect";
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
        data.registerUser.message || "Registration successful! Redirecting..."
      );

      // Après enregistrement, rediriger vers complete-profile
      // Nouveau compte = profil incomplet par défaut
      const redirectPath = getRedirectAfterAuth({
        role: (variables.role || RoleEnum.INFLUENCER) as "COMPANY" | "INFLUENCER",
        isCompletedProfile: false, // Nouveau compte = profil incomplet
      });
      
      window.location.href = redirectPath;
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs
          defaultValue={role?.toLowerCase() || "influencer"}
          onValueChange={(value) => {
            const roleValue =
              value === "influencer" ? RoleEnum.INFLUENCER : RoleEnum.COMPANY;
            setRole(roleValue.toLowerCase());
            form.setValue("role", roleValue);
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="influencer">Influencer</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
          </TabsList>
        </Tabs>

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
          placeholder="••••••••"
        />

        <CustomFormField
          name="confirmPassword"
          control={form.control}
          fieldType={FormFieldType.PASSWORD}
          label="Confirm Password"
          placeholder="••••••••"
        />
        {error && <ErrorTriangle message={error} />}

        <SubmitButton
          isLoading={mutation.isPending}
          loadingText={
            isCompany ? "Creating company account..." : "Creating account..."
          }
        >
          {isCompany ? "Create Company Account" : "Create Account"}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterFormBody;
