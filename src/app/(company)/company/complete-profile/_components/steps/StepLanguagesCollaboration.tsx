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
import { Languages, Briefcase } from "lucide-react";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 animate-fadeIn">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Languages className="w-5 h-5 text-gray-400" />
              <label className="text-lg font-black text-gray-900 uppercase tracking-wider">
                Languages <span className="text-emerald-500">*</span>
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
              <div className="mt-4">
                <ErrorTriangle
                  message={form.formState.errors.langues.message || ""}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-gray-400" />
              <label className="text-lg font-black text-gray-900 uppercase tracking-wider">
                Collaboration Status
              </label>
            </div>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="disponibiliteCollaboration"
              label=""
              placeholder="Select your availability"
              selectClassName="bg-gray-50/50 border-gray-100 rounded-2xl h-14"
            >
              {DISPONIBILITE_CHOICES.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${e.color} shadow-sm`}></span>
                    <span className="font-bold text-gray-700">{e.label}</span>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
        </div>

        <div className="pt-4 animate-fadeInUp delay-200">
          <SubmitButton 
            className="w-full bg-black hover:bg-gray-900 text-white font-black h-14 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Continue
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default StepLanguagesCollaboration;
