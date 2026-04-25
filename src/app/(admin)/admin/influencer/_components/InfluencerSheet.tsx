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
import { Form } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Filter, X, ChevronRight, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import CustomFormField, {
  FormFieldType,
} from "@/components/shared/CustomFormField";
import { SelectItem } from "@/components/ui/select";
import { DisponibiliteEnum } from "@/app/enums";

const ORDERING_OPTIONS = [
  { value: "user_name", label: "Name (A-Z)" },
  { value: "-user_name", label: "Name (Z-A)" },
  {
    value: "followers_totaux",
    label: "Followers (Low to High)",
  },
  {
    value: "-followers_totaux",
    label: "Followers (High to Low)",
  },
  {
    value: "engagement_moyen_global",
    label: "Engagement (Low to High)",
  },
  {
    value: "-engagement_moyen_global",
    label: "Engagement (High to Low)",
  },
];

const DISPONIBILITE_OPTIONS = [
  { value: DisponibiliteEnum.DISPONIBLE, label: "Available" },
  { value: DisponibiliteEnum.OCCUPE, label: "Busy" },
  {
    value: DisponibiliteEnum.PARTIELLEMENT_DISPONIBLE,
    label: "Partially Available",
  },
];

interface Props {
  activeFiltersCount: number;
  startDate: Date | null;
  endDate: Date | null;
  disponibilite: string | null;
  maxEngagement: string | null;
  maxFollowers: string | null;
  ordering: string | null;
  setStartDate: (value: Date | null) => void;
  setEndDate: (value: Date | null) => void;
  setDisponibilite: (value: string | null) => void;
  setMaxEngagement: (value: string | null) => void;
  setMaxFollowers: (value: string | null) => void;
  setOrdering: (value: string | null) => void;
  setPage: (value: number) => void;
  onClearAll: () => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

type FilterFormValues = {
  disponibilite: string;
  maxEngagement: string;
  maxFollowers: string;
  ordering: string;
};

const InfluencerSheet = (props: Props) => {
  const {
    activeFiltersCount,
    endDate,
    endIndex,
    startDate,
    startIndex,
    totalItems,
    disponibilite,
    maxEngagement,
    maxFollowers,
    ordering,
    onClearAll,
    setEndDate,
    setPage,
    setStartDate,
    setDisponibilite,
    setMaxEngagement,
    setMaxFollowers,
    setOrdering,
  } = props;

  const form = useForm<FilterFormValues>({
    defaultValues: {
      disponibilite: disponibilite || "",
      maxEngagement: maxEngagement || "",
      maxFollowers: maxFollowers || "",
      ordering: ordering || "",
    },
  });

  useEffect(() => {
    form.reset({
      disponibilite: disponibilite || "",
      maxEngagement: maxEngagement || "",
      maxFollowers: maxFollowers || "",
      ordering: ordering || "",
    });
  }, [disponibilite, maxEngagement, maxFollowers, ordering, form]);

  const handleApplyFilters = (data: FilterFormValues) => {
    setDisponibilite(data.disponibilite || null);
    setMaxEngagement(data.maxEngagement || null);
    setMaxFollowers(data.maxFollowers || null);
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
            <SlidersHorizontal className="w-6 h-6 text-emerald-500" /> Advanced Filters
          </SheetTitle>
          <SheetDescription className="text-gray-500 text-sm">
            Refine your search with specific criteria.
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
                name="disponibilite"
                label="Availability Status"
                placeholder="All Statuses"
                labelClassName="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                selectClassName="bg-gray-50 border-gray-100 rounded-xl h-12"
              >
                {DISPONIBILITE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="rounded-lg">
                    {option.label}
                  </SelectItem>
                ))}
              </CustomFormField>

              <div className="grid grid-cols-2 gap-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="maxEngagement"
                  label="Max Eng. Rate (%)"
                  placeholder="e.g. 5.5"
                  labelClassName="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
                  inputClassName="bg-gray-50 border-gray-100 focus:bg-white transition-all rounded-xl h-12"
                />

                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  name="maxFollowers"
                  label="Max Followers"
                  placeholder="e.g. 100K"
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
                  <SelectItem key={option.value} value={option.value} className="rounded-lg">
                    {option.label}
                  </SelectItem>
                ))}
              </CustomFormField>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Registration Date Range
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-medium h-12 bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100 rounded-xl transition-all",
                        !startDate && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                      {startDate ? (
                        endDate ? (
                          <>
                            {format(startDate, "MMM dd, y")} -{" "}
                            {format(endDate, "MMM dd, y")}
                          </>
                        ) : (
                          format(startDate, "MMM dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-gray-100 rounded-2xl shadow-2xl"
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

export default InfluencerSheet;