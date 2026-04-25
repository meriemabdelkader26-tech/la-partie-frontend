"use client";
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
            variant="ghost"
            aria-label="Open menu"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <MoreHorizontalIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-white border border-gray-100 shadow-xl rounded-xl p-1.5 min-w-[160px] animate-in fade-in zoom-in-95 duration-200"
        >
          <DropdownMenuItem
            onClick={() => router.push(`/admin/offer/detail/${data.id}`)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-gray-600 focus:text-emerald-600 transition-colors"
          >
            <EyeIcon className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">View Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/admin/offer/update-offer/${data.id}`)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 text-gray-600 focus:text-blue-600 transition-colors"
          >
            <PencilIcon className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Edit Offer</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-gray-50 my-1" />

          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-rose-50 focus:bg-rose-50 text-gray-600 focus:text-rose-600 transition-colors"
          >
            <TrashIcon className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Delete Offer</span>
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
