"use client";
import { Category } from "@/app/types";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OFFERS_KEY } from "@/constant";
import { useRouter } from "next/navigation";
import { MutationOfferSchema } from "./schema";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import { OBJECTIVE_OPTIONS } from "./data";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import SubmitButton from "@/components/shared/SubmitButton";

interface CreateOfferMutationResult {
  createOffer: {
    offer: Category;
  };
}

interface CreateOfferInput {
  title: string;
  objectif: string;
  requirement: string;
  minBudget: string;
  maxBudget: string;
  startDate: string;
  endDate: string;
  influencerNumber: number;
}

const CreateFormOffer = () => {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof MutationOfferSchema>>({
    mode: "all",
    resolver: zodResolver(MutationOfferSchema),
    defaultValues: {
      title: "",
      objectif: "",
      requirements: "",
      minBudget: "",
      maxBudget: "",
      startDate: undefined,
      endDate: undefined,
      influencerNumber: "0",
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateOfferMutationResult,
    Error,
    CreateOfferInput
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<CreateOfferMutationResult>(
        MUTATION_CREATE_OFFER,
        { input: data }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_KEY] });
      toast.success("Successfully created offer.");
      router.back();
    },
    onError: (error) => {
      toast.error("Failed to created offer.");
      setError(handleGraphQLError(error).message);
    },
  });

  function onSubmit(values: z.infer<typeof MutationOfferSchema>) {
    setError(null);
    const mutationData: CreateOfferInput = {
      title: values.title,
      objectif: values.objectif,
      requirement: values.requirements,
      minBudget: values.minBudget,
      maxBudget: values.maxBudget,
      startDate: values.startDate.toISOString().split("T")[0],
      endDate: values.endDate.toISOString().split("T")[0],
      influencerNumber: parseInt(values.influencerNumber, 10),
    };
    mutation.mutate(mutationData);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          name="title"
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="Title"
          placeholder="Offer Title"
        />

        <CustomFormField
          name="objectif"
          control={form.control}
          fieldType={FormFieldType.SELECT}
          label="Objectif"
          placeholder="Select Objectif"
        >
          {OBJECTIVE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </CustomFormField>
        <div className="flex flex-col md:flex-row gap-4">
          <CustomFormField
            name="minBudget"
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Min Budget ($)"
            placeholder="0"
          />
          <CustomFormField
            name="maxBudget"
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Max Budget ($)"
            placeholder="+100000"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <CustomFormField
            name="startDate"
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            label="Start Date"
            placeholder="Select start date"
          />
          <CustomFormField
            name="endDate"
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            label="End Date"
            placeholder="Select end date"
          />
        </div>

        <CustomFormField
          name="influencerNumber"
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="Influencer Number"
          placeholder="0"
        />

        <CustomFormField
          name="requirements"
          control={form.control}
          fieldType={FormFieldType.EDITOR}
          label="Requirements"
          placeholder="Offer Requirements"
        />

        {error && <ErrorTriangle message={error} />}

        <SubmitButton isLoading={mutation.isPending} loadingText="Creating...">
          Create Offer
        </SubmitButton>
      </form>
    </Form>
  );
};

export default CreateFormOffer;

const MUTATION_CREATE_OFFER = `
mutation createOffer($input: CreateOfferInput!) {
  offerCreate(input: $input) {
    offer {
      id
      createdAt
      influencerNumber
      maxBudget
      minBudget
      objectif
      requirement
      startDate
      title
    }
  }
}
`;