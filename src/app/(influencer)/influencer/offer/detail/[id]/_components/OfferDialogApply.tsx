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
      <DialogContent className="bg-white border-none max-w-2xl rounded-3xl shadow-2xl p-0 overflow-hidden">
        <div className="p-8 border-b-2 border-black/5">
          <DialogHeader>
            <DialogTitle className="text-black text-2xl font-black tracking-tight">
              Submit Your Application
            </DialogTitle>
            <DialogDescription className="text-gray-500 font-medium mt-2">
              Share your asking price and proposal for this campaign.
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 space-y-8"
          >
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <CustomFormField
                  name="askingPrice"
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Your Asking Price ($)"
                  placeholder={`e.g. ${offer.minBudget}`}
                  inputClassName="bg-gray-50 border-2 border-black/5 rounded-xl text-black font-bold h-12 focus:bg-white focus:border-black/20"
                />
                <div className="px-4 py-2 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">
                    Budget range
                  </p>
                  <p className="text-sm font-bold text-green-700">${offer.minBudget} - ${offer.maxBudget}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-6 border border-black/5">
                  <p className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">
                    Campaign Details
                  </p>
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Campaign</span>
                      <span className="text-black font-bold text-sm truncate">{offer.title}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Duration</span>
                      <span className="text-black font-bold text-sm">
                        {offer.startDate} - {offer.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <CustomFormField
                name="proposal"
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                label="Your Proposal"
                placeholder="Tell the brand why you're the perfect fit for this campaign..."
                inputClassName="bg-gray-50 border-2 border-black/5 rounded-xl text-black font-medium min-h-[150px] focus:bg-white focus:border-black/20 resize-none"
              />
              <div className="flex justify-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {form.watch("proposal")?.length || 0} / 500 characters
                </span>
              </div>
            </div>

            {error && <ErrorTriangle message={error} />}

            <div className="flex gap-4 pt-4 border-t-2 border-black/5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="px-8 py-6 text-gray-500 hover:text-black font-bold rounded-xl"
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <div className="flex-1">
                <SubmitButton
                  isLoading={mutation.isPending}
                  loadingText="Submitting..."
                  className="w-full bg-black hover:bg-gray-800 text-white rounded-xl py-6 font-bold shadow-soft transition-all duration-300"
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
