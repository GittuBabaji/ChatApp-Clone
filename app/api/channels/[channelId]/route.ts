import { getCurrentProfile } from "@/lib/current-profile";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
export async function PATCH(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await getCurrentProfile();


 if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!serverId)
      return new NextResponse("Server ID Missing", { status: 400 });
    if (!params.channelId)
      return new NextResponse("Channel ID Missing", { status: 400 });

    const { name, type } = await req.json();
    if (!name || name.toLowerCase() === "general") {
  return new NextResponse("Name / Type cannot be empty or general", { status: 400 });
}
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MEMBER]
            }
          }
        }
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general"
              }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNEL_ID_PATCH", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID Missing", { status: 400 });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MEMBER],
            },
          },
        },
      },
    });

    if (!server) {
      return new NextResponse("Forbidden: Not an authorized member", { status: 403 });
    }

    const channel = await db.channel.findUnique({
      where: {
        id: params.channelId,
      },
    });

    if (!channel) {
      return new NextResponse("Channel Not Found", { status: 404 });
    }

    if (channel.name === "general") {
      return new NextResponse("Cannot delete the 'general' channel", { status: 400 });
    }

    await db.channel.delete({
      where: {
        id: params.channelId,
      },
    });

    return new NextResponse("Channel Deleted", { status: 200 });
  } catch (error) {
    console.error("[CHANNEL_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
