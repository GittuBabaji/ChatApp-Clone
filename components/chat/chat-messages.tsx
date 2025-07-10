"use client";
import { useRef, useEffect,ComponentRef } from "react";
import { Member, Profile } from "@prisma/client";
import { ChatWelcome } from "./ChatWelcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { group } from "console";
import { Fragment } from "react";
import { Message } from "@/lib/generated/prisma";
import {ChatItem} from "./chat-item";
import {format} from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { Button } from "../ui/button";
import useChatScroll from "@/hooks/use-chat-scroll";
const DATE_FORMAT = "d MMM yyyy, HH:mm";
interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  SocketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}
type messageWithMemberWithProfiles = Message & {
  member: Member & {
    profile: Profile;
  };
}
export const UserMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  SocketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = [`chat:${chatId}`];
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });
  useChatSocket ({
    queryKey: queryKey,
    addKey: addKey,
    updateKey: updateKey,
  })
 
  const chatref=useRef<HTMLDivElement>(null);
  const bottomref=useRef<HTMLDivElement>(null);
 useChatScroll({
    chatRef:chatref,
    bottomRef:bottomref,
    shouldLoadMore:  !isFetchingNextPage && !!hasNextPage,
    loadmore:fetchNextPage,
    count:data?.pages?.[0]?.items?.length || 0
  })
  if (status === "pending" ) {
    return (
      <div  className="flex flex-col flex-1 justify-center items-center">
        <div className="relative w-12 h-12">
  <div
    className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-transparent border-r-white border-l-fuchsia-500 animate-spin"
    aria-label="loading"
    role="status"
  ></div>
  <div className="absolute inset-1 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-fuchsia-500 blur-sm animate-pulse"></div>
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
  </div>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
if (status === "error") {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <ServerCrash className="w-12 h-12 text-rose-500 dark:text-rose-400 mb-4 animate-bounce" />
      <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
        Not Cooking Today 😔
      </p>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
        The kitchen caught fire... Please refresh or try again later.
      </p>
    </div>
  );
}


  return (
    <div ref={chatref} className="flex flex-col flex-1 justify-between">
      {!hasNextPage&&       <div className="flex-1" 
      />}
         {!hasNextPage &&    <ChatWelcome type={type} name={name} />}
         {
          hasNextPage &&(
            <div className="flex justify-center">
              {isFetchingNextPage?(<Loader2 className="w-6 h-6 animate-spin text-zinc-500 dark:text-zinc-400" />):(<Button className="text-sm text-zinc-500 dark:text-zinc-400 bg-transparent hover:text-zinc-600 dark:hover:text-zinc-300" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                Load Previous
              </Button>)}
            </div>
          )
         }
 
    <div className="flex flex-col-reverse mt-auto">
       {data?.pages?.map((group,i)=>
    (
        <Fragment key={i}>
            {group.items.map((item:messageWithMemberWithProfiles)=>(
                <ChatItem
                key={item.id}
                currentMember={member}
                id={item.id}
                content={item.content}
                member={item.member}
                timestamp={format(new Date(item.createdAt), DATE_FORMAT)}
                fileUrl={item.fileUrl}
                deleted={item.deleted}
                isUpdated={item.updatedAt !== item.createdAt}
                socketUrl={socketUrl}
                socketQuery={SocketQuery}
                />
            
            ))}
        </Fragment>
    ))}

      </div>
      <div ref={bottomref}/>
      </div>


  );
};
