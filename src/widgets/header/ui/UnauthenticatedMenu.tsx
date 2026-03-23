import { LoginButton } from "./LoginButton";
import { SettingsButton } from "./SettingsButton";

export async function UnauthenticatedMenu() {
  return (
    <div className="flex items-center gap-4 xs:gap-6">
      <SettingsButton />

      <LoginButton />
    </div>
  );
}
