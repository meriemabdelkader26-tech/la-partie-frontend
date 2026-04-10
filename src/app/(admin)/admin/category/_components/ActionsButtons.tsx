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
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        className="p-2! bg-slate-700 border-slate-600 text-emerald-400 hover:bg-slate-600 hover:text-emerald-300"
        onClick={() =>
          router.push(`/admin/category/update-category/${data.id}`)
        }
      >
        <PencilIcon />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="p-2! bg-slate-700 border-slate-600 text-rose-400 hover:bg-slate-600 hover:text-rose-300"
        onClick={() => setOpenDelete(true)}
      >
        <TrashIcon />
      </Button>

      <DeleteButton
        data={data}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </div>
  );
};

export default ActionsButtons;