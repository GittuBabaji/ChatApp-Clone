import { NextApiRequest } from "next";
import { NextApiResponseServerio } from "@/type";
import { getCurrentProfile } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerio
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await getCurrentProfile(req);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { serverId, channelId } = req.query;
    const { content, fileUrl } = req.body;

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    // ✅ Fix: Allow file-only or text-only messages
    if (!content && !fileUrl) {
      return res.status(400).json({ error: "Message must have text or file." });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const member = server.members.find((m) => m.profileId === profile.id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (e) {
    console.error("[MESSAGE_POST_ERROR]", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
