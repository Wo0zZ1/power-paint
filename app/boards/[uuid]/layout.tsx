import type { ReactNode } from "react";

export default async function BoardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
