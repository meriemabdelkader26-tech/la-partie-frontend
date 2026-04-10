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
import { CalendarIcon, Filter } from "lucide-react";
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
              name="disponibilite"
              label="Availability"
              placeholder="Select availability"
            >
              {DISPONIBILITE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="maxEngagement"
              label="Max Engagement Rate (%)"
              placeholder="e.g., 5.5"
              inputClassName="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />

            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="maxFollowers"
              label="Max Followers"
              placeholder="e.g., 100000"
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
            {totalItems} influencers
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

export default InfluencerSheet;