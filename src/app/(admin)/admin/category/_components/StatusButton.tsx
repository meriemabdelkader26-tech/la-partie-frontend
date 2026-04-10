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
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY, id] });
      toast.success("Successfully updated category!");
    },
    onError: () => {
      toast.error("Failed to update category status.");
    },
  });

  const handleFilterChange = (value: boolean) => {
    setSelectedValue(value);
    mutation.mutate({ isActive: value });
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            className={cn(
              "shadow-none w-10 h-11 transition-colors",
              selectedValue
                ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
            )}
            disabled={mutation.isPending}
          >
            {selectedValue ? (
              <CheckCircle2 className="size-5 text-emerald-400" />
            ) : (
              <Ban className="size-5 text-rose-400" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-36 p-1 bg-slate-700 border-slate-600">
          <div className="space-y-1">
            {options.map((option, index) => (
              <button
                key={index}
                className={cn(
                  "w-full h-10 flex items-center gap-2  px-3 rounded-md text-sm font-medium transition-colors",
                  option.id
                    ? "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                    : "text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
                )}
                disabled={mutation.isPending}
                onClick={() => handleFilterChange(option.id)}
              >
                {option.icon}
                {option.label}

                {selectedValue === option.id && (
                  <Check
                    className={
                      option.id
                        ? "text-emerald-400 size-5 ml-auto"
                        : "text-rose-400 size-5 ml-auto"
                    }
                  />
                )}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
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