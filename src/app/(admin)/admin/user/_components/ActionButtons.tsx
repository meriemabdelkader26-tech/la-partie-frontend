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
  // Ajoutez ici la logique pour le bouton View (exemple : navigation ou modal)
  const handleView = () => {
    // TODO: Implémenter la logique d'affichage du détail utilisateur
    // Par exemple : router.push(`/admin/user/${user.id}`)
  };
  return (
    <div className="flex items-center gap-2">
      {!user.isVerifyByAdmin && (
        <Button
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
          onClick={() => { /* Approve logic */ }}
        >
          Approve
        </Button>
      )}
      <Button
        onClick={handleView}
        className="bg-white border border-gray-200 text-[#22C55E] h-8 text-xs"
      >
        View
      </Button>
    </div>
  );
};

export default ActionButtons;