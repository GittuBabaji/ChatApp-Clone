import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { UserMessages } from "@/components/chat/chat-messages";
import { CHANNELTYPE } from "@/lib/generated/prisma";
import { MediaRoom } from "@/components/media-room";

interface Props {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: Props) => {
  const profile = await getCurrentProfile();
  if (!profile) return redirect("/");

  const member = await db.member.findFirst({
    where: {
      ServerId: params.serverId,
      profileId: profile.id,
    },
  });

  const channel = await db.channel.findFirst({
    where: {
      id: params.channelId,
      serverId: params.serverId,
    },
  });

  if (!channel || !member) {
    return redirect(`/servers/${params.serverId}`);
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader
        serverId={params.serverId}
        name={channel.name}
        type="channel"
      />

      {channel.type === "TEXT" && (
        <>
          <UserMessages
            name={channel.name}
            member={member}
            chatId={channel.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            SocketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
            type="channel"
          />

          <div className="sticky bottom-0 w-full bg-white dark:bg-[#313338] p-4">
            <ChatInput
              name={channel.name}
              type="channel"
              query={{
                channelId: channel.id,
                serverId: channel.serverId,
              }}
              apiKey="/api/socket/messages"
            />
          </div>
        </>
      )}

      {channel.type === CHANNELTYPE.VOICE && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}

      {channel.type === CHANNELTYPE.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default ChannelIdPage;
