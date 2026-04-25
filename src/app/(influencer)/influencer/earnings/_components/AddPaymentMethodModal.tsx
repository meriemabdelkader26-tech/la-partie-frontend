"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Globe,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { ADD_PAYMENT_METHOD } from "@/lib/queries/offer-queries";
import { toast } from "sonner";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe (placeholder key if not provided)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51P4F2qRw1...");

const PAYMENT_TYPES = [
  {
    id: "Stripe",
    name: "Stripe Card",
    description: "Secure credit card payment via Stripe",
    icon: CreditCard,
    color: "blue",
  },
  {
    id: "PayPal",
    name: "PayPal",
    description: "Connect your PayPal account",
    icon: Globe,
    color: "indigo",
  },
  {
    id: "BankTransfer",
    name: "Bank Transfer",
    description: "Direct transfer to your bank account",
    icon: Building2,
    color: "emerald",
  },
];

const StripeForm = ({ onSuccess, onCancel, isPrimary }: { onSuccess: (data: any) => void; onCancel: () => void; isPrimary: boolean }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillTestCard = () => {
    const cardElement = elements?.getElement(CardElement);
    if (cardElement) {
      // Note: Stripe doesn't allow programmatically filling the card element for security
      // But we can show the test card number to the user to copy/paste
      toast.info("Test card number: 4242 4242 4242 4242", {
        description: "You can use any future date and any 3 digits for CVC.",
        duration: 5000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message || "An error occurred");
      setIsProcessing(false);
    } else {
      onSuccess({
        methodType: "Stripe",
        label: `Stripe Card (**** ${paymentMethod.card?.last4})`,
        details: paymentMethod.id,
        isPrimary,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="p-6 bg-gray-50 border-2 border-black/5 rounded-2xl">
        <Label className="text-sm font-bold text-black mb-3 block">Card Details</Label>
        <div className="p-4 bg-white border border-black/10 rounded-xl shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#000",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg border border-red-100">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={fillTestCard}
          className="w-full py-6 border-2 border-dashed border-black/10 hover:border-black/20 hover:bg-gray-50 text-gray-500 font-bold rounded-xl"
        >
          Use Test Credit Card (4242...)
        </Button>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1 py-6 font-bold rounded-xl"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="flex-[2] py-6 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-soft"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Save Card"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export const AddPaymentMethodModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState<"select" | "details">("select");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [details, setDetails] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (variables: any) => {
      const response = await graphqlClient.request<any>(ADD_PAYMENT_METHOD, variables);
      return response.addPaymentMethod;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Payment method added!", {
          description: "Your new payment method is ready to use.",
        });
        queryClient.invalidateQueries({ queryKey: ["myPaymentMethods"] });
        onClose();
        // Reset state
        setStep("select");
        setSelectedType(null);
        setLabel("");
        setDetails("");
        setIsPrimary(false);
      } else {
        toast.error("Error adding payment method", {
          description: data.message || "Something went wrong.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Error", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !label || !details) return;

    mutation.mutate({
      methodType: selectedType,
      label,
      details,
      isPrimary,
    });
  };

  const handleStripeSuccess = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-none rounded-[2rem] shadow-2xl">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-bold text-black tracking-tight">
            {step === "select" ? "Add Payment Method" : `Add ${selectedType}`}
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-medium mt-1">
            {step === "select"
              ? "Choose how you'd like to receive your earnings."
              : `Complete the details for your ${selectedType} account.`}
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 pt-0">
          <AnimatePresence mode="wait">
            {step === "select" ? (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4 py-4"
              >
                {PAYMENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id);
                      setStep("details");
                      if (type.id === "PayPal") setLabel("My PayPal");
                      if (type.id === "BankTransfer") setLabel("Bank Account");
                    }}
                    className="w-full flex items-center justify-between p-5 bg-gray-50 border-2 border-black/5 rounded-2xl hover:border-black/10 hover:bg-white hover:shadow-medium transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-sm border border-black/5",
                        "bg-white group-hover:bg-black"
                      )}>
                        <type.icon className="w-6 h-6 text-black group-hover:text-white transition-colors duration-300" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-black">{type.name}</h4>
                        <p className="text-gray-500 text-sm">{type.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="py-4"
              >
                {selectedType === "Stripe" ? (
                  <Elements stripe={stripePromise}>
                    <StripeForm 
                      onSuccess={handleStripeSuccess} 
                      onCancel={() => setStep("select")}
                      isPrimary={isPrimary}
                    />
                  </Elements>
                ) : (
                  <form onSubmit={handleManualSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="label" className="text-sm font-bold text-black ml-1">
                          Account Label
                        </Label>
                        <Input
                          id="label"
                          placeholder="e.g. Personal PayPal"
                          value={label}
                          onChange={(e) => setLabel(e.target.value)}
                          className="py-6 rounded-xl border-black/10 focus:border-black focus:ring-black transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="details" className="text-sm font-bold text-black ml-1">
                          {selectedType === "PayPal" ? "Email Address" : "Account Number / IBAN"}
                        </Label>
                        <Input
                          id="details"
                          placeholder={selectedType === "PayPal" ? "your@email.com" : "IBAN or Account Number"}
                          value={details}
                          onChange={(e) => setDetails(e.target.value)}
                          className="py-6 rounded-xl border-black/10 focus:border-black focus:ring-black transition-all"
                          required
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-2 ml-1">
                        <input
                          type="checkbox"
                          id="primary"
                          checked={isPrimary}
                          onChange={(e) => setIsPrimary(e.target.checked)}
                          className="w-4 h-4 rounded border-black/10 text-black focus:ring-black"
                        />
                        <Label htmlFor="primary" className="text-sm font-medium text-gray-600">
                          Set as primary payment method
                        </Label>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep("select")}
                        className="flex-1 py-6 font-bold rounded-xl"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="flex-[2] py-6 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-soft"
                      >
                        {mutation.isPending ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Method"
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
