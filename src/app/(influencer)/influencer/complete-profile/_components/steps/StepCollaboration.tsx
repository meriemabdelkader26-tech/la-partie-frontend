"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { ProfileFormData } from "../types";
import { Step6CollaborationSchema, Step6CollaborationType } from "../schema";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";
import { TypeCollaborationEnum } from "@/app/enums";
import { SelectItem } from "@/components/ui/select";
import SecondButton from "@/components/shared/SecondButton";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

export default function StepCollaboration({
  formData,
  onUpdate,
  onNext,
}: Props) {
  const form = useForm<Step6CollaborationType>({
    resolver: zodResolver(Step6CollaborationSchema),
    defaultValues: {
      offresCollaboration:
        formData.offresCollaboration.length > 0
          ? formData.offresCollaboration.map((offer) => ({
              typeCollaboration: offer.typeCollaboration as any,
              tarifMinimum: offer.tarifMinimum,
              tarifMaximum: offer.tarifMaximum,
              conditions: offer.conditions || "",
            }))
          : [
              {
                typeCollaboration: TypeCollaborationEnum.POST as any,
                tarifMinimum: "",
                tarifMaximum: "",
                conditions: "",
              },
            ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "offresCollaboration",
  });

  const onSubmit = (data: Step6CollaborationType) => {
    const updatedData = {
      offresCollaboration: data.offresCollaboration.map((offer) => ({
        typeCollaboration: offer.typeCollaboration as string,
        tarifMinimum: offer.tarifMinimum,
        tarifMaximum: offer.tarifMaximum,
        conditions: offer.conditions || "",
      })),
    };
    onUpdate(updatedData);
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <p className="text-slate-300">
          Define your collaboration packages and pricing
        </p>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-slate-700 rounded-lg p-4 space-y-4 relative"
            >
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <h3 className="text-white font-semibold">Offer {index + 1}</h3>

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name={`offresCollaboration.${index}.typeCollaboration`}
                label="Collaboration Type"
                placeholder="Select type"
              >
                {Object.values(TypeCollaborationEnum).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </CustomFormField>

              <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name={`offresCollaboration.${index}.tarifMinimum`}
                  label="Minimum Rate ($)"
                  placeholder="100"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name={`offresCollaboration.${index}.tarifMaximum`}
                  label="Maximum Rate ($)"
                  placeholder="500"
                />
              </div>

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name={`offresCollaboration.${index}.conditions`}
                label="Conditions (Optional)"
                placeholder="Any special conditions or requirements..."
              />
            </div>
          ))}
        </div>

        <SecondButton
          label=" Add Another Offer"
          onClick={() =>
            append({
              typeCollaboration: TypeCollaborationEnum.POST as any,
              tarifMinimum: "",
              tarifMaximum: "",
              conditions: "",
            })
          }
        />

        <SubmitButton isLoading={form.formState.isSubmitting}>
          Continue
        </SubmitButton>
      </form>
    </Form>
  );
}
