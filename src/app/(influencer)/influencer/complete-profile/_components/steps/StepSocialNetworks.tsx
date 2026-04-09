"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData } from "../types";
import { Step4SocialNetworksSchema, Step4SocialNetworksType } from "../schema";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { PlateformeEnum, FrequencePublicationEnum } from "@/app/enums";
import { SelectItem } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import SecondButton from "@/components/shared/SecondButton";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

export default function StepSocialNetworks({
  formData,
  onUpdate,
  onNext,
}: Props) {
  const form = useForm<Step4SocialNetworksType>({
    resolver: zodResolver(Step4SocialNetworksSchema),
    defaultValues: {
      reseauxSociaux: formData.reseauxSociaux?.length
        ? formData.reseauxSociaux.map((rs) => ({
            plateforme: (rs.plateforme as any) || PlateformeEnum.INSTAGRAM,
            urlProfil: rs.urlProfil || "",
            nombreAbonnes: rs.nombreAbonnes || "0",
            tauxEngagement: rs.tauxEngagement || "0",
            moyenneVues: rs.moyenneVues || "",
            moyenneLikes: rs.moyenneLikes || "",
            moyenneCommentaires: rs.moyenneCommentaires || "",
            frequencePublication:
              (rs.frequencePublication as any) ||
              FrequencePublicationEnum.QUOTIDIENNE,
          }))
        : [
            {
              plateforme: PlateformeEnum.INSTAGRAM,
              urlProfil: "",
              nombreAbonnes: "0",
              tauxEngagement: "0",
              moyenneVues: "",
              moyenneLikes: "",
              moyenneCommentaires: "",
              frequencePublication: FrequencePublicationEnum.QUOTIDIENNE,
            },
          ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "reseauxSociaux",
  });

  const onSubmit = (data: Step4SocialNetworksType) => {
    onUpdate({
      reseauxSociaux: data.reseauxSociaux.map((rs) => ({
        plateforme: rs.plateforme as string,
        urlProfil: rs.urlProfil,
        nombreAbonnes: rs.nombreAbonnes,
        tauxEngagement: rs.tauxEngagement,
        moyenneVues: rs.moyenneVues || "",
        moyenneLikes: rs.moyenneLikes || "",
        moyenneCommentaires: rs.moyenneCommentaires || "",
        frequencePublication: rs.frequencePublication as string,
      })),
    });
    onNext();
  };

  const addNetwork = () => {
    append({
      plateforme: PlateformeEnum.INSTAGRAM,
      urlProfil: "",
      nombreAbonnes: "0",
      tauxEngagement: "0",
      moyenneVues: "",
      moyenneLikes: "",
      moyenneCommentaires: "",
      frequencePublication: FrequencePublicationEnum.QUOTIDIENNE,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-slate-300">
            Add your social media platforms and their statistics
          </p>
          <SecondButton onClick={addNetwork} label="Add Network" />
        </div>

        {form.formState.errors.reseauxSociaux?.root && (
          <ErrorTriangle
            message={form.formState.errors.reseauxSociaux.root.message || ""}
          />
        )}

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 relative"
            >
              {/* Remove Button */}
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}

              <h3 className="text-white font-semibold mb-4">
                Social Network {index + 1}
              </h3>

              <div className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name={`reseauxSociaux.${index}.plateforme`}
                  label="Platform *"
                  placeholder="Select platform"
                >
                  {Object.values(PlateformeEnum).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.charAt(0).toUpperCase() +
                        value.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </CustomFormField>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name={`reseauxSociaux.${index}.urlProfil`}
                  label="Profile URL *"
                  placeholder="https://..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name={`reseauxSociaux.${index}.nombreAbonnes`}
                    label="Followers *"
                    placeholder="0"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name={`reseauxSociaux.${index}.tauxEngagement`}
                    label="Engagement Rate (%) *"
                    placeholder="0.0"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name={`reseauxSociaux.${index}.moyenneVues`}
                    label="Avg Views"
                    placeholder="0"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name={`reseauxSociaux.${index}.moyenneLikes`}
                    label="Avg Likes"
                    placeholder="0"
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name={`reseauxSociaux.${index}.moyenneCommentaires`}
                    label="Avg Comments"
                    placeholder="0"
                  />
                </div>

                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name={`reseauxSociaux.${index}.frequencePublication`}
                  label="Publication Frequency *"
                  placeholder="Select frequency"
                >
                  {Object.values(FrequencePublicationEnum).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.charAt(0).toUpperCase() +
                        value.slice(1).toLowerCase().replace("_", " ")}
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>
            </div>
          ))}
        </div>

        <SubmitButton isLoading={false}>Continue</SubmitButton>
      </form>
    </Form>
  );
}
