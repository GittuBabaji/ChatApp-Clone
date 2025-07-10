// hooks/use-chat-scroll.ts
import { useEffect, useRef } from "react";

interface UseChatScrollProps {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadmore: () => void;
  count: number;
}

const SCROLL_THRESHOLD = 300; // px from top

export default function useChatScroll({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadmore,
  count,
}: UseChatScrollProps) {
  const prevCountRef = useRef(count);

  // Scroll to bottom on new message
  useEffect(() => {
    const messagesContainer = chatRef.current;
    if (!messagesContainer) return;

    // New message added
    const messageAdded = count > prevCountRef.current;
    prevCountRef.current = count;

    if (messageAdded) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [count, chatRef, bottomRef]);

  // Scroll listener for loading older messages
  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop < SCROLL_THRESHOLD && shouldLoadMore) {
        loadmore();
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [chatRef, shouldLoadMore, loadmore]);
}
