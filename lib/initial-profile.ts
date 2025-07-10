import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  const { userId } = await  auth(); 

  if (!userId) {
    return redirect("/sign-in");
  }

  
  let profile = await db.profile.findUnique({
    where: { userId },
  });

  if (profile) {
    return profile;
  }

  
  const clerkUser = await clerkClient.users.getUser(userId);

  profile = await db.profile.create({
    data: {
      userId,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      imageUrl: clerkUser.imageUrl,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
    },
  });

  return profile;
};
