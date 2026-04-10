import { Offer } from "@/app/types";
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
import { MutationOfferSchema } from "./schema";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OFFERS_KEY } from "@/constant";
import { useRouter } from "next/navigation";

interface Props {
  offerId: string;
  offer: Offer | null;
}

interface UpdateOfferMutationResult {
  offerUpdate: {
    offer: Offer;
  };
}

interface UpdateOfferInput {
  title: string;
  objectif: string;
  requirement: string;
  minBudget: string;
  maxBudget: string;
  startDate: string;
  endDate: string;
  influencerNumber: number;
}

const UpdateFormOffer = ({ offer, offerId }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof MutationOfferSchema>>({
    mode: "all",
    resolver: zodResolver(MutationOfferSchema),
    defaultValues: {
      title: offer?.title || "",
      objectif: offer?.objectif || "",
      influencerNumber: offer?.influencerNumber?.toString() || "1",
      minBudget: offer?.minBudget || "",
      maxBudget: offer?.maxBudget || "",
      startDate: offer?.startDate ? new Date(offer.startDate) : undefined,
      endDate: offer?.endDate ? new Date(offer.endDate) : undefined,
      requirement: offer?.requirement || "",
    },
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<
    UpdateOfferMutationResult,
    Error,
    UpdateOfferInput
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<UpdateOfferMutationResult>(
        MUTATION_UPDATE_OFFER,
        {
          id: offerId,
          input: data,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OFFERS_KEY] });
      toast.success("Successfully updated offer!");
      router.back();
    },
    onError: (error) => {
      toast.error("Failed to update offer.");
      setError(handleGraphQLError(error).message);
    },
  });

  function onSubmit(values: z.infer<typeof MutationOfferSchema>) {
    setError(null);
    const mutationData: UpdateOfferInput = {
      title: values.title,
      objectif: values.objectif,
      requirement: values.requirement,
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
          fieldType={FormFieldType.TEXTAREA}
          label="Objective"
          placeholder="Offer Objective"
        />

        <CustomFormField
          name="influencerNumber"
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="Number of Influencers"
          placeholder="e.g., 5"
        />

        <div className="grid grid-cols-2 gap-4">
          <CustomFormField
            name="minBudget"
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Minimum Budget"
            placeholder="e.g., 10000"
          />

          <CustomFormField
            name="maxBudget"
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Maximum Budget"
            placeholder="e.g., 50000"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          name="requirement"
          control={form.control}
          fieldType={FormFieldType.EDITOR}
          label="Requirements"
          placeholder="Offer Requirements"
        />

        {error && <ErrorTriangle message={error} />}

        <SubmitButton isLoading={mutation.isPending} loadingText="Updating...">
          Update Offer
        </SubmitButton>
      </form>
    </Form>
  );
};

export default UpdateFormOffer;

const MUTATION_UPDATE_OFFER = `
mutation offerUpdate($id: ID!, $input: PatchOfferInput!) {
  offerUpdate(id: $id, input: $input) {
    offer {
      id
      title
      objectif
      influencerNumber
      minBudget
      maxBudget
      startDate
      endDate
      requirement
      createdAt
      createdBy {
        id
        name
      }
    }
  }
}
`;