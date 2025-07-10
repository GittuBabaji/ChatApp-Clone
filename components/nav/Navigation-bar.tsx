import { db } from "@/lib/db";
import NavigationAction from "@/components/nav/Navigation-tool";
import NavigationItem from "@/components/nav/Navigation-item";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "@radix-ui/react-scroll-area";

import {  currentUser } from "@clerk/nextjs/server";
import {UserButton} from "@clerk/nextjs";
import { ModeToggle } from "../ui/mode-toggle";

const NavigationSideBar = async () => {
  const user = await currentUser();
  if (!user) return null;

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profile: {
            userId: user.id,
          },
        },
      },
    },
    include: {
      members: true,
      channels: true,
    },
  });

  return (
    <div className="md:flex md:p-2  w-[72px] h-full flex-col items-center gap-2 bg-[#f2f3f5] dark:bg-[#202225]  border-r border-[#2f3136]">
      <NavigationAction />
      <Separator className="w-full h-[1px] bg-[#2f3136] my-2" />

      <ScrollArea className="w-full flex-1 items-center p-2">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl ?? ""}
            />
          </div>
        ))}
      </ScrollArea>
      <ModeToggle/>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-[48px] w-[48px]",
          },
        }}
      />
    </div>
  );
};

export default NavigationSideBar;
