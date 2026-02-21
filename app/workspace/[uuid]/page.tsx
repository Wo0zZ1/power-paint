import { notFound } from "next/navigation";

import { prisma } from "@/shared/lib/prisma";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const workspace = await prisma.workspace.findFirst({
    where: { id: uuid },
  });

  if (!workspace) notFound();

  // check rights

  // if (!hasAccess) redirect(ROUTES.DASHBOARD.ROOT);
}
