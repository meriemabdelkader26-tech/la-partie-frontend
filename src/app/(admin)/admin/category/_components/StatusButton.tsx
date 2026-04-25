import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Ban, Check, CheckCircle2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { CATEGORIES_KEY } from "@/constant";
import { toast } from "sonner";
import { Category } from "@/app/types";

interface Props {
  id: string;
  isActive: boolean;
}

interface PatchCategoryMutationResult {
  patchCategory: {
    category: Category;
  };
}

const options = [
  {
    id: true,
    label: "Active",
    icon: <CheckCircle2 className="size-4 text-emerald-400" />,
  },
  {
    id: false,
    label: "Inactive",
    icon: <Ban className="size-4 text-rose-400" />,
  },
];

export default function StatusButton({ isActive, id }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<boolean>(isActive);
  const queryClient = useQueryClient();

  const mutation = useMutation<
    PatchCategoryMutationResult,
    Error,
    { isActive: boolean }
  >({
    mutationFn: async (data) => {
      return await graphqlClient.request<PatchCategoryMutationResult>(
        MUTATION_PATCH_CATEGORY,
        {
          id: id,
          input: {
            isActive: data.isActive,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Successfully updated category status!");
    },
    onError: () => {
      toast.error("Failed to update category status.");
    },
  });

  const handleStatusChange = (value: boolean) => {
    setSelectedValue(value);
    mutation.mutate({ isActive: value });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={mutation.isPending}
          className={cn(
            "text-[10px] font-bold px-2.5 py-1 rounded-md transition-all duration-150 uppercase tracking-widest border shadow-sm hover:shadow-md active:scale-95 disabled:opacity-50",
            selectedValue
              ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100"
          )}
        >
          {selectedValue ? 'Active' : 'Inactive'}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1.5 bg-white border border-gray-100 rounded-xl shadow-xl animate-in fade-in zoom-in-95" align="start">
        <div className="flex flex-col gap-1">
          {options.map((option, index) => (
            <button
              key={index}
              className={cn(
                "w-full h-9 flex items-center justify-between px-3 rounded-lg text-xs font-bold transition-all",
                selectedValue === option.id 
                  ? "bg-gray-50 text-gray-900" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
              disabled={mutation.isPending}
              onClick={() => handleStatusChange(option.id)}
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <span className="uppercase tracking-wider">{option.label}</span>
              </div>
              {selectedValue === option.id && (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const MUTATION_PATCH_CATEGORY = `
mutation PatchCategory($id: ID!, $input: PatchCategoryInput!) {
  patchCategory(id: $id, input: $input) {
    category {
      created
      description
      id
      isActive
      modified
      name
    }
  }
}
`;