"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import qs from "query-string";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSub,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { UserModal } from "@/hooks/use-modal-action";
import { useOrigin } from "@/hooks/use-origin";
import { ServerwithMembers } from "@/type";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import {
  ShieldCheck,
  VerifiedIcon,
  Edit,
  ShieldQuestion,
  Verified,
  LogOutIcon,
  Loader2,
} from "lucide-react";
import UserAvatar from "@/components/ui/user-avatar";
import { response } from "express";

// Role icon mapping
const rolemap: Record<string, React.ReactNode | null> = {
  GUEST: null,
  MEMBER: <ShieldCheck className="text-pink-300 w-4 h-4" />,
  ADMIN: <VerifiedIcon className="text-pink-300 w-4 h-4" />,
};

const ManageMembers = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = UserModal();
  const origin = useOrigin();
  const { server } = data as { server: ServerwithMembers };
  const isModalOpen = isOpen && type === "ManageMembers";

  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `${origin}/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response =await axios.patch(url, { role });
      router.refresh();
      onOpen("ManageMembers",{server:response.data});
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };
  const onKick=async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const response =await axios.delete(url);
      router.refresh();
      onOpen("ManageMembers",{server:response.data});
    }catch (error) {
      console.error(error);
    }finally {
      setLoadingId(null);
    }
    
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] bg-white dark:bg-[#1E1E2F] text-black dark:text-white">
        <DialogHeader>
          <DialogTitle className="font-bold text-lg text-center">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-xs text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-6 max-h-[420px] pr-4">
          {server?.members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-2 p-1"
            >
              <div className="flex items-center gap-2">
                <UserAvatar src={member?.profile?.imageUrl} />
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">{member.profile.name}</span>
                  <span className="text-xs text-zinc-500 truncate">
                    {member.profile.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center text-xs text-zinc-400 ml-auto">
                <div>{rolemap[member.role]}</div>

                {member.role !== "ADMIN" && loadingId !== member.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Edit className="w-4 h-4 text-zinc-500 hover:text-zinc-300 transition" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      side="left"
                      className="w-44 bg-white dark:bg-[#1E1E2F] border border-zinc-700"
                    >
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md">
                          <ShieldQuestion className="w-4 h-4 mr-2 text-zinc-500" />
                          <span>Change Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="w-40 bg-white dark:bg-[#1E1E2F] border border-zinc-700">
                            {["GUEST", "MEMBER"].map((role) => (
                              <DropdownMenuItem
                                key={role}
                                className="flex items-center justify-between"
                                onClick={() =>
                                  onRoleChange(member.id, role as MemberRole)
                                }
                              >
                                {role}
                                {member.role === role && (
                                  <Verified className="w-4 h-4 text-green-500" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem className="flex items-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900" onClick={() => onKick(member.id)}>
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {loadingId === member.id && (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-500 ml-2" />
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembers;
