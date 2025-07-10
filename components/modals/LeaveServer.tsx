"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import qs from "query-string";
import { Loader2 } from "lucide-react";
import { UserModal } from "@/hooks/use-modal-action";
import { useOrigin } from "@/hooks/use-origin";
import { ServerwithMembers } from "@/type";

const LeaveServer = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = UserModal();
  const origin = useOrigin();
  const { server } = data as { server: ServerwithMembers };
  const isModalOpen = isOpen && type === "leaveServer";

  const [loading, setLoading] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false); 

  const onLeave = async () => {
    if (!confirm) {
      
      return setConfirm(true);
    }

    try {
      setLoading(true);

      const url = qs.stringifyUrl({
        url: `${origin}/api/members/leave`,
        query: {
          serverId: server?.id,
        },
      });

      await axios.delete(url);

      router.refresh();
      onClose();
    } catch (error: any) {
      console.error("Leave server failed:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setConfirm(false); 
    }
  };

  const handleCancel = () => {
    setConfirm(false);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#1E1E2F] text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-sm text-center text-zinc-500">
            Are you sure you want to leave{" "}
            <span className="font-semibold">{server?.name}</span>? You will lose access to all its channels.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-col gap-2">
          <Button
            disabled={loading}
            variant="ghost"
            onClick={handleCancel}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            variant="destructive"
            onClick={onLeave}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {confirm ?  "One more Chance :(" : "Leave Server"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServer;
