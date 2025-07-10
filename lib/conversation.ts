import { db } from "@/lib/db";

export const CreateorGetConvo = async (memberOneId: string, memberTwoId: string) => {
    let conversation = await Findconvo(memberOneId, memberTwoId) || await Findconvo(memberTwoId, memberOneId);
    if(conversation){
        return conversation;
    }
    else{
        conversation=await CreateConvo(memberOneId,memberTwoId);
    }
    return conversation;
}

const Findconvo=async (memberOneId: string, memberTwoId: string) => {
    return await db.conversation.findFirst({
        where:{
            AND:{
                memberOneId:memberOneId,
                memberTwoId:memberTwoId
            }
        },
        include:{
            memberOne:{
                include:{
                    profile:true
                }
            },
            memberTwo:{
                include:{
                    profile:true
                }
            }
        }
    });
}
const CreateConvo = async (memberOneId: string, memberTwoId: string)=>{
try{
    return await db.conversation.create({
        data:{
            memberOneId,
            memberTwoId,
        },
        include:{
            memberOne:{
                include:{
                    profile:true
                }
            },
            memberTwo:{
                include:{
                    profile:true
                }
            }
        }
    })
}catch(e){
return null
}
}
