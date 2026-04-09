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

interface Props {
  formData: ProfileCompanyFormData;
  onUpdate: (updates: Partial<ProfileCompanyFormData>) => void;
  onNext: () => void;
}

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="size"
          label="Company Size"
          placeholder="Select your company size"
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
        >
          {enterpriseTypes.map((size) => (
            <SelectItem key={size.value} value={size.value}>
              {size.label}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="description"
          label="Company Description"
          placeholder="Provide a brief description of your company (20-500 characters)"
        />

        <SubmitButton isLoading={false}>Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default StepCompanyDetails;
