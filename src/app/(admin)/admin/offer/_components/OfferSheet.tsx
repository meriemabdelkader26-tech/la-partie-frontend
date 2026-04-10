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
          className="bg-slate-800/50 border-slate-700/50 text-white hover:bg-slate-700/50 hover:text-white"
        >
          <Filter className="size-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-green-600 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-slate-900 border-slate-700 text-white overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">Filter Offers</SheetTitle>
          <SheetDescription className="text-slate-400">
            Refine your search with advanced filters
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleApplyFilters)}
            className="flex flex-col gap-4 px-4"
          >
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="budgetRange"
              label="Budget Range"
              placeholder="Select budget range"
            >
              {BUDGET_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="minBudget"
              label="Min Budget ($)"
              placeholder="0"
              inputClassName="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="maxBudget"
              label="Max Budget ($)"
              placeholder="100000"
              inputClassName="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="ordering"
              label="Sort By"
              placeholder="Select ordering"
            >
              {ORDERING_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </CustomFormField>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Date Range
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white",
                      !startDate && "text-slate-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
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
                  className="w-auto p-0 bg-slate-800 border-slate-700"
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
                    numberOfMonths={2}
                    className="text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </Form>

        <SheetFooter className="flex-col sm:flex-col gap-2">
          <div className="text-sm text-slate-400 text-left">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} offers
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClearAll}
              className="flex-1 bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white"
            >
              Clear All
            </Button>
            <SheetClose asChild>
              <Button
                onClick={() => form.handleSubmit(handleApplyFilters)()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Apply Filters
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default OfferSheet;