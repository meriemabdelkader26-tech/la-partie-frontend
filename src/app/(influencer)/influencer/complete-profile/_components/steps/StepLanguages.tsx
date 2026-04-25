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
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Languages Section */}
        <div className="animate-fadeInUp">
          <div className="mb-6">
            <label className="text-2xl font-bold text-black mb-2 block">
              Languages *
            </label>
            <p className="text-gray-600 text-base">
              Select the languages you can create content in
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {LANGUAGES.map((lang, index) => {
              const isSelected = form.watch("langues").includes(lang);
              return (
                <div
                  key={lang}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => toggleLanguage(lang)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2",
                      isSelected
                        ? "bg-black text-white border-black shadow-md scale-105"
                        : "bg-white text-gray-600 border-gray-200 hover:border-black/30 hover:bg-gray-50 hover:shadow-sm hover:text-black"
                    )}
                  >
                    {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                    {lang}
                  </button>
                </div>
              );
            })}
          </div>
          {form.formState.errors.langues && (
            <div className="mt-4">
              <ErrorTriangle
                message={form.formState.errors.langues.message || ""}
              />
            </div>
          )}
        </div>

        {/* Content Types Section */}
        <div className="animate-fadeInUp delay-200">
          <div className="mb-6">
            <label className="text-2xl font-bold text-black mb-2 block">
              Content Types *
            </label>
            <p className="text-gray-600 text-base">
              What type of content do you typically create?
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {CONTENT_TYPES.map((type, index) => {
              const isSelected = form.watch("typeContenu").includes(type);
              return (
                <div
                  key={type}
                  className="animate-fadeInUp delay-200"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => toggleContentType(type)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2",
                      isSelected
                        ? "bg-black text-white border-black shadow-md scale-105"
                        : "bg-white text-gray-600 border-gray-200 hover:border-black/30 hover:bg-gray-50 hover:shadow-sm hover:text-black"
                    )}
                  >
                    {isSelected && <Check className="w-4 h-4" strokeWidth={3} />}
                    {type}
                  </button>
                </div>
              );
            })}
          </div>
          {form.formState.errors.typeContenu && (
            <div className="mt-4">
              <ErrorTriangle
                message={form.formState.errors.typeContenu.message || ""}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 animate-fadeInUp delay-400">
          <SubmitButton isLoading={false}>Continue</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
