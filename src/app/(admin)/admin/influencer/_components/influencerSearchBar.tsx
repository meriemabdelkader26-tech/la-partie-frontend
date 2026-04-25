import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

type SearchFormValues = {
  search: string;
};

export const InfluencerSearchBar = ({ value, onChange }: Props) => {
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
  }, [form, onChange]);

  return (
    <Form {...form}>
      <div className="relative w-full group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors z-10" />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="search"
          placeholder="Search influencers by name..."
          inputClassName="pl-10 h-11 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 shadow-sm transition-all"
        />
      </div>
    </Form>
  );
};