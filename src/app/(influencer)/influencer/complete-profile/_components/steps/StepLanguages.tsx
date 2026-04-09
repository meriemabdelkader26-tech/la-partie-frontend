"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData } from "../types";
import { Step3LanguagesSchema, Step3LanguagesType } from "../schema";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/shared/SubmitButton";
import { CONTENT_TYPES } from "../constants";
import CompleteProfileButtonSelector from "../../../../../../components/shared/CompleteProfileButtonSelector";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { LANGUAGES } from "@/constant";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

export default function StepLanguages({ formData, onUpdate, onNext }: Props) {
  const form = useForm<Step3LanguagesType>({
    resolver: zodResolver(Step3LanguagesSchema),
    defaultValues: {
      langues: formData.langues || [],
      typeContenu: formData.typeContenu || [],
    },
  });

  const onSubmit = (data: Step3LanguagesType) => {
    onUpdate({
      langues: data.langues,
      typeContenu: data.typeContenu,
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

  const toggleContentType = (type: string) => {
    const currentTypes = form.getValues("typeContenu");
    const updated = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    form.setValue("typeContenu", updated, { shouldValidate: true });
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

        <div>
          <label className="text-lg font-semibold text-white mb-3 block">
            Content Types *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CONTENT_TYPES.map((type) => (
              <CompleteProfileButtonSelector
                key={type}
                type={type}
                onClick={() => toggleContentType(type)}
                isSelected={form.watch("typeContenu").includes(type)}
              />
            ))}
          </div>
          {form.formState.errors.typeContenu && (
            <ErrorTriangle
              message={form.formState.errors.typeContenu.message || ""}
            />
          )}
        </div>

        <SubmitButton isLoading={false}>Continue</SubmitButton>
      </form>
    </Form>
  );
}
