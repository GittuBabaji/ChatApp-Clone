import { useSocket } from "@/components/providers/socket-provider";
import { Member, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Message } from "@/lib/generated/prisma";
    type MessageWithMemberWithProfile = Message & {
      members: Member & {
  profile: Profile
}


    }
type socketprops = { addKey: string; updateKey: string, queryKey:string[] };

export const useChatSocket = ({ addKey, updateKey, queryKey }: socketprops) => {
const {socket} = useSocket();

const queryClient = useQueryClient();
useEffect(() => {
    if(!socket)
    {
        return
    }
    socket.on(updateKey, (Message:MessageWithMemberWithProfile) => {
        queryClient.setQueryData(queryKey, (oldData:any) => {
            if(!oldData || !oldData.pages || oldData.pages.length === 0){
                return oldData
            }
            const newData = oldData.pages.map((page:any) => {
                return {
                    ...page,
                    items: page.items.map((item:any) => {
                        if(item.id === Message.id){
                            return Message
                        }
                        return item
                    })
                }
            })
            return {
                ...oldData,
                pages: newData
            }
        })
        
    })


socket.on(addKey,(Message:MessageWithMemberWithProfile) => {
    queryClient.setQueryData(queryKey, (oldData:any) => {
        if(!oldData || !oldData.pages || oldData.pages.length === 0){
            return {
                pages: [
                    {
                        items: [Message],
                    }
                ]
            }
        }
        const newData = [...oldData.pages]
        newData[0] = {
            ...newData[0],
            items: [Message, ...newData[0].items]
        }
        return {
            ...oldData,
            pages: newData
        }
    })
})

return () => {
    socket.off(addKey);
    socket.off(updateKey);
}
},[queryClient, socket, addKey, updateKey, queryKey])



};
