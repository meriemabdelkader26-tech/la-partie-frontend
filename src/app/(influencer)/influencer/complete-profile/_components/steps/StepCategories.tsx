"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData } from "../types";
import { Step5NichesSchema, Step5NichesType } from "../schema";
import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/shared/SubmitButton";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/app/types";
import CompleteProfileButtonSelector from "../../../../../../components/shared/CompleteProfileButtonSelector";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import CompleteProfileTagSelector from "../CompleteProfileTagSelector";

interface Props {
  isFetchingCategories?: boolean;
  categories?: Category[];
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

export default function StepCategories({
  formData,
  onUpdate,
  onNext,
  categories,
  isFetchingCategories,
}: Props) {
  const [tagInput, setTagInput] = useState("");

  const form = useForm<Step5NichesType>({
    resolver: zodResolver(Step5NichesSchema),
    defaultValues: {
      selectedCategories: formData.selectedCategories || [],
      centresInteret: formData.centresInteret || [],
    },
  });

  const onSubmit = (data: Step5NichesType) => {
    onUpdate({
      selectedCategories: data.selectedCategories,
      centresInteret: data.centresInteret,
    });
    onNext();
  };

  const toggleCategory = (category: string) => {
    const currentCategories = form.getValues("selectedCategories");
    const updated = currentCategories.includes(category)
      ? currentCategories.filter((n) => n !== category)
      : [...currentCategories, category];
    form.setValue("selectedCategories", updated, { shouldValidate: true });
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    const currentTags = form.getValues("centresInteret") || [];
    if (!currentTags.includes(trimmedTag)) {
      form.setValue("centresInteret", [...currentTags, trimmedTag], {
        shouldValidate: true,
      });
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("centresInteret") || [];
    form.setValue(
      "centresInteret",
      currentTags.filter((tag) => tag !== tagToRemove),
      { shouldValidate: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-slate-300">
          Select 1-5 categories that apply to your content
        </p>

        <div>
          <label className="text-white font-medium mb-3 block">
            Categories *
          </label>

          {isFetchingCategories ? (
            <div className="text-sm text-slate-400">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories?.map((category) => (
                <CompleteProfileButtonSelector
                  key={category.id}
                  type={category.name}
                  onClick={() => toggleCategory(category.id)}
                  isSelected={form
                    .watch("selectedCategories")
                    .includes(category.id)}
                />
              ))}
            </div>
          )}
          {form.formState.errors.selectedCategories && (
            <div className="mt-5">
              <ErrorTriangle
                message={form.formState.errors.selectedCategories.message || ""}
              />
            </div>
          )}
        </div>

        <div>
          <label className="text-white font-medium mb-2 block">
            Centers of Interest (Optional)
          </label>
          <p className="text-sm text-slate-400 mb-3">
            Add tags to describe your interests
          </p>

          {/* Tag Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type an interest and press Enter..."
              className="flex-1 h-9 bg-slate-700 border border-slate-600 text-white placeholder:text-slate-500 rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <Button
              type="button"
              onClick={addTag}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(form.watch("centresInteret") || []).map((tag, index) => (
              <CompleteProfileTagSelector
                key={tag}
                tag={tag}
                onClick={() => removeTag(tag)}
              />
            ))}
          </div>

          {(form.watch("centresInteret") || []).length === 0 && (
            <p className="text-slate-500 text-sm mt-2 italic">
              No interests added yet
            </p>
          )}

          {form.formState.errors.centresInteret && (
            <div className="mt-2">
              <ErrorTriangle
                message={form.formState.errors.centresInteret.message || ""}
              />
            </div>
          )}
        </div>

        <SubmitButton isLoading={false}>Continue</SubmitButton>
      </form>
    </Form>
  );
}
