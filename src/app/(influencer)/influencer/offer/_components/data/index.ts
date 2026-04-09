export const BUDGET_RANGES = [
  { value: "under-25k", label: "Under $25K" },
  { value: "25k-50k", label: "$25K - $50K" },
  { value: "50k-100k", label: "$50K - $100K" },
  { value: "over-100k", label: "Over $100K" },
] as const;

export const ORDERING_OPTIONS = [
  { value: "title", label: "Title (A-Z)" },
  { value: "-title", label: "Title (Z-A)" },
  { value: "min_budget", label: "Budget (Low to High)" },
  { value: "-min_budget", label: "Budget (High to Low)" },
  { value: "start_date", label: "Start Date (Old to New)" },
  { value: "-start_date", label: "Start Date (New to Old)" },
  { value: "end_date", label: "End Date (Old to New)" },
  { value: "-end_date", label: "End Date (New to Old)" },
] as const;
