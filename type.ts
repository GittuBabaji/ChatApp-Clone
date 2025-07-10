import { Server, Channel, Member, Profile } from "@prisma/client";
import{ Server as NetServer,Socket} from "net";
import { NextApiResponse } from "next";
import {Server as Serverio} from "socket.io";

export type ServerwithMembers = Server & {
  members: (Member & { profile: Profile })[];
  channels: Channel[];
};

export type NextApiResponseServerio =NextApiResponse & {
  socket:Socket &{
    server:NetServer & {
        io:Serverio
    }
  }
}
