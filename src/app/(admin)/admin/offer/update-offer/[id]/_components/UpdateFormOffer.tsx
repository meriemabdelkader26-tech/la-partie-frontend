"use client";
import { Offer } from "@/app/types";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import SubmitButton from "@/components/shared/SubmitButton";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MutationOfferSchema } from "./schema";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OFFERS_KEY } from "@/constant";
import { useRouter } from "next/navigation";
import { SelectItem } from "@/components/ui/select";
import { OBJECTIVE_OPTIONS } from "../../../create/_components/data";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (offer) {
      form.reset({
        title: offer.title || "",
        objectif: offer.objectif || "",
        influencerNumber: offer.influencerNumber?.toString() || "1",
        minBudget: offer.minBudget || "",
        maxBudget: offer.maxBudget || "",
        startDate: offer.startDate ? new Date(offer.startDate) : undefined,
        endDate: offer.endDate ? new Date(offer.endDate) : undefined,
        requirement: offer.requirement || "",
      });
    }
  }, [offer, form]);

  const router = useRouter();
  const queryClient = useQueryClient();

  const refineMutation = useMutation<{ refineRequirements: { refinedRequirements: string } }, Error, { requirement: string }>({
    mutationFn: async ({ requirement }) => {
      return await graphqlClient.request<{ refineRequirements: { refinedRequirements: string } }>(
        MUTATION_REFINE_REQUIREMENTS,
        { requirements: requirement }
      );
    },
    onSuccess: (data) => {
      if (data?.refineRequirements?.refinedRequirements) {
        form.setValue("requirement", data.refineRequirements.refinedRequirements);
        toast.success("Requirements refined by AI!");
      }
    },
    onError: (error) => {
      toast.error("AI Refinement failed. Please try again.");
      console.error("Refinement error:", error);
    },
  });

  const handleAiRefine = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentRequirement = form.getValues("requirement");
    if (!currentRequirement || currentRequirement.length < 10) {
      toast.error("Please enter at least some basic requirements for the AI to refine.");
      return;
    }
    refineMutation.mutate({ requirement: currentRequirement });
  };

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <CustomFormField
              name="title"
              control={form.control as any}
              fieldType={FormFieldType.INPUT}
              label="Campaign Title"
              placeholder="Offer Title"
              className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
            />

            <CustomFormField
              name="objectif"
              control={form.control as any}
              fieldType={FormFieldType.SELECT}
              label="Primary Objective"
              placeholder="Select Objectif"
              selectClassName="bg-gray-50/50 border-gray-100 rounded-xl h-12"
            >
              {OBJECTIVE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </CustomFormField>

            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                name="minBudget"
                control={form.control as any}
                fieldType={FormFieldType.INPUT}
                label="Min Budget ($)"
                placeholder="0"
                className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
              />
              <CustomFormField
                name="maxBudget"
                control={form.control as any}
                fieldType={FormFieldType.INPUT}
                label="Max Budget ($)"
                placeholder="100000"
                className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <CustomFormField
                name="startDate"
                control={form.control as any}
                fieldType={FormFieldType.DATE_PICKER}
                label="Start Date"
                placeholder="Select start date"
              />
              <CustomFormField
                name="endDate"
                control={form.control as any}
                fieldType={FormFieldType.DATE_PICKER}
                label="End Date"
                placeholder="Select end date"
              />
            </div>

            <CustomFormField
              name="influencerNumber"
              control={form.control as any}
              fieldType={FormFieldType.INPUT}
              label="Number of Influencers"
              placeholder="e.g., 5"
              className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
            />

            <div className="relative group">
              <CustomFormField
                name="requirement"
                control={form.control as any}
                fieldType={FormFieldType.TEXTAREA}
                label="Requirements"
                placeholder="Offer Requirements"
                className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl min-h-[120px] pr-12"
              />
              <button
                onClick={handleAiRefine}
                disabled={refineMutation.isPending}
                title="Refine with AI"
                className={cn(
                  "absolute right-3 top-[52px] -translate-y-1/2 p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm transition-all hover:bg-emerald-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-md",
                  refineMutation.isPending && "animate-pulse"
                )}
              >
                {refineMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </button>
              {refineMutation.isPending && (
                <div className="absolute top-[75px] right-14 bg-white/90 backdrop-blur-sm border border-emerald-100 px-3 py-1 rounded-full shadow-lg animate-in fade-in slide-in-from-right-2">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">AI is thinking...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && <ErrorTriangle message={error} />}

        <div className="pt-6 flex flex-col md:flex-row items-center gap-4">
          <SubmitButton 
            isLoading={mutation.isPending} 
            loadingText="Updating Campaign..."
            className="w-full md:flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black h-14 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Update Campaign Offer
          </SubmitButton>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full md:w-auto px-10 h-14 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
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

const MUTATION_REFINE_REQUIREMENTS = `
mutation refineRequirements($requirements: String!) {
  refineRequirements(requirements: $requirements) {
    refinedRequirements
  }
}
`;
