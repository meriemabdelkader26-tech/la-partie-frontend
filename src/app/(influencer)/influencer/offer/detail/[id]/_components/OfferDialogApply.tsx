import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Offer } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import { toast } from "sonner";
import { useState } from "react";
import { ApplyOfferSchema } from "./schema";
import { CREATE_OFFER_APPLICATION_MUTATION } from "./mutation";

interface ApplyOfferMutationResult {
  createOfferApplication: {
    ok: boolean;
  };
}

interface Props {
  open: boolean;
  offer: Offer;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function OfferDialogApply(props: Props) {
  const queryClient = useQueryClient();
  const { open, onOpenChange, offer, onSuccess } = props;
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof ApplyOfferSchema>>({
    mode: "all",
    resolver: zodResolver(ApplyOfferSchema),
    defaultValues: {
      askingPrice: "",
      proposal: "",
    },
  });

  const mutation = useMutation<
    ApplyOfferMutationResult,
    Error,
    z.infer<typeof ApplyOfferSchema>
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<ApplyOfferMutationResult>(
        CREATE_OFFER_APPLICATION_MUTATION,
        {
          offerId: offer.id,
          askingPrice: Number(data.askingPrice),
          proposal: data.proposal,
        }
      );
    },
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({
        queryKey: ["influencerDetail", offer.id],
      });
      onSuccess?.();
    },
    onError: (error) => {
      setError(handleGraphQLError(error).message);
      toast.error("Failed to submit application");
    },
  });

  function onSubmit(values: z.infer<typeof ApplyOfferSchema>) {
    setError(null);
    const price = Number(values.askingPrice);
    if (price < Number(offer.minBudget) || price > Number(offer.maxBudget)) {
      setError(
        `Asking price must be between $${offer.minBudget} and $${offer.maxBudget}`
      );
      return;
    }
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            Submit Your Application
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Share your asking price and proposal for this campaign.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <div>
              <CustomFormField
                name="askingPrice"
                control={form.control}
                fieldType={FormFieldType.INPUT}
                label="Your Asking Price ($)"
                placeholder={`Between ${offer.minBudget} - ${offer.maxBudget}`}
              />
              <p className="text-xs text-slate-400 mt-2">
                Budget range: ${offer.minBudget} - ${offer.maxBudget}
              </p>
            </div>
            <div>
              <CustomFormField
                name="proposal"
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                label="Your Proposal"
                placeholder="Tell the brand why you're the perfect fit for this campaign. Share your creative ideas and how you'll deliver on the requirements."
              />
              <p className="text-xs text-slate-400 mt-2">
                {form.watch("proposal")?.length || 0}/500 characters
              </p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-xs font-semibold text-slate-400 mb-3 uppercase">
                Campaign Details
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Campaign</span>
                  <span className="text-white font-medium">{offer.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration</span>
                  <span className="text-white font-medium">
                    {offer.startDate} - {offer.endDate}
                  </span>
                </div>
              </div>
            </div>

            {error && <ErrorTriangle message={error} />}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-slate-600 text-slate-300 rounded-lg bg-transparent hover:bg-slate-800"
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <div className="flex-1">
                <SubmitButton
                  isLoading={mutation.isPending}
                  loadingText="Submitting..."
                >
                  Submit Application
                </SubmitButton>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
