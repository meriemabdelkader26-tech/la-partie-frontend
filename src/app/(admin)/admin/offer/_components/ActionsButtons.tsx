import { useState } from "react";
import { useRouter } from "next/navigation";
import { Offer } from "@/app/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteButton from "./DeleteButton";

interface Props {
  data: Offer;
}

const ActionsButtons = ({ data }: Props) => {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            aria-label="Open menu"
            size="icon-sm"
            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white"
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-slate-700 border-slate-600 text-white"
        >
          <DropdownMenuItem
            onClick={() => router.push(`/admin/offer/update-offer/${data.id}`)}
            className="cursor-pointer hover:bg-slate-600 focus:bg-slate-600 focus:text-emerald-300"
          >
            <PencilIcon className="mr-2 size-4 text-emerald-400" />
            <span className="text-white">Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/admin/offer/detail/${data.id}`)}
            className="cursor-pointer hover:bg-slate-600 focus:bg-slate-600 focus:text-blue-300"
          >
            <EyeIcon className="mr-2 size-4 text-blue-400" />
            <span className="text-white">View Details</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-600" />

          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="cursor-pointer hover:bg-slate-600 focus:bg-slate-600 focus:text-rose-300"
          >
            <TrashIcon className="mr-2 size-4 text-rose-400" />
            <span className="text-white">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteButton
        data={data}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </div>
  );
};

export default ActionsButtons;