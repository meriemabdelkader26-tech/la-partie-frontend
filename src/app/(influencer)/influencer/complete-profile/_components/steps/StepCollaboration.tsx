"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Sparkles, Loader2, Plus } from "lucide-react";
import { ProfileFormData } from "../types";
import { Step6CollaborationSchema, Step6CollaborationType } from "../schema";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";
import { TypeCollaborationEnum } from "@/app/enums";
import { SelectItem } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

const AIRefineButton = ({
  text,
  onRefine,
}: {
  text: string;
  onRefine: (refined: string) => void;
}) => {
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async () => {
    if (!text) return;
    setIsRefining(true);
    
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000/";
      const response = await fetch(`${baseUrl}api/refine-conditions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conditions: text }),
      });

      const data = await response.json();
      
      if (data.success && data.refined_conditions) {
        onRefine(data.refined_conditions);
      } else {
        console.error("Failed to refine conditions:", data.message);
      }
    } catch (error) {
      console.error("Error calling refine API:", error);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRefine}
      disabled={isRefining || !text}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-sm"
    >
      {isRefining ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Sparkles className="w-3.5 h-3.5" />
      )}
      {isRefining ? "Refining..." : "AI Refine"}
    </button>
  );
};

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="animate-fadeInUp">
          <h2 className="text-2xl font-bold text-black mb-2">
            Collaboration Offers
          </h2>
          <p className="text-gray-600">
            Define your collaboration packages and pricing
          </p>
        </div>

        {/* Offers */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-black/5 rounded-3xl p-8 space-y-6 relative shadow-soft hover:shadow-medium transition-shadow duration-300"
              >
                {/* Delete Button */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-full hover:bg-red-100 hover:scale-110 transition-all duration-300 shadow-soft"
                    title="Remove offer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {/* Offer Header */}
                <div className="flex items-center gap-3 pb-4 border-b-2 border-black/5">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-medium">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-black">
                    Offer {index + 1}
                  </h3>
                </div>

                {/* Form Fields */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="relative">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name={`offresCollaboration.${index}.conditions`}
                    label="Conditions (Optional)"
                    placeholder="Any special conditions or requirements..."
                    labelChildren={
                      <AIRefineButton
                        text={form.watch(`offresCollaboration.${index}.conditions`)}
                        onRefine={(refined) => {
                          form.setValue(
                            `offresCollaboration.${index}.conditions`,
                            refined,
                            { shouldValidate: true }
                          );
                        }}
                      />
                    }
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Action Buttons Footer */}
        <div className="animate-fadeInUp delay-200 pt-6 border-t-2 border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <Button
            type="button"
            onClick={() =>
              append({
                typeCollaboration: TypeCollaborationEnum.POST as any,
                tarifMinimum: "",
                tarifMaximum: "",
                conditions: "",
              })
            }
            className="w-full md:w-auto h-14 px-8 bg-white hover:bg-gray-50 text-black border-2 border-black/10 hover:border-black/30 font-bold rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Another Offer
          </Button>

          <div className="w-full md:w-auto">
            <SubmitButton 
              isLoading={form.formState.isSubmitting}
              className="w-full md:w-auto h-14 px-12 bg-black hover:bg-gray-800 text-white font-bold rounded-2xl shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105"
            >
              Continue
            </SubmitButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
