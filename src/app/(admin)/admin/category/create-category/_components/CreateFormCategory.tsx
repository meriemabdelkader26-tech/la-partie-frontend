"use client";

import { Category } from "@/app/types";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import SubmitButton from "@/components/shared/SubmitButton";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORIES_KEY } from "@/constant";
import { useRouter } from "next/navigation";
import { MutationCategorySchema } from "../../update-category/[id]/_components/schema";

interface CreateCategoryMutationResult {
  createCategory: {
    category: Category;
  };
}

const CreateFormCategory = () => {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof MutationCategorySchema>>({
    mode: "all",
    resolver: zodResolver(MutationCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: false,
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateCategoryMutationResult,
    Error,
    z.infer<typeof MutationCategorySchema>
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<CreateCategoryMutationResult>(
        MUTATION_CREATE_CATEGORY,
        { input: data }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Successfully created category!");
      router.back();
    },
    onError: (error) => {
      toast.error("Failed to created category status.");
      setError(handleGraphQLError(error).message);
    },
  });

  function onSubmit(values: z.infer<typeof MutationCategorySchema>) {
    setError(null);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          name="name"
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="Name"
          placeholder="Category Name"
        />

        <CustomFormField
          name="description"
          control={form.control}
          fieldType={FormFieldType.TEXTAREA}
          label="Description"
          placeholder="Category Description"
        />

        <CustomFormField
          name="isActive"
          control={form.control}
          fieldType={FormFieldType.CHECKBOX}
          label="Active (Category will be visible to users)"
        />

        {error && <ErrorTriangle message={error} />}

        <SubmitButton isLoading={mutation.isPending} loadingText="Creating...">
          Create Category
        </SubmitButton>
      </form>
    </Form>
  );
};

export default CreateFormCategory;

const MUTATION_CREATE_CATEGORY = `
mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    category {
      created
      description
      id
      modified
      isActive
      name
    }
  }
}
`;