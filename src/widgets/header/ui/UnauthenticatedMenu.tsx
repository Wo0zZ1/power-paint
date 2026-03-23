import { LoginButton } from "./LoginButton";
import { SettingsButton } from "./SettingsButton";

export async function UnauthenticatedMenu() {
  return (
    <div className="flex items-center gap-6">
      <SettingsButton />

      <LoginButton />
    </div>
  );
}
