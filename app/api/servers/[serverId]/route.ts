import { getCurrentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function PATCH(
    req:Request,
    {params}:{
        params:{serverId:string}
    }
) {
    try{
        const profile = await getCurrentProfile();
        if(!profile){
            return new NextResponse('Unauthorized', {status:401})
        }
        const { name, imageUrl } = await req.json();
        if(!params.serverId){
            return new NextResponse('Server ID Missing', {status:400})
        }
        const server = await db.server.update({
            where :{
                id:params.serverId,
                profileid:profile.id
            }
            ,data:{
                name:name,
                imageUrl:imageUrl,
                        }
        })
        return NextResponse.json(server)
    }
    catch(error){
        console.log("INTERNAL ERROR",error);
    }
    
}
export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await getCurrentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.delete({
      where: {
        id: params.serverId,
        profileid: profile.id, 
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[DELETE_SERVER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
