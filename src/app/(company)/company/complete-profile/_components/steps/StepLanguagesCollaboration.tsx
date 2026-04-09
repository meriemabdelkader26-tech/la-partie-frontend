import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { ProfileCompanyFormData } from "../types";
import CompleteProfileButtonSelector from "@/components/shared/CompleteProfileButtonSelector";
import { DISPONIBILITE_CHOICES, LANGUAGES } from "@/constant";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  LanguagesCollaborationSchema,
  LanguagesCollaborationType,
} from "../schema";
import { DisponibiliteEnum } from "@/app/enums";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import SubmitButton from "@/components/shared/SubmitButton";

interface Props {
  formData: ProfileCompanyFormData;
  onUpdate: (updates: Partial<ProfileCompanyFormData>) => void;
  onNext: () => void;
}

const StepLanguagesCollaboration = (props: Props) => {
  const { formData, onUpdate, onNext } = props;
  const form = useForm<LanguagesCollaborationType>({
    resolver: zodResolver(LanguagesCollaborationSchema),
    defaultValues: {
      langues: formData.langues || [],
      disponibiliteCollaboration:
        formData.disponibiliteCollaboration || DisponibiliteEnum.DISPONIBLE,
    },
  });

  const onSubmit = (data: LanguagesCollaborationType) => {
    onUpdate({
      langues: data.langues,
      disponibiliteCollaboration: data.disponibiliteCollaboration as any,
    });
    onNext();
  };

  const toggleLanguage = (lang: string) => {
    const currentLanguages = form.getValues("langues");
    const updated = currentLanguages.includes(lang)
      ? currentLanguages.filter((l) => l !== lang)
      : [...currentLanguages, lang];
    form.setValue("langues", updated, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <label className="text-lg font-semibold text-white mb-3 block">
            Languages *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((lang) => (
              <CompleteProfileButtonSelector
                key={lang}
                type={lang}
                onClick={() => toggleLanguage(lang)}
                isSelected={form.watch("langues").includes(lang)}
              />
            ))}
          </div>
          {form.formState.errors.langues && (
            <ErrorTriangle
              message={form.formState.errors.langues.message || ""}
            />
          )}
        </div>
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
        <SubmitButton>Next</SubmitButton>
      </form>
    </Form>
  );
};

export default StepLanguagesCollaboration;
