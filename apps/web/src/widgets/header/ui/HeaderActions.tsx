import { getSession } from "@/shared/session/server";

import { AuthenticatedMenu } from "./AuthenticatedMenu";
import { UnauthenticatedMenu } from "./UnauthenticatedMenu";

export async function HeaderActions() {
  const user = await getSession();

  if (!user) return <UnauthenticatedMenu />;

  return <AuthenticatedMenu user={user} />;
}
