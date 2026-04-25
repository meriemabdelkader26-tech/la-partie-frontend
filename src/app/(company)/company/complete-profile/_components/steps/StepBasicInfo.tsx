import { useForm } from "react-hook-form";
import { ProfileCompanyFormData } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicInfoSchema, BasicInfoType } from "../schema";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";
import { Building2, Hash, Globe, Mail, Loader2, CheckCircle2, XCircle, Globe2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { NEXT_PUBLIC_BASE_URL } from "@/config";

interface Props {
  formData: ProfileCompanyFormData;
  onUpdate: (updates: Partial<ProfileCompanyFormData>) => void;
  onNext: () => void;
}

const StepBasicInfo = (props: Props) => {
  const { formData, onUpdate, onNext } = props;
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);
  const [urlStatus, setUrlStatus] = useState<"idle" | "valid" | "invalid">("idle");

  const form = useForm<BasicInfoType>({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: {
      companyName: formData.companyName || "",
      matricule: formData.matricule || "",
      website: formData.website || "",
      contactEmail: formData.contactEmail || "",
    },
  });

  const handleCheckUrl = async () => {
    const currentUrl = form.getValues("website");
    if (!currentUrl) {
      toast.error("Please enter a website URL first.");
      return;
    }

    setIsCheckingUrl(true);
    setUrlStatus("idle");
    try {
      const response = await axios.post(`${NEXT_PUBLIC_BASE_URL}api/check-url/`, { url: currentUrl });
      if (response.data && response.data.success) {
        setUrlStatus("valid");
        toast.success("Website is reachable!");
      } else {
        setUrlStatus("invalid");
        toast.error(response.data?.message || "Website is not reachable.");
      }
    } catch (error) {
      console.error("Error checking URL:", error);
      setUrlStatus("invalid");
      toast.error("An error occurred while verifying the website.");
    } finally {
      setIsCheckingUrl(false);
    }
  };

  const onSubmit = (data: BasicInfoType) => {
    onUpdate({
      companyName: data.companyName,
      matricule: data.matricule,
      website: data.website,
      contactEmail: data.contactEmail,
    });
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-fadeIn">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="companyName"
              label="Company Name"
              placeholder="e.g. Acme Corp"
              icon={<Building2 className="w-4 h-4 text-gray-400" />}
              className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="matricule"
              label="Tax ID / Registration Number"
              placeholder="e.g. 1234567/A"
              icon={<Hash className="w-4 h-4 text-gray-400" />}
              className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
            />
          </div>

          <div className="relative group/url">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="website"
              label="Company Website"
              placeholder="https://www.example.com"
              icon={<Globe className="w-4 h-4 text-gray-400" />}
              className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12 pr-32"
              onChange={() => setUrlStatus("idle")}
            />
            <button
              type="button"
              onClick={handleCheckUrl}
              disabled={isCheckingUrl || !form.watch("website")}
              className={`absolute right-3 top-[52px] -translate-y-1/2 group inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold transition-all duration-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md focus:outline-none z-10
                ${urlStatus === 'valid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                  urlStatus === 'invalid' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 
                  'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'} 
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isCheckingUrl ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : urlStatus === 'valid' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : urlStatus === 'invalid' ? (
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <Globe2 className="w-3.5 h-3.5" />
              )}
              <span>
                {isCheckingUrl ? "Testing..." : 
                 urlStatus === 'valid' ? "Reachable" : 
                 urlStatus === 'invalid' ? "Offline" : 
                 "Test URL"}
              </span>
            </button>
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="contactEmail"
            label="Contact Email"
            placeholder="contact@company.com"
            icon={<Mail className="w-4 h-4 text-gray-400" />}
            className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
          />
        </div>

        <div className="pt-4 animate-fadeInUp delay-200">
          <SubmitButton 
            isLoading={false}
            className="w-full bg-black hover:bg-gray-900 text-white font-black h-14 rounded-2xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Continue
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
};

export default StepBasicInfo;
