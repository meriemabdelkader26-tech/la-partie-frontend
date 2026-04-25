import { useForm } from "react-hook-form";
import { ProfileCompanyFormData } from "../types";
import { CompanyDetailsSchema, CompanyDetailsType } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanySize, DomainActivity, EnterpriseType } from "../enums";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { companySizes, domainActivities, enterpriseTypes } from "../constants";
import { SelectItem } from "@/components/ui/select";
import SubmitButton from "@/components/shared/SubmitButton";
import { Users, Briefcase, Building, FileText, Sparkles, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  formData: ProfileCompanyFormData;
  onUpdate: (updates: Partial<ProfileCompanyFormData>) => void;
  onNext: () => void;
}

const MUTATION_REFINE_COMPANY_DESCRIPTION = `
mutation refineCompanyDescription($description: String!) {
  refineCompanyDescription(description: $description) {
    refinedDescription
  }
}
`;

const StepCompanyDetails = (props: Props) => {
  const { formData, onUpdate, onNext } = props;
  const form = useForm<CompanyDetailsType>({
    resolver: zodResolver(CompanyDetailsSchema),
    defaultValues: {
      size: formData.size || CompanySize.M,
      entrepriseType: formData.entrepriseType || EnterpriseType.PRIV,
      domainActivity: formData.domainActivity || DomainActivity.TECH,
      description: formData.description || "",
    },
  });

  const refineMutation = useMutation<any, Error, { description: string }>({
    mutationFn: async ({ description }) => {
      return await graphqlClient.request<any>(
        MUTATION_REFINE_COMPANY_DESCRIPTION,
        { description }
      );
    },
    onSuccess: (data) => {
      if (data?.refineCompanyDescription?.refinedDescription) {
        form.setValue("description", data.refineCompanyDescription.refinedDescription, { shouldValidate: true });
        toast.success("Description refined by AI!");
      }
    },
    onError: (error) => {
      toast.error("AI Refinement failed. Please try again.");
      console.error("Refinement error:", error);
    },
  });

  const handleAiRefine = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentDescription = form.getValues("description");
    if (!currentDescription || currentDescription.length < 10) {
      toast.error("Please enter at least some basic information about your company for the AI to refine.");
      return;
    }
    refineMutation.mutate({ description: currentDescription });
  };

  const onSubmit = (data: CompanyDetailsType) => {
    onUpdate({
      size: data.size,
      entrepriseType: data.entrepriseType,
      domainActivity: data.domainActivity,
      description: data.description,
    });
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fadeIn">
        <div className="space-y-6">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="size"
            label="Company Size"
            placeholder="Select your company size"
            icon={<Users className="w-4 h-4 text-gray-400" />}
            selectClassName="bg-gray-50/50 border-gray-100 rounded-xl h-12"
          >
            {companySizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="domainActivity"
            label="Domain Activity"
            placeholder="Select your domain activity"
            icon={<Briefcase className="w-4 h-4 text-gray-400" />}
            selectClassName="bg-gray-50/50 border-gray-100 rounded-xl h-12"
          >
            {domainActivities.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="entrepriseType"
            label="Enterprise Type"
            placeholder="Select your enterprise type"
            icon={<Building className="w-4 h-4 text-gray-400" />}
            selectClassName="bg-gray-50/50 border-gray-100 rounded-xl h-12"
          >
            {enterpriseTypes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </CustomFormField>

          <div className="relative group">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="description"
              label="Company Description"
              placeholder="Provide a brief description of your company (20-500 characters)"
              icon={<FileText className="w-4 h-4 text-gray-400" />}
              className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl min-h-[120px] pr-12"
            />
            <button
              onClick={handleAiRefine}
              disabled={refineMutation.isPending}
              title="Refine with AI"
              className={cn(
                "absolute right-3 top-[52px] -translate-y-1/2 p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm transition-all hover:bg-emerald-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-md",
                refineMutation.isPending && "animate-pulse"
              )}
            >
              {refineMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </button>
            {refineMutation.isPending && (
              <div className="absolute top-[75px] right-14 bg-white/90 backdrop-blur-sm border border-emerald-100 px-3 py-1 rounded-full shadow-lg animate-in fade-in slide-in-from-right-2 z-10">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">AI is thinking...</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 animate-fadeInUp delay-200">
          <SubmitButton 
            isLoading={false}
            className="w-full bg-black hover:bg-gray-900 text-white font-black h-14 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Continue
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default StepCompanyDetails;
