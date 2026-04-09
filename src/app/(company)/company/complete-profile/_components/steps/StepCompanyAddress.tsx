import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyAddressSchema, CompanyAddressType } from "../schema";
import { ProfileCompanyFormData } from "../types";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import { useEffect, useState } from "react";
import tunisiaCities from "../../../../../../../public/tunisia-cities.json";
import SubmitButton from "@/components/shared/SubmitButton";

interface Props {
  formData: ProfileCompanyFormData;
  onUpdate: (updates: Partial<ProfileCompanyFormData>) => void;
  onNext: () => void;
}

const StepCompanyAddress = (props: Props) => {
  const { formData, onUpdate, onNext } = props;
  const [availableZones, setAvailableZones] = useState<
    Array<{
      city: string;
      zone: string;
    }>
  >([]);

  const form = useForm<CompanyAddressType>({
    resolver: zodResolver(CompanyAddressSchema),
    defaultValues: {
      address: formData.address || "",
      city: formData.city || "",
      state: formData.state || "",
      postalCode: formData.postalCode || "",
      country: formData.country || "Tunisia",
    },
  });

  const selectedCity = form.watch("city");

  useEffect(() => {
    if (
      selectedCity &&
      tunisiaCities[selectedCity as keyof typeof tunisiaCities]
    ) {
      const zones = tunisiaCities[selectedCity as keyof typeof tunisiaCities];
      setAvailableZones(zones);
      form.setValue("state", "");
    } else {
      setAvailableZones([]);
    }
  }, [selectedCity, form]);

  const onSubmit = (data: CompanyAddressType) => {
    onUpdate({
      address: data.address,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      country: data.country,
    });
    onNext();
  };

  const cities = Object.keys(tunisiaCities);

  // Get the placeholder text based on whether a city is selected
  const getZonePlaceholder = () => {
    if (!selectedCity) {
      return "First select a city";
    }
    return availableZones.length > 0 ? "Select your zone" : "Loading zones...";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="address"
          label="Address"
          placeholder="Enter your company address"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="city"
            label="City"
            placeholder="Select your city"
          >
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="state"
            label="Zone/Area"
            placeholder={getZonePlaceholder()}
            disabled={!selectedCity || availableZones.length === 0}
          >
            {availableZones.map((zone) => (
              <SelectItem key={zone.zone} value={zone.zone}>
                {zone.zone}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="postalCode"
            label="Postal Code"
            placeholder="Enter postal code"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="country"
            label="Country"
            disabled={true}
            placeholder="Enter country"
          />
        </div>

        <SubmitButton isLoading={false}>Continue</SubmitButton>
      </form>
    </Form>
  );
};

export default StepCompanyAddress;
