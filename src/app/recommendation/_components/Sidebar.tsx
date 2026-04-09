import { Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface Props {
  numRecommendations: number;
  totalInfluencers: number;
  categories: string[];
  countries: string[];
  category: string;
  country: string;
  setRecommendationNumber: (value: number) => void;
  setCategory: (value: string) => void;
  setCountry: (value: string) => void;
}

type FilterFormValues = {
  numRecommendations: string;
  searchQuery: string;
  country: string;
  category: string;
};

const Sidebar = (props: Props) => {
  const {
    numRecommendations,
    totalInfluencers,
    categories,
    countries,
    category,
    country,
    setRecommendationNumber,
    setCategory,
    setCountry,
  } = props;

  const form = useForm<FilterFormValues>({
    defaultValues: {
      numRecommendations: numRecommendations.toString(),
      country: country || "",
      category: category || "",
    },
  });

  useEffect(() => {
    form.reset({
      numRecommendations: numRecommendations.toString(),
      country: country || "",
      category: category || "",
    });
  }, [numRecommendations, country, category, form]);

  const handleApplyFilters = (data: FilterFormValues) => {
    setRecommendationNumber(Number(data.numRecommendations));
    setCountry(data.country);
    setCategory(data.category);
  };

  return (
    <aside className="w-80 bg-slate-800 border-r border-slate-700 fixed left-0 top-0 h-screen overflow-y-auto">
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">AI Recommendations</h1>
        </div>
        <p className="text-slate-400 text-xs">
          Machine Learning powered discovery
        </p>
      </div>

      <div className="p-6 space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleApplyFilters)}
            className="space-y-6"
          >
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="numRecommendations"
              label="Number of Results"
              placeholder="Select number of recommendations"
            >
              <SelectItem value="5">5 Recommendations</SelectItem>
              <SelectItem value="10">10 Recommendations</SelectItem>
              <SelectItem value="20">20 Recommendations</SelectItem>
              <SelectItem value="50">50 Recommendations</SelectItem>
            </CustomFormField>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="country"
              label="Country"
              placeholder="All Countries"
            >
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="category"
              label="Category"
              placeholder="All Categories"
            >
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </CustomFormField>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Apply Filters
            </Button>
          </form>
        </Form>

        <div className="pt-4 border-t border-slate-700">
          <p className="text-slate-400 text-xs">
            <span className="font-bold text-white">{numRecommendations}</span>{" "}
            of <span className="font-bold text-white">{totalInfluencers}</span>{" "}
            results
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
