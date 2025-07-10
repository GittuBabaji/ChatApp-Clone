import { getCurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
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

    
    const membership = await db.member.findFirst({
      where: {
        ServerId: serverId,
        profileId: profile.id,
      },
    });

    if (!membership) {
      return new NextResponse("Membership not found", { status: 404 });
    }

    
    await db.member.delete({
      where: {
        id: membership.id,
      },
    });

    return new NextResponse("Left the server", { status: 200 });
  } catch (error) {
    console.error("[MEMBER_LEAVE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
