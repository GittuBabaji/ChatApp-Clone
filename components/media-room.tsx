"use client";

import React, { useEffect, useState } from "react";
import "@livekit/components-styles";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (!user?.firstName) return;

      try {
        const res = await fetch(
          `/api/token?room=${chatId}&username=${user.firstName}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await res.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [user?.firstName, chatId]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2 className="h-7 w-7 animate-spin text-zinc-500 mb-2" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Joining media room…</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect
      video={video}
      audio={audio}
      data-lk-theme="default"
      style={{ height: "100%" }}
    >
      <VideoConference />
    </LiveKitRoom>
  );
}
