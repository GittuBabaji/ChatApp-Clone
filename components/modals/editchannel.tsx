"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserModal } from "@/hooks/use-modal-action";
import { ChannelType, MemberRole } from "@prisma/client";
import { ServerwithMembers } from "@/type";
import qs from "query-string";


const EditChannel = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = UserModal();
  const { server, channel } = data ;
  const isModalOpen = isOpen && type === "editChannel";

  const [name, setName] = useState(channel?.name || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (channel) {
      setName(channel.name);
    }
  }, [channel]);

  const onSave = async () => {
  const trimmedName = name.trim();

  if (!trimmedName || trimmedName.toLowerCase() === "general") {
    alert("Channel name cannot be empty or 'general'");
    return;
  }

  try {
    setLoading(true);

    const query = qs.stringify({ serverId: server?.id });
    const url = `/api/channels/${channel?.id}?${query}`;

    await axios.patch(url, { name: trimmedName });

    router.refresh();
    window.location.reload();
    onClose();
  } catch (error: any) {
    console.error("Edit channel failed:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white dark:bg-[#1E1E2F] text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-center">Edit Channel</DialogTitle>
          <DialogDescription className="text-sm text-center text-zinc-500">
            Change the name of <span className="font-semibold">{channel?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <Input
            disabled={loading}
            placeholder="Channel name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-2 flex flex-col gap-2">
          <Button
            disabled={loading}
            variant="ghost"
            onClick={onClose}
            className="w-full"
          >
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={onSave}
            className="w-full"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannel;
