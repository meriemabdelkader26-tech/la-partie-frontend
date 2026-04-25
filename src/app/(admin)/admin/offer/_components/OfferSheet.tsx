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
import { Filter, CalendarIcon, SlidersHorizontal, ChevronRight } from "lucide-react";
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
          className={cn(
            "h-11 px-4 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2 font-medium shadow-sm transition-all",
            activeFiltersCount > 0 && "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          )}
        >
          <Filter className="w-4 h-4 text-gray-400" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge className="ml-1.5 bg-emerald-500 text-white border-none h-5 min-w-5 flex items-center justify-center p-0 text-[10px] font-bold">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white border-l border-gray-200 shadow-2xl sm:max-w-md w-full overflow-y-auto flex flex-col">
        <SheetHeader className="mb-6 space-y-3">
          <SheetTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-emerald-500" />
            Advanced Filters
          </SheetTitle>
          <SheetDescription className="text-gray-500 text-sm">
            Refine your offer search with specific criteria.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleApplyFilters)}
            className="flex-1 space-y-6"
          >
            <div className="space-y-5">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                name="budgetRange"
                label="Budget Category"
                placeholder="All Budgets"
                labelClassName="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                selectClassName="bg-gray-50 border-gray-100 rounded-xl h-12"
              >
                {BUDGET_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
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
                  labelClassName="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                  inputClassName="bg-gray-50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
                />

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="maxBudget"
                  label="Max Budget ($)"
                  placeholder="100K"
                  labelClassName="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                  inputClassName="bg-gray-50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
                />
              </div>

              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SELECT}
                name="ordering"
                label="Sort Results By"
                placeholder="Default Sorting"
                labelClassName="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                selectClassName="bg-gray-50 border-gray-100 rounded-xl h-12"
              >
                {ORDERING_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </CustomFormField>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                  Expiration Date Range
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-medium bg-gray-50 border-gray-100 rounded-xl hover:bg-gray-100 hover:text-gray-900",
                        !startDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {startDate ? (
                        endDate ? (
                          <>
                            {format(startDate, "MMM dd")} -{" "}
                            {format(endDate, "MMM dd, yyyy")}
                          </>
                        ) : (
                          format(startDate, "MMM dd, yyyy")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-gray-100 shadow-xl rounded-2xl"
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
                      className="rounded-2xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </form>
        </Form>

        <div className="mt-auto pt-6 space-y-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
            <span>Summary</span>
            <span className="text-gray-900">{totalItems} matches found</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClearAll}
              className="flex-1 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 font-bold h-12 rounded-xl transition-all"
            >
              Reset
            </Button>
            <SheetClose asChild>
              <Button
                onClick={() => form.handleSubmit(handleApplyFilters)()}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl shadow-md hover:shadow-lg transition-all"
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