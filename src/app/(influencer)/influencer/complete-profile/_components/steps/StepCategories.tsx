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

const FALLBACK_CATEGORIES: Category[] = [
  { id: "1", name: "Fashion & Style" },
  { id: "2", name: "Beauty & Makeup" },
  { id: "3", name: "Fitness & Health" },
  { id: "4", name: "Travel & Lifestyle" },
  { id: "5", name: "Food & Cooking" },
  { id: "6", name: "Technology & Gadgets" },
  { id: "7", name: "Gaming & Esports" },
  { id: "8", name: "Parenting & Family" },
];

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

  const toggleCategory = (categoryId: string) => {
    const categoryIdStr = String(categoryId);
    const currentCategories = form.getValues("selectedCategories");
    const updated = currentCategories.includes(categoryIdStr)
      ? currentCategories.filter((n) => n !== categoryIdStr)
      : [...currentCategories, categoryIdStr];
    console.log("toggleCategory - current:", currentCategories, "updated:", updated, "categoryId:", categoryIdStr);
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

  console.log("Categories received in StepCategories:", categories, isFetchingCategories);
  
  const displayCategories = (!isFetchingCategories && (!categories || categories.length === 0)) 
    ? FALLBACK_CATEGORIES 
    : categories;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Categories Section */}
        <div className="animate-fadeInUp">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">Categories *</h2>
            <p className="text-gray-600">
              Select 1-5 categories that apply to your content
            </p>
          </div>

          {isFetchingCategories ? (
            <div className="text-base text-gray-500 p-8 text-center">Loading categories...</div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {displayCategories?.map((category, index) => (
                <div
                  key={category.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CompleteProfileButtonSelector
                    type={category.name}
                    onClick={() => toggleCategory(String(category.id))}
                    isSelected={form
                      .watch("selectedCategories")
                      .includes(String(category.id))}
                  />
                </div>
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

        {/* Interests Section */}
        <div className="animate-fadeInUp delay-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black mb-2">
              Centers of Interest (Optional)
            </h2>
            <p className="text-gray-600">
              Add tags to describe your interests and passions
            </p>
          </div>

          {/* Tag Input */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type an interest and press Enter..."
              className="flex-1 h-12 bg-white border-2 border-black/10 text-black placeholder:text-gray-400 rounded-xl px-4 focus:outline-none focus:border-black transition-colors"
            />
            <Button
              type="button"
              onClick={addTag}
              className="h-12 px-6 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </div>

          {/* Tags Display */}
          <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-gray-50 rounded-xl border-2 border-black/5">
            {(form.watch("centresInteret") || []).map((tag, index) => (
              <div
                key={tag}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CompleteProfileTagSelector
                  tag={tag}
                  onClick={() => removeTag(tag)}
                />
              </div>
            ))}
            {(form.watch("centresInteret") || []).length === 0 && (
              <p className="text-gray-400 text-sm italic">
                No interests added yet
              </p>
            )}
          </div>

          {form.formState.errors.centresInteret && (
            <div className="mt-4">
              <ErrorTriangle
                message={form.formState.errors.centresInteret.message || ""}
              />
            </div>
          )}
        </div>

        <div className="animate-fadeInUp delay-300">
          <SubmitButton isLoading={false}>Continue</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
