import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface PageResponse {
  items: any[];
  nextCursor: string | null;
}

interface ChatQueryProps {
  queryKey: string[];
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();
  
  const fetchMessages = async ({ pageParam }: { pageParam?: string }) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        [paramKey]: paramValue,
        cursor: pageParam,
      },
    });

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch messages");
    }

    return res.json() as Promise<PageResponse>;
  };

  return useInfiniteQuery({
    queryKey,
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: undefined,
    
  });
};
