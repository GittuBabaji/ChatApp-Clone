"use client";

import React, { useState } from "react";
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
import qs from "qs";

export const Deltechannel = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = UserModal();

  const isModalOpen = isOpen && type === "DeleteChannel";
  const { server, channel } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (!server?.id || !channel?.id) return;

    try {
      setIsLoading(true);

      const query = qs.stringify({
        serverId: server.id,
      });

      await axios.delete(`/api/channels/${channel.id}?${query}`);

      onClose();
      router.refresh();
      router.push(`/servers/${server.id}`);
    } catch (error) {
      console.error("Failed to delete channel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-indigo-500">
              #{channel?.name}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={isLoading} onClick={onClick}>
              {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
