"use client";
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
    <aside className="w-80 bg-zinc-950 border-r border-zinc-900 fixed left-0 top-0 h-screen overflow-y-auto shadow-2xl z-50">
      {/* Header */}
      <div className="sticky top-0 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 p-10 z-10">
        <div className="flex items-center gap-5 mb-2">
          <div className="w-14 h-14 bg-white rounded-[1.25rem] flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Zap className="w-7 h-7 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">InfluBridge</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                Live Analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Form */}
      <div className="p-10 space-y-10">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
              Smart Filters
            </h2>
            <button 
              type="button"
              onClick={() => form.reset()}
              className="text-[10px] font-bold text-white uppercase tracking-wider hover:text-slate-300 transition-colors"
            >
              Reset
            </button>
          </div>
          
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleApplyFilters)}
              className="space-y-8"
            >
              <div className="space-y-6">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  name="numRecommendations"
                  label="Display Limit"
                  placeholder="Select limit"
                  selectClassName="bg-zinc-900 border-zinc-800 text-white"
                  selectContentClassName="bg-zinc-900 border-zinc-800 text-white"
                  labelClassName="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2"
                >
                  <SelectItem value="6">Top 6</SelectItem>
                  <SelectItem value="12">Top 12</SelectItem>
                  <SelectItem value="24">Top 24</SelectItem>
                  <SelectItem value="48">Top 48</SelectItem>
                </CustomFormField>

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  name="country"
                  label="Geographic Region"
                  placeholder="Global"
                  selectClassName="bg-zinc-900 border-zinc-800 text-white"
                  selectContentClassName="bg-zinc-900 border-zinc-800 text-white"
                  labelClassName="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2"
                >
                  <SelectItem value="Global">Global Rankings</SelectItem>
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
                  label="Niche / Category"
                  placeholder="All Categories"
                  selectClassName="bg-zinc-900 border-zinc-800 text-white"
                  selectContentClassName="bg-zinc-900 border-zinc-800 text-white"
                  labelClassName="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2"
                >
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </CustomFormField>
              </div>

              <Button
                type="submit"
                className="w-full h-16 bg-white hover:bg-slate-200 text-slate-950 font-black rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-95 text-sm uppercase tracking-widest"
              >
                Sync Discovery
              </Button>
            </form>
          </Form>
        </div>

        {/* Stats Box */}
        <div className="pt-10 border-t border-slate-800">
          <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Real-time Sync
            </p>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-5xl font-black text-white tracking-tighter">{numRecommendations}</span>
              <span className="text-slate-500 font-bold text-sm">/ {totalInfluencers}</span>
            </div>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              Global creators currently being analyzed.
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800/50">
          <div className="flex gap-3">
            <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 shrink-0" />
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Our AI engine continuously scrapes global trends to provide real-time engagement data.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
