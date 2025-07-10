import { getCurrentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ServerSideBar } from "@/components/side-bar/server-side-bar";
import { ClientWrapper } from "@/components/ClientWrappen";
export default async function ServerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) {
  const { serverId } = params;
  const profile = await getCurrentProfile();

  if (!profile) return redirect("/sign-in");

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      members: {
        where: { profileId: profile.id },
      },
    },
  });

  if (!server || server.members.length === 0) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <ClientWrapper>
        <div className="flex h-full w-60 flex-col fixed inset-y-0 z-50">
          <ServerSideBar serverId={serverId} />
        </div>
      </ClientWrapper>

      <div className="h-full md:pl-60">
        <main>{children}</main>
      </div>
    </div>
  );
}
