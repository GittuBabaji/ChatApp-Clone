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
import { Loader2 } from "lucide-react";
import { UserModal } from "@/hooks/use-modal-action";
import { ServerwithMembers } from "@/type";

const DeleteServer = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = UserModal();
  const { server } = data as { server: ServerwithMembers };
  const isModalOpen = isOpen && type === "deleteServer";

  const [loading, setLoading] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);

  const onDelete = async () => {
    if (!confirm) {
      return setConfirm(true);
    }

    try {
      setLoading(true);

      await axios.delete(`/api/servers/${server?.id}`);

      router.push("/"); 
      router.refresh();
      window.location.reload();
      onClose();
    } catch (error: any) {
      console.error("Delete server failed:", error.response?.data || error.message);
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
          <DialogTitle className="text-lg font-bold text-center text-rose-500">
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-sm text-center text-zinc-500">
            This action cannot be undone. It will permanently delete{" "}
            <span className="font-semibold">{server?.name}</span> and all its data.
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
            onClick={onDelete}
            className="w-full"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {confirm ? "Are you Sureee ;)" : "Delete Server"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServer;
