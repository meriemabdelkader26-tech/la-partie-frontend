"use client";
import { User } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VerifyButton from "./VerifyButton";
import ViewUserSheet from "./ViewUserSheet";
import DeleteUserButton from "./DeleteUserButton";
import { CheckCircle2, Eye, Trash2 } from "lucide-react";

interface Props {
  user: User;
}

const ActionButtons = (props: Props) => {
  const { user } = props;
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        {!user.isVerifyByAdmin && (
          <Button
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 text-xs font-semibold shadow-soft hover:shadow-md transition-all px-3 flex items-center gap-1.5 rounded-lg"
            onClick={() => setIsVerifyOpen(true)}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve
          </Button>
        )}
        <Button
          size="sm"
          onClick={() => setIsViewOpen(true)}
          className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:text-gray-900 h-8 text-xs font-semibold shadow-sm transition-all px-3 flex items-center gap-1.5 rounded-lg"
        >
          <Eye className="w-3.5 h-3.5" />
          View
        </Button>
        <Button
          size="sm"
          onClick={() => setIsDeleteOpen(true)}
          className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 h-8 text-xs font-semibold shadow-sm transition-all px-3 flex items-center gap-1.5 rounded-lg"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>

      <ViewUserSheet 
        user={user} 
        open={isViewOpen} 
        onOpenChange={setIsViewOpen} 
      />

      <VerifyButton 
        data={user} 
        open={isVerifyOpen} 
        onOpenChange={setIsVerifyOpen} 
      />

      <DeleteUserButton
        data={user}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </>
  );
};

export default ActionButtons;