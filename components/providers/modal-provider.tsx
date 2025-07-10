'use client'
import Invitemodal from "../modals/invite-user-model";
import CreateServerModal from "@/components/modals/create-server-modal";
import Editservermodal from "@/components/modals/edit-server";
import  Manage_members from "@/components/modals/manage-members";
import CreateChannel from "@/components/modals/create-channel";
import  LeaveServer from "@/components/modals/LeaveServer";
import  DeleteServer from "@/components/modals/DeleteServer";
import{ Deltechannel} from "@/components/modals/Deletechannel";
import EditChannel from "@/components/modals/editchannel";
import { useEffect, useState } from "react";
import MessageFile from "@/components/modals/message-file";
import { DeleteMessage } from "../modals/Deletemessage";
export const ServerModals = () => {
    const [ismounted,setismounted]=useState(false);
    useEffect(()=>{
        setismounted(true);
    },[]);
    if(!ismounted){
        return null;
    }
       return( 
        <div>
            <CreateServerModal />
            <Invitemodal />
            <Editservermodal />
            <Manage_members />
            <CreateChannel/>
            <LeaveServer/>
            <DeleteServer/>
            <EditChannel/>
            <Deltechannel/>
            <MessageFile/>
            <DeleteMessage/>
        </div>
     );
}
 
