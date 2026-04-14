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
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        className="rounded-lg px-3 py-2 bg-primary text-white border-0 shadow-soft flex items-center justify-center transition-none opacity-100"
        onClick={() =>
          router.push(`/admin/category/update-category/${data.id}`)
        }
        style={{ minWidth: 44, minHeight: 36, opacity: 1, visibility: 'visible' }}
      >
        <PencilIcon size={18} />
      </Button>
      <Button
        size="sm"
        className="rounded-lg px-3 py-2 bg-danger text-white border-0 shadow-soft flex items-center justify-center transition-none opacity-100"
        onClick={() => setOpenDelete(true)}
        style={{ minWidth: 44, minHeight: 36, opacity: 1, visibility: 'visible' }}
      >
        <TrashIcon size={18} />
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