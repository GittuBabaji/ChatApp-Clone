'use client';

import { ServerwithMembers } from "@/type";
import { MemberRole } from "@prisma/client";
import { ChevronDown, Settings, UserPlus,Trash,LogOutIcon,PlusCircleIcon} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { UserModal } from "@/hooks/use-modal-action";
interface ServerHeaderProps {
  server: ServerwithMembers | null;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MEMBER;
  const { onOpen } = UserModal();
  return (
    <div className="relative px-3 py-2 border-b  border-zinc-200 dark:border-zinc-700 ">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" asChild>
          <button
            className="w-full flex items-center justify-between h-11 px-3 text-base font-semibold rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <span className="truncate">{server?.name}</span>
            <ChevronDown className="h-5 w-5 text-zinc-500" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 z-50 mt-2 rounded-md shadow-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-800 dark:text-zinc-200"
          align="start"
        >
          {isModerator && (
            <DropdownMenuItem className="flex items-center justify-between px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer" onClick={() => onOpen("InviteMember",{server})}>
              <span className="text-emerald-500">Invite People</span>
              <UserPlus className="w-4 h-4 ml-2 text-emerald-500" />
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <>
              <DropdownMenuItem className="flex items-center justify-between px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer" onClick={() => onOpen("EditServer",{server})}>
                <span>Manage Server</span>
                <Settings className="w-4 h-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer" onClick={() => onOpen("ManageMembers",{server})}>
                <span>Manage Members</span>
                <UserPlus className="w-4 h-4 ml-2" />              </DropdownMenuItem>
            </>
          )}
          {isModerator && (
            <DropdownMenuItem className="flex items-center justify-between px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer" onClick={() => onOpen("createChannel",{server})}>
              <span className="">Create Channel</span>
              <PlusCircleIcon className="w-4 h-4 ml-2 " />
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="border-zinc-200 dark:border-zinc-700" />
          {isAdmin && <DropdownMenuItem className="flex items-center justify-between px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer" onClick={() => onOpen("deleteServer",{server})}>
                <span className="text-rose-500">Delete Server</span>
                <Trash className="w-4 h-4 ml-2 text-rose-500" />
              </DropdownMenuItem>}
               {!isAdmin && <DropdownMenuItem className="flex items-center justify-between px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer" onClick={() => onOpen("leaveServer",{server})}>
                <span className="text-rose-500">Leave Server</span>
                <LogOutIcon className="w-4 h-4 ml-2 text-rose-500" />
              </DropdownMenuItem>}
          
           
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
