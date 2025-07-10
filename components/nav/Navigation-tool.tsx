'use client';

import { Plus } from "lucide-react";
import Button_custom from "./action-button";
    import { UserModal } from "@/hooks/use-modal-action";

const NavigationAction = () => {
  const { onOpen } = UserModal();
  return (
    <div>
      <Button_custom side="right" align="center" label="Create a new server">
        <button onClick={() => onOpen("CreateServer")}>
        <div className="flex items-center justify-center w-14 h-14 rounded-full transition-colors duration-200 bg-[#f2f3f5] dark:bg-[#2f3136] hover:bg-emerald-600 hover:dark:bg-emerald-600">
  <Plus className="text-black dark:text-white" />
</div>

        </button>
      </Button_custom>
    </div>
  );
};

export default NavigationAction;
