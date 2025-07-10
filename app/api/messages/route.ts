import { getCurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!channelId) {
      return new NextResponse("Channel ID Missing", { status: 400 });
    }

    const MESSAGE_BATCH = 15;

    let messages = [];

    try {
      messages = await db.message.findMany({
        take: MESSAGE_BATCH,
        skip: cursor ? 1 : 0,
        ...(cursor && {
          cursor: { id: cursor },
        }),
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (err) {
      console.error("Invalid cursor:", err);
      return new NextResponse("Invalid cursor", { status: 400 });
    }

    const nextCursor =
      messages.length === MESSAGE_BATCH
        ? messages[messages.length - 1].id
        : null;

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (e) {
    console.error("Message fetch error:", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
