// Budget ranges for offer filtering
export const BUDGET_RANGES = [
  { value: "0-100", label: "$0 - $100" },
  { value: "100-500", label: "$100 - $500" },
  { value: "500-1000", label: "$500 - $1,000" },
  { value: "1000-5000", label: "$1,000 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000+", label: "$10,000+" },
];

// Ordering options for sorting offers
export const ORDERING_OPTIONS = [
  { value: "createdAt", label: "Date de création" },
  { value: "minBudget", label: "Budget minimum" },
  { value: "maxBudget", label: "Budget maximum" },
  { value: "startDate", label: "Date de début" },
  { value: "endDate", label: "Date de fin" },
];
