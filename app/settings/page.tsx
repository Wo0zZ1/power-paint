import { notFound } from "next/navigation";

import { cn } from "@/utils";

import { auth } from "@/shared/auth";

export default async function SettingsPage() {
  const [session] = await Promise.all([auth()]);

  if (!session) {
    notFound();
  }

  return (
    <div className={cn("")}>
      <h1 className="text-3xl">Settings</h1>
    </div>
  );
}
