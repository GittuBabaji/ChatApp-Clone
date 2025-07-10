import React from "react";
import { redirect } from "next/navigation";
import { getCurrentProfile} from "@/lib/current-profile";
import { db } from "@/lib/db";
import  ChatHeader  from "@/components/chat/chat-header";
import { CreateorGetConvo } from "@/lib/conversation";
import { User } from "lucide-react";
import { ChatInput } from "@/components/chat/chat-input";
import { UserMessages } from "@/components/chat/chat-messages";
interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

export default async function MemberIdPage({
  params: { memberId, serverId },
}: MemberIdPageProps) {
  const profile = await getCurrentProfile();
  if (!profile) return redirect("/");
  const currentMember= await db.member.findFirst({
    where:{
      ServerId:serverId,
      profileId:profile.id
    },
    include:{
      profile:true
    }
  })
  if(!currentMember) return redirect(`/servers/${serverId}`);
const conversation=await CreateorGetConvo(currentMember?.id,memberId);
if(!conversation) return redirect(`/servers/${serverId}`);
const {memberOne,memberTwo}=conversation;
const othermember=memberOne.profileId===profile.id?memberTwo:memberOne;
  return (
  <div className="flex flex-col h-screen">
      <ChatHeader
      name={othermember.profile.name}
      serverId={serverId}
      type="conversation"
      imageUrl={othermember?.profile?.imageUrl}
      />
      <UserMessages
      name={othermember.profile.name}
      member={currentMember}
      chatId={conversation.id}
      type="conversation"
      apiUrl="/api/direct-messages"
      paramKey="conversationId"
      paramValue={conversation.id}
      socketUrl="/api/socket/direct-messages"
      SocketQuery={{
        conversationId:conversation.id,
        directMessageId:conversation.id
      }}
      />
          <div className="sticky bottom-0 w-full bg-white dark:bg-[#313338] p-4 ">

      <ChatInput
      name={othermember.profile.name}
      type="conversation"
      apiKey="/api/socket/direct-messages"
      query={{
        conversationId:conversation.id
      }}
      
      
      
      />
      </div>
  </div>
  );
}
