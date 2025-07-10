import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModel from "@/components/modals/initial-model";

const SetupPage = async () => {
  const profile = await initialProfile();

  if (!profile) {
    return (
      <div>
        <p>Profile not found. Please create a profile first.</p>
      </div>
    );
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    redirect(`/servers/${server.id}`);
  }

  return (
    <div>
      <InitialModel />
    </div>
  );
};

export default SetupPage;
