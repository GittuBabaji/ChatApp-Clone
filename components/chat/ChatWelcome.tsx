'use client';

import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  type: "channel" | "conversation";
  name?: string;
}

export const ChatWelcome = ({
  type,
  name,
}: ChatWelcomeProps) => {
  return (
    <div className="flex flex-col items-start justify-center px-6 py-10">
      {type === "channel" && (
        <>
          <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-200 mb-1 ">
            <div className="flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 rounded-full p-2">
              <Hash className="w-20 h-20" />
            </div>
           </div>
        </>
      )}
      {type === "channel" && (
          <div>
             <h1 className="text-xl font-semibold">Welcome to #{name}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This is the beginning of the #{name} channel.
          </p>
          </div>
      )}

      {type === "conversation" && (
        <>
          <h1 className="text-xl font-semibold text-zinc-700 dark:text-zinc-200 mb-1">
            {name}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This is the beginning of your conversation with {name}.
          </p>
        </>
      )}
    </div>
  );
};
