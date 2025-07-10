import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentProfile } from "@/lib/current-profile";
import { v4 as uuidv4 } from "uuid";
import { MemberRole } from "@prisma/client";
  
export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();

    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const server = await db.server.create({
      data: {
profileid: profile.id,
        name,
        imageUrl: imageUrl || null,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
              type: "TEXT",
              profileId: profile.id, 
            },
          ],
        },
        members: {
          create: {
            profileId: profile.id, 
            role: MemberRole.ADMIN,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function GET(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const { serverId } = params;

    if (!serverId) {
      return NextResponse.json({ error: "Missing serverId" }, { status: 400 });
    }

    const generalChannel = await db.channel.findFirst({
      where: {
        serverId,
        name: "general", 
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!generalChannel) {
      return NextResponse.json({ error: "General channel not found" }, { status: 404 });
    }

    return NextResponse.json(generalChannel);
  } catch (error) {
    console.error("[GENERAL_CHANNEL_GET_ERROR]", error);
    return NextResponse.json({ error: "Failed to fetch general channel" }, { status: 500 });
  }
}
