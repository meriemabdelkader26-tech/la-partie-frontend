import { useForm } from "react-hook-form";
import { ProfileCompanyFormData } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicInfoSchema, BasicInfoType } from "../schema";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";

interface Props {
  formData: ProfileCompanyFormData;
  onUpdate: (updates: Partial<ProfileCompanyFormData>) => void;
  onNext: () => void;
}

const StepBasicInfo = (props: Props) => {
  const { formData, onUpdate, onNext } = props;

  const form = useForm<BasicInfoType>({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: {
      companyName: formData.companyName || "",
      matricule: formData.matricule || "",
      website: formData.website || "",
      contactEmail: formData.contactEmail || "",
    },
  });

  const onSubmit = (data: BasicInfoType) => {
    onUpdate({
      companyName: data.companyName,
      matricule: data.matricule,
      website: data.website,
      contactEmail: data.contactEmail,
    });
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="companyName"
          label="Company Name"
          placeholder="Enter your company name"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="matricule"
          label="Matricule"
          placeholder="Enter your company matricule"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="website"
          label="Website"
          placeholder="Enter your company website"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="contactEmail"
          label="Contact Email"
          placeholder="Enter your contact email"
        />

        <SubmitButton isLoading={false}>Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default StepBasicInfo;
