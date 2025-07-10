'use client';

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserModal } from "@/hooks/use-modal-action";
import { useOrigin } from '@/hooks/use-origin';
import { Label } from "../ui/label";
import { Copy, Link, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios  from "axios";
const InviteModal = () => {
  const { onOpen,isOpen, onClose, type, data } = UserModal();
  const origin = useOrigin();
  const { server } = data;
  const [Loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const inviteUrl = `${origin}/invite/${server?.inviteCode ?? ""}`;
  const isModalOpen = isOpen && type === "InviteMember";

  const handleCopy = () => {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(inviteUrl)
      .then(() => setCopied(true))
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  } else {
    console.error("Clipboard API is not available");
  }
};
const onNew = async () => {
  try {
    setLoading(true);
    const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
    onOpen("InviteMember", { server: response.data });
  }
  catch(error){
    console.log(error);
  }
  finally{
    setLoading(false);
  }
}


  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1E1E2F] text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-lg text-center">
            INVITE MORE PEOPLE
          </DialogTitle>
          <DialogDescription className="text-xs text-center text-muted-foreground">
            YOU'RE LONELY ASF NOW
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label className="text-xs text-zinc-500 dark:text-zinc-400">SERVER INVITE LINK</Label>
          <div className="flex gap-2 items-center">
            <Input value={inviteUrl} readOnly className="text-xs" />
          </div>

          <div className="flex gap-2 items-center">
            <Button size="sm" className="w-full" disabled={Loading} onClick={onNew}>
              <Link className="mr-2 h-4 w-4" />
              Generate New Invite Link
            </Button>
            <Button size="sm" onClick={handleCopy} disabled={Loading}>
              {copied ? (
                <Check className="mr-1 h-4 w-4" />
              ) : (
                <Copy className="mr-1 h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
