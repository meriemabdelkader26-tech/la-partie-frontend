import { User } from "@/app/types";
import SecondButton from "@/components/shared/SecondButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import VerifyButton from "./VerifyButton";

interface Props {
  user: User;
}

const ActionButtons = (props: Props) => {
  const { user } = props;
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-2">
      {!user.isVerifyByAdmin && (
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
          onClick={() => setOpenDelete(true)}
        >
          Approve
        </Button>
      )}
      <SecondButton label="View" onClick={() => {}} />

      <VerifyButton
        data={user}
        open={openDelete}
        onOpenChange={setOpenDelete}
      />
    </div>
  );
};

export default ActionButtons;