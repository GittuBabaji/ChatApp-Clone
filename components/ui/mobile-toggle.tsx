import React from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import  NavigationSidebar  from "@/components/nav/Navigation-bar";
import  {ServerSideBar}  from "@/components/side-bar/server-side-bar";

export function MobileToggle({ serverId }: { serverId: string }) {
  return (
    <Sheet>
      
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
                <SheetTitle className="sr-only">Navigation Sidebar</SheetTitle>

        <div className="w-[72px]">

          <NavigationSidebar />
        </div>
        <ServerSideBar  serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}
