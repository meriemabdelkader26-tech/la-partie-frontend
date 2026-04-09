"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData } from "../types";
import { Step2PersonalInfoSchema, Step2PersonalInfoType } from "../schema";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";
import { DisponibiliteEnum } from "@/app/enums";
import { SelectItem } from "@/components/ui/select";
import { DISPONIBILITE_CHOICES } from "@/constant";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

export default function StepPersonalInfo({
  formData,
  onUpdate,
  onNext,
}: Props) {
  const form = useForm<Step2PersonalInfoType>({
    resolver: zodResolver(Step2PersonalInfoSchema),
    defaultValues: {
      biography: formData.biography || "",
      localisation: formData.localisation || "",
      siteWeb: formData.siteWeb || "",
      disponibiliteCollaboration:
        (formData.disponibiliteCollaboration as any) ||
        DisponibiliteEnum.DISPONIBLE,
    },
  });

  const onSubmit = (data: Step2PersonalInfoType) => {
    onUpdate({
      biography: data.biography,
      localisation: data.localisation,
      siteWeb: data.siteWeb,
      disponibiliteCollaboration: data.disponibiliteCollaboration as any,
    });
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="biography"
          label="Biography"
          placeholder="Tell us about yourself (10-500 characters)"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="localisation"
          label="Location"
          placeholder="City, Country"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="siteWeb"
          label="Website (Optional)"
          placeholder="https://yourwebsite.com"
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="disponibiliteCollaboration"
          label="Availability for Collaborations"
          placeholder="Select your availability"
        >
          {DISPONIBILITE_CHOICES.map((e) => (
            <SelectItem key={e.value} value={e.value}>
              {e.label}
            </SelectItem>
          ))}
        </CustomFormField>

        <SubmitButton isLoading={false}>Continue</SubmitButton>
      </form>
    </Form>
  );
}
