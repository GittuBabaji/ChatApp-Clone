import { getCurrentProfile } from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
interface Props {
    params: { inviteCode: string };
}
const InvitePage = async(
    { params }: Props
) => {
    const profile= await getCurrentProfile();
    if(!profile){
        return (
          <RedirectToSignIn redirectUrl="/" />
        );
    }
    if(!params.inviteCode){
        return redirect("/");
    }
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }

    })
    if(existingServer){
        return redirect(`/servers/${existingServer.id}`);
    }
    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }   
    })
    if(server)
    {
        return redirect(`/servers/${server.id}`);
    }
    else{
        return redirect("/");
    }
}
 
export default InvitePage;
