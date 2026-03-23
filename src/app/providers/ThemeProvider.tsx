import type { PropsWithChildren } from "react";

import { useTheme } from "@/shared/lib/theme";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  useTheme();

  return children;
};
