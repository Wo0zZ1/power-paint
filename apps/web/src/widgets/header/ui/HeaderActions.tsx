import { auth } from "@/shared/auth";

import { AuthenticatedMenu } from "./AuthenticatedMenu";
import { UnauthenticatedMenu } from "./UnauthenticatedMenu";

export async function HeaderActions() {
  const session = await auth();

  if (!session) return <UnauthenticatedMenu />;

  return <AuthenticatedMenu session={session} />;
}
