import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, CalendarIcon } from "lucide-react";
import { BUDGET_RANGES, ORDERING_OPTIONS } from "./data";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Props {
  activeFiltersCount: number;
  filterBudgetRange: string | null;
  minBudget: string | null;
  maxBudget: string | null;
  ordering: string | null;
  startDate: Date | null;
  endDate: Date | null;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  setFilterBudgetRange: (value: string | null) => void;
  setMinBudget: (value: string | null) => void;
  setMaxBudget: (value: string | null) => void;
  setOrdering: (value: string | null) => void;
  setStartDate: (value: Date | null) => void;
  setEndDate: (value: Date | null) => void;
  setPage: (value: number) => void;
  onClearAll: () => void;
}

type FilterFormValues = {
  budgetRange: string;
  minBudget: string;
  maxBudget: string;
  ordering: string;
};

const OfferSheet = (props: Props) => {
  const {
    activeFiltersCount,
    endIndex,
    filterBudgetRange,
    minBudget,
    maxBudget,
    ordering,
    startDate,
    endDate,
    setFilterBudgetRange,
    setMinBudget,
    setMaxBudget,
    setOrdering,
    setStartDate,
    setEndDate,
    setPage,
    startIndex,
    totalItems,
    onClearAll,
  } = props;

  const form = useForm<FilterFormValues>({
    defaultValues: {
      budgetRange: filterBudgetRange || "",
      minBudget: minBudget || "",
      maxBudget: maxBudget || "",
      ordering: ordering || "",
    },
  });

  useEffect(() => {
    form.reset({
      budgetRange: filterBudgetRange || "",
      minBudget: minBudget || "",
      maxBudget: maxBudget || "",
      ordering: ordering || "",
    });
  }, [filterBudgetRange, minBudget, maxBudget, ordering, form]);

  const handleApplyFilters = (data: FilterFormValues) => {
    setFilterBudgetRange(data.budgetRange || null);
    setMinBudget(data.minBudget || null);
    setMaxBudget(data.maxBudget || null);
    setOrdering(data.ordering || null);
    setPage(1);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="bg-white border-2 border-black/10 text-black hover:bg-black hover:text-white font-bold rounded-2xl px-6 py-6 shadow-soft transition-all duration-300 group"
        >
          <Filter className="size-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-black text-white rounded-full px-2 py-0.5 text-[10px] font-black shadow-sm">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white border-l-2 border-black/5 text-black overflow-y-auto sm:max-w-md rounded-l-[40px] p-0">
        <div className="p-8 border-b border-black/5 bg-gray-50/50">
          <SheetHeader>
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center mb-4 shadow-soft">
              <Filter className="w-6 h-6 text-white" />
            </div>
            <SheetTitle className="text-3xl font-black text-black tracking-tighter">Filter Offers</SheetTitle>
            <SheetDescription className="text-gray-500 font-medium">
              Refine your search with advanced parameters
            </SheetDescription>
          </SheetHeader>
        </div>
        
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleApplyFilters)}
            className="flex flex-col gap-8 p-8"
          >
            <div className="space-y-6">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                name="budgetRange"
                label="Budget Range"
                placeholder="Select budget range"
                selectClassName="bg-gray-50 border-2 border-black/5 rounded-2xl focus:bg-white transition-all py-6"
              >
                {BUDGET_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value} className="focus:bg-black focus:text-white rounded-xl">
                    {range.label}
                  </SelectItem>
                ))}
              </CustomFormField>

              <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="minBudget"
                  label="Min Budget ($)"
                  placeholder="0"
                  inputClassName="bg-gray-50 border-2 border-black/5 rounded-2xl text-black placeholder:text-gray-400 focus:bg-white transition-all py-6 shadow-inner-soft"
                />

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="maxBudget"
                  label="Max Budget ($)"
                  placeholder="100,000"
                  inputClassName="bg-gray-50 border-2 border-black/5 rounded-2xl text-black placeholder:text-gray-400 focus:bg-white transition-all py-6 shadow-inner-soft"
                />
              </div>

              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                name="ordering"
                label="Sort By"
                placeholder="Select ordering"
                selectClassName="bg-gray-50 border-2 border-black/5 rounded-2xl focus:bg-white transition-all py-6"
              >
                {ORDERING_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="focus:bg-black focus:text-white rounded-xl">
                    {option.label}
                  </SelectItem>
                ))}
              </CustomFormField>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                  Date Range
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-bold bg-gray-50 border-2 border-black/5 rounded-2xl text-black hover:bg-white hover:border-black/20 py-7 transition-all shadow-inner-soft",
                        !startDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-gray-400" />
                      {startDate ? (
                        endDate ? (
                          <>
                            {format(startDate, "LLL dd, y")} -{" "}
                            {format(endDate, "LLL dd, y")}
                          </>
                        ) : (
                          format(startDate, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border-2 border-black/5 rounded-[32px] shadow-large"
                    align="start"
                  >
                    <Calendar
                      mode="range"
                      defaultMonth={startDate || undefined}
                      selected={{
                        from: startDate || undefined,
                        to: endDate || undefined,
                      }}
                      onSelect={(range) => {
                        setStartDate(range?.from || null);
                        setEndDate(range?.to || null);
                        setPage(1);
                      }}
                      numberOfMonths={1}
                      className="p-4"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </form>
        </Form>

        <div className="absolute bottom-0 left-0 right-0 p-8 border-t-2 border-black/5 bg-white/80 backdrop-blur-md">
          <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4 text-center">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} offers
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onClearAll}
              className="flex-1 bg-white border-2 border-black/10 text-black hover:bg-gray-50 py-7 rounded-2xl font-bold transition-all"
            >
              Clear All
            </Button>
            <SheetClose asChild>
              <Button
                onClick={() => form.handleSubmit(handleApplyFilters)()}
                className="flex-1 bg-black hover:bg-gray-800 text-white py-7 rounded-2xl font-bold shadow-soft transition-all hover:scale-[1.02]"
              >
                Apply Filters
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OfferSheet;
