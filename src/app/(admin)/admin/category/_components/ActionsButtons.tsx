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
    <div className="flex items-center gap-2 category-actions-always-visible">
      <Button
        size="sm"
        className="rounded-lg px-3 py-2 bg-primary text-white border-0 shadow-soft flex items-center justify-center !opacity-100 !visible"
        onClick={() =>
          router.push(`/admin/category/update-category/${data.id}`)
        }
        style={{ minWidth: 44, minHeight: 36, opacity: 1, visibility: 'visible', display: 'inline-flex' }}
      >
        <PencilIcon size={18} />
      </Button>
      <Button
        size="sm"
        className="rounded-lg px-3 py-2 bg-danger text-white border-0 shadow-soft flex items-center justify-center !opacity-100 !visible"
        onClick={() => setOpenDelete(true)}
        style={{ minWidth: 44, minHeight: 36, opacity: 1, visibility: 'visible', display: 'inline-flex', pointerEvents: 'auto', zIndex: 2, position: 'relative' }}
      >
        <TrashIcon size={18} style={{ opacity: 1, visibility: 'visible', pointerEvents: 'auto' }} />
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