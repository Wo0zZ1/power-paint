import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { cn } from "@/utils";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ uuid: number }>;
}) {
  const { uuid } = await params;

  const cookieStore = await cookies();

  const user = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${uuid}`,
    {
      headers: { Cookie: cookieStore.toString() },
    },
  ).then((res) => res.json());

  if (!user || user.error) notFound();

  return <div className={cn("")}>{JSON.stringify(user)}</div>;
}
