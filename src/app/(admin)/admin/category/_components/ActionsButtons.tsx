import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/app/types";
import DeleteButton from "./DeleteButton";

interface Props {
  data: Category;
}

const ActionsButtons = ({ data }: Props) => {
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:text-emerald-600 h-8 text-xs font-semibold shadow-sm transition-all px-3 flex items-center gap-1.5 rounded-lg"
          onClick={() => router.push(`/admin/category/update-category/${data.id}`)}
        >
          <PencilIcon className="w-3.5 h-3.5" />
          Edit
        </Button>
        <Button
          size="sm"
          className="bg-white hover:bg-rose-50 border border-gray-200 text-gray-700 hover:text-rose-600 h-8 text-xs font-semibold shadow-sm transition-all px-3 flex items-center gap-1.5 rounded-lg"
          onClick={() => setOpenDelete(true)}
        >
          <TrashIcon className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>

      <DeleteButton
        data={data}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </>
  );
};

export default ActionsButtons;