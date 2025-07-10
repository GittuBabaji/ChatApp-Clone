import { Hash, Menu } from "lucide-react";
import { UserAvatar } from "../user-avatar";
import  {SocketIndicator} from "@/components/chat/socket-indicator";
import { MobileToggle } from "../ui/mobile-toggle";
interface ChatHeaderProps {
  serverId: string;
  name: string | undefined;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ serverId, name, type, imageUrl }: ChatHeaderProps) => {
  return (
    <div className="flex items-center h-12 px-4 border-b-2 border-neutral-200 dark:border-neutral-800">
      {type === "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}
      
<MobileToggle serverId={serverId}/>
        

{type === "conversation" && (
  <UserAvatar src={imageUrl} className="h-6 w-6 h-8 w-8 mr-2" />
)}

      <div className="font-semibold text-md text-zinc-500 dark:text-zinc-400">
   {name}
      </div>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
      
    </div>
  );
};

export default ChatHeader;
