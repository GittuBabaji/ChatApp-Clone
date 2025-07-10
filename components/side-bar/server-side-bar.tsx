import { getCurrentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { ServerHeader } from "@/components/side-bar/server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "@/components/side-bar/server-search";
import { Hash, Mic, Video } from "lucide-react";
import { CHANNELTYPE } from "@/lib/generated/prisma";
import { Separator } from "../ui/separator";
import { text } from "stream/consumers";
import { ServerSection } from "./server-section";
import { channel } from "diagnostics_channel";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";
interface ServerSideBarProps {
  serverId: string;
}

const iconMap = {
  [CHANNELTYPE.TEXT]: <Hash className="mr-2 h-4 w-4 text-indigo-500" />,
  [CHANNELTYPE.VOICE]: <Mic className="mr-2 h-4 w-4 text-indigo-500" />,
  [CHANNELTYPE.VIDEO]: <Video className="mr-2 h-4 w-4 text-indigo-500" />,
};

export const ServerSideBar = async ({ serverId }: ServerSideBarProps) => {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      redirect("/sign-in");
      return null;
    }
 const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  });

    if (!server) {
      redirect("/");
      return null;
    }

    const textchannels = server.channels.filter((c) => c.type === ChannelType.TEXT);
    const audiochannels = server.channels.filter((c) => c.type === ChannelType.VOICE);
    const videochannels = server.channels.filter((c) => c.type === ChannelType.VIDEO);

    const role = server.members.find((m) => m.profileId === profile.id)?.role;

    return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
        <ServerHeader server={server} role={role} />
        <ScrollArea className="flex-1 px-3 p-1">
          <div>
            <ServerSearch
              data={[
                {
                  label: "Text Channels",
                  type: "channel",
                  data: textchannels.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Voice Channels",
                  type: "channel",
                  data: audiochannels.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Video Channels",
                  type: "channel",
                  data: videochannels.map((channel) => ({
                    id: channel.id,
                    name: channel.name,
                    icon: iconMap[channel.type],
                  })),
                },
                {
                  label: "Members",
                  type: "members",
                  data: server.members.map((member) => ({
                    id: member.id,
                    name: member.profile.name,
                    icon: member.profile.imageUrl ? (
                      <img
                        src={member.profile.imageUrl}
                        alt={member.profile.name}
                        className="h-5 w-5 rounded-full"
                      />
                    ) : (
                      <span className="h-5 w-5 rounded-full bg-gray-500 inline-block" />
                    ),
                  })),
                },
              ]}
            />
          </div>
        <Separator className="my-2 h-[1px] bg-[#2f3136]"/>
        {(
          <ServerSection
          sectionType="channels"
          channelType={ChannelType.TEXT}
          role={role}
          label="Text Channels"          />
        )}
        {textchannels.map((channel)=>(
          <ServerChannel 
          key={channel.id}
          channel={channel}
          server={server}
          role={role} 
          />

        ))}
        {
          (
            <ServerSection
            sectionType="channels"
            channelType={ChannelType.VOICE}
            role={role}
            label="Voice Channels"          />
          )
        }
        {
          audiochannels.map((channel)=>(
            <ServerChannel 
            key={channel.id}
            channel={channel}
            server={server}
            role={role} 
            />
  
          ))}
        {
           (
            <ServerSection
            sectionType="channels"
            channelType={ChannelType.VIDEO}
            role={role}
            label="Video Channels"          />
          )
        }
        {
          videochannels.map((channel)=>(
            <ServerChannel 
            key={channel.id}
            channel={channel}
            server={server}
            role={role} 
            />
  
          ))
        }
        <Separator className="my-2 h-[1px] bg-[#2f3136]"/>
        <ServerSection
          sectionType="members"
          role={role}
          label="Members"
          server={server}
        />
        {server.members.map((member) => (
          <ServerMember
            key={member.id}
            member={member}
            server={server}
            role={role}
          />
        ))}






        </ScrollArea>
      


      </div>
    );
  } catch (e) {
    console.error("Error rendering ServerSideBar:", e);
    return null;
  }
};
