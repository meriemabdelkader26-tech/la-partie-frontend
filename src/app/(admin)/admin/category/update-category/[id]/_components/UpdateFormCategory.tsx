"use client";

import React, { useState, useEffect } from "react";
import { Category } from "@/app/types";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import SubmitButton from "@/components/shared/SubmitButton";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORIES_KEY } from "@/constant";
import { useRouter } from "next/navigation";
import { MutationCategorySchema } from "./schema";

interface UpdateFormCategoryProps {
  categoryId: string;
  category: Category | null;
}

interface UpdateCategoryMutationResult {
  patchCategory: {
    category: Category;
  };
}

const UpdateFormCategory: React.FC<UpdateFormCategoryProps> = ({
  categoryId,
  category,
}) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof MutationCategorySchema>>({
    mode: "all",
    resolver: zodResolver(MutationCategorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      isActive: category?.isActive || false,
    },
  });

  // Update form values when category data is loaded
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
        isActive: !!category.isActive,
      });
    }
  }, [category, form]);

  const mutation = useMutation<
    UpdateCategoryMutationResult,
    Error,
    z.infer<typeof MutationCategorySchema>
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<UpdateCategoryMutationResult>(
        MUTATION_UPDATE_CATEGORY,
        { 
          id: categoryId,
          input: data 
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Category updated successfully!");
      router.push("/admin/category");
    },
    onError: (error) => {
      toast.error("Failed to update category.");
      setError(handleGraphQLError(error).message);
    },
  });

  function onSubmit(values: z.infer<typeof MutationCategorySchema>) {
    setError(null);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <CustomFormField
            name="name"
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Category Name"
            placeholder="e.g. Fashion, Technology, Lifestyle..."
            className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
          />

          <CustomFormField
            name="description"
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            label="Description"
            placeholder="Describe what this category is about..."
            className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl min-h-[120px]"
          />

          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 transition-all hover:bg-emerald-50/30 hover:border-emerald-100 group">
            <CustomFormField
              name="isActive"
              control={form.control}
              fieldType={FormFieldType.CHECKBOX}
              label="Active Status"
              description="If enabled, this category will be visible and selectable by users on the platform."
            />
          </div>
        </div>

        {error && <ErrorTriangle message={error} />}

        <div className="pt-4 flex items-center gap-3">
          <SubmitButton 
            isLoading={mutation.isPending} 
            loadingText="Updating..."
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            Update Category
          </SubmitButton>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 h-12 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateFormCategory;

const MUTATION_UPDATE_CATEGORY = `
mutation PatchCategory($id: ID!, $input: PatchCategoryInput!) {
  patchCategory(id: $id, input: $input) {
    category {
      created
      description
      id
      isActive
      modified
      name
    }
  }
}
`;
