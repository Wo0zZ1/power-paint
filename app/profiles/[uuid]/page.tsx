import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { fetchInitWithCookies, GET_BASE_API_URL } from "@/shared/api";

const url = GET_BASE_API_URL() + "/users";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ uuid: number }>;
}) {
  const [{ uuid }, cookieStore] = await Promise.all([params, cookies()]);

  const cookieString = cookieStore.toString();

  const user = await fetch(
    `${url}/${uuid}`,
    fetchInitWithCookies(cookieString),
  ).then((res) => res.json());

  if (!user || user.error) notFound();

  return <div>{JSON.stringify(user)}</div>;

  // TODO implement

  // const queryClient = getQueryClient();

  // let userProfile: unknown;

  // try {
  //   userProfile = await queryClient.fetchQuery(
  //     getProfileQueryOption({
  //       profileId: uuid,
  //       cookieString: cookieStore.toString(),
  //     }),
  //   );
  // } catch {
  //   notFound();
  // }
}
