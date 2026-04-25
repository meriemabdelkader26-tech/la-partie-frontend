import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { useEffect } from "react";

interface OfferSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

type SearchFormValues = {
  search: string;
};

export const OfferSearchBar = ({ value, onChange }: OfferSearchBarProps) => {
  const form = useForm<SearchFormValues>({
    defaultValues: {
      search: value,
    },
  });

  useEffect(() => {
    form.setValue("search", value);
  }, [value, form]);

  useEffect(() => {
    const subscription = form.watch((formData) => {
      if (formData.search !== undefined) {
        onChange(formData.search);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  return (
    <Form {...form}>
      <div className="flex-1 group">
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="search"
          placeholder="Search for your next collaboration..."
          inputClassName="bg-gray-50 border-2 border-black/5 text-black placeholder:text-gray-400 rounded-2xl focus:border-black/20 focus:bg-white transition-all duration-300 shadow-inner-soft h-14"
          icon={<Search className="size-5 text-gray-400 group-focus-within:text-black transition-colors" />}
        />
      </div>
    </Form>
  );
};
