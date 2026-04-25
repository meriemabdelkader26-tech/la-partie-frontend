"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData } from "../types";
import { Step2PersonalInfoSchema, Step2PersonalInfoType } from "../schema";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import SubmitButton from "@/components/shared/SubmitButton";
import { DisponibiliteEnum } from "@/app/enums";
import { SelectItem } from "@/components/ui/select";
import { DISPONIBILITE_CHOICES } from "@/constant";
import { Sparkles, Loader2, Globe, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { NEXT_PUBLIC_BASE_URL } from "@/config";
import axios from "axios";
import { Country, City } from "country-state-city";

interface Props {
  formData: ProfileFormData;
  onUpdate: (updates: Partial<ProfileFormData>) => void;
  onNext: () => void;
}

export default function StepPersonalInfo({
  formData,
  onUpdate,
  onNext,
}: Props) {
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);
  const [urlStatus, setUrlStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const countries = Country.getAllCountries();
  const cities = selectedCountryCode ? City.getCitiesOfCountry(selectedCountryCode) : [];
  const uniqueCities = Array.from(new Set(cities?.map(c => c.name))).map(name => cities?.find(c => c.name === name));

  const form = useForm<Step2PersonalInfoType>({
    resolver: zodResolver(Step2PersonalInfoSchema),
    defaultValues: {
      biography: formData.biography || "",
      country: formData.localisation ? formData.localisation.split(", ")[1] || "" : "",
      city: formData.localisation ? formData.localisation.split(", ")[0] || "" : "",
      siteWeb: formData.siteWeb || "",
      disponibiliteCollaboration:
        (formData.disponibiliteCollaboration as any) ||
        DisponibiliteEnum.DISPONIBLE,
    },
  });

  // Automatically set local state if formData already has location
  useState(() => {
    if (formData.localisation) {
      const parts = formData.localisation.split(", ");
      if (parts.length === 2) {
        const countryName = parts[1];
        const cityName = parts[0];
        const foundCountry = Country.getAllCountries().find(c => c.name === countryName);
        if (foundCountry) {
          setSelectedCountryCode(foundCountry.isoCode);
          setSelectedCity(cityName);
        }
      }
    }
  });

  const handleGenerateBio = async () => {
    const currentBio = form.getValues("biography");
    if (!currentBio || currentBio.length < 5) {
      toast.error("Please write a few words about yourself first so the AI knows what to refine.");
      return;
    }

    setIsGeneratingBio(true);
    try {
      const response = await axios.post(`${NEXT_PUBLIC_BASE_URL}api/generate-bio/`, { prompt: currentBio });
      if (response.data && response.data.success) {
        form.setValue("biography", response.data.bio, { shouldValidate: true });
        toast.success("Biography refined successfully!");
      } else {
        toast.error(response.data?.message || "Failed to generate biography.");
      }
    } catch (error) {
      console.error("Error generating bio:", error);
      toast.error("An error occurred while connecting to the AI service.");
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleCheckUrl = async () => {
    const currentUrl = form.getValues("siteWeb");
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

  const onSubmit = (data: Step2PersonalInfoType) => {
    const fullLocation = selectedCity && selectedCountryCode 
      ? `${selectedCity}, ${Country.getCountryByCode(selectedCountryCode)?.name}`
      : `${data.city}, ${data.country}`;

    onUpdate({
      biography: data.biography,
      localisation: fullLocation,
      siteWeb: data.siteWeb,
      disponibiliteCollaboration: data.disponibiliteCollaboration as any,
    });
    onNext();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6 animate-fadeInUp">
          <div className="relative group/bio">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="biography"
              label="Biography"
              placeholder="Tell us about yourself (10-500 characters)"
            />
            
            {/* AI Guide Tooltip */}
            <div className="absolute -top-8 right-0 opacity-0 group-hover/bio:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
              <div className="bg-black text-white text-xs py-1.5 px-3 rounded-lg shadow-lg flex items-center gap-1.5 animate-bounce">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>Write a few words, then click to refine!</span>
                <div className="absolute -bottom-1 right-5 w-2 h-2 bg-black rotate-45"></div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateBio}
              disabled={isGeneratingBio}
              className="absolute right-3 top-[52px] -translate-y-1/2 group inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-300 bg-black rounded-full overflow-hidden shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed z-10"
            >
              {/* Animated gradient background for hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              {isGeneratingBio ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 relative z-10 group-hover:scale-110 transition-transform" />
              )}
              <span className="relative z-10">{isGeneratingBio ? "Refining..." : "Refine with AI"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              fieldType={FormFieldType.NATIVE_SELECT}
              control={form.control}
              name="country"
              label="Country"
              placeholder="Select Country"
              onChange={(val: string) => {
                setSelectedCountryCode(val);
                form.setValue("country", val);
                form.setValue("city", "");
                setSelectedCity("");
              }}
            >
              {countries.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.NATIVE_SELECT}
              control={form.control}
              name="city"
              label="City"
              placeholder="Select City"
              disabled={!selectedCountryCode}
              onChange={(val: string) => {
                setSelectedCity(val);
                form.setValue("city", val);
              }}
            >
              {uniqueCities?.map((city, index) => (
                <option key={`${city?.name}-${index}`} value={city?.name}>
                  {city?.name}
                </option>
              ))}
            </CustomFormField>
          </div>

          <div className="relative group/url">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="siteWeb"
              label="Website (Optional)"
              placeholder="https://yourwebsite.com"
              onChange={() => setUrlStatus("idle")}
            />
            <button
              type="button"
              onClick={handleCheckUrl}
              disabled={isCheckingUrl || !form.watch("siteWeb")}
              className={`absolute right-3 top-[52px] -translate-y-1/2 group inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold transition-all duration-300 rounded-full overflow-hidden shadow-sm hover:shadow-md focus:outline-none z-10
                ${urlStatus === 'valid' ? 'bg-green-100 text-green-700 border border-green-200' : 
                  urlStatus === 'invalid' ? 'bg-red-100 text-red-700 border border-red-200' : 
                  'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'} 
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isCheckingUrl ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : urlStatus === 'valid' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              ) : urlStatus === 'invalid' ? (
                <XCircle className="w-3.5 h-3.5 text-red-600" />
              ) : (
                <Globe className="w-3.5 h-3.5" />
              )}
              <span>
                {isCheckingUrl ? "Verifying..." : 
                 urlStatus === 'valid' ? "Verified" : 
                 urlStatus === 'invalid' ? "Unreachable" : 
                 "Verify URL"}
              </span>
            </button>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="disponibiliteCollaboration"
            label="Availability for Collaborations"
            placeholder="Select your availability"
          >
            {DISPONIBILITE_CHOICES.map((e) => (
              <SelectItem key={e.value} value={e.value}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${e.color} shadow-sm`}></span>
                  <span className="font-medium">{e.label}</span>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
        </div>

        <div className="animate-fadeInUp delay-200">
          <SubmitButton isLoading={false}>Continue</SubmitButton>
        </div>
      </form>
    </Form>
  );
}
