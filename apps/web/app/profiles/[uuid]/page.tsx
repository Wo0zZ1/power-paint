import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getQueryClient } from "@/shared/api";
import { getSession } from "@/shared/session/server";
import type { PublicUser } from "@/shared/types";

import { getUserQueryOption } from "@/entities/user/server";

import { UserProfile } from "@/widgets/user-profile";

export const metadata: Metadata = {
  title: "Profile",
  description: "Power Paint user profile",
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const [{ uuid }, cookieStore, session] = await Promise.all([
    params,
    cookies(),
    getSession(),
  ]);

  const queryClient = getQueryClient();

  let user: PublicUser;

  try {
    user = await queryClient.fetchQuery(
      getUserQueryOption({
        userId: uuid,
        cookieString: cookieStore.toString(),
      }),
    );
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-col grow container mx-auto my-8 px-4">
      <UserProfile user={user} isOwn={session?.id === user.id} />
    </div>
  );
}
