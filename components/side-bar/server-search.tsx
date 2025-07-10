"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
);
interface ServerSearchProps {
  data:
    | {
        label: string;
        type: "channel" | "text" | "voice" | "video" | "members";
        data: {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[];
      }[]
    | undefined;
  onSelect?: (id: string) => void;
}
export const ServerSearch: React.FC<ServerSearchProps> = ({ data, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    return (
      data?.flatMap((group) =>
        group.data.map((item) => ({
          id: item.id,
          name: item.name,
          icon: item.icon,
        }))
      ) ?? []
    );
  }, [data]);

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filtered.length > 0) {
      onSelect?.(filtered[0].id);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className=" flex gap-4 w-full z-50 p-2 rounded-md bg-cream dark:bg-[#202225] text-white hover:bg-gray-700 shadow-md"
      >

        <Search className="w-5 h-5" />
        <div className="text-sm font-semibold text-zinc-200">
          Open Search        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-sm bg-black/40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden>
          <DialogTitle>Search Dialog</DialogTitle>
        </VisuallyHidden>

        <CommandInput
          placeholder="Search channels or members..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={handleKeyDown}
          className="text-white placeholder:text-[#b9bbbe] bg-[#2f3136] rounded-md border border-[#4f545c] px-4 py-2 shadow focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />

        <CommandList className="bg-[#2f3136]">
          <CommandEmpty className="text-white px-4 py-2">No results found.</CommandEmpty>
          {filtered.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => {
                onSelect?.(item.id);
                setOpen(false);
              }}
              className="text-white px-4 py-2 cursor-pointer hover:bg-gray-700 flex items-center gap-2"
            >
              {item.icon}
              <span>{item.name}</span>
            </CommandItem>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
