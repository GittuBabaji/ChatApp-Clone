import { NextResponse  } from "next/server";
import { getCurrentProfile  } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
    req:Request,
    {params}:{params:{serverId:string}}

){
    try{
        const profile = await getCurrentProfile();
        if(!profile){
            return new NextResponse('Unauthorized', {status:401})
        }
        if(!params.serverId){
            return new NextResponse('Server ID Missing', {status:400})
        }
        const server = await db.server.update({
            where :{
                id:params.serverId,
                profileid:profile.id
            }
            ,data:{
                inviteCode:uuidv4(),
            }
        })
        return NextResponse.json(server)
    }catch(error){
        console.log(error);
        return new NextResponse('Internal Error', {status:500})
    }
}
