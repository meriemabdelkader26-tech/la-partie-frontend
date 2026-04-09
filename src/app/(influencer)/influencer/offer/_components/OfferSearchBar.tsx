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
      <div className="flex items-center gap-2">
        <Search className="size-4 text-slate-400" />
        <div className="flex-1">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="search"
            placeholder="Search offers by title..."
            inputClassName="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-500 rounded-lg focus:border-green-500/50"
          />
        </div>
      </div>
    </Form>
  );
};
