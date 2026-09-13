import type { TailwindConfig } from "@react-email/components";
import { pixelBasedPreset } from "@react-email/components";

export const tailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: ["Courier New", "monospace"],
      },
      colors: {
        // Primary & Secondary
        background: "#ffffff",
        foreground: "#000000",
        primary: "#1a1a1a",
        "primary-foreground": "#ffffff",
        secondary: "#f5f5f5",
        "secondary-foreground": "#1a1a1a",

        // Semantic
        accent: "#f5f5f5",
        "accent-foreground": "#1a1a1a",
        muted: "#f5f5f5",
        "muted-foreground": "#8d8d8d",
        destructive: "#d32f2f",

        // UI
        border: "#e8e8e8",
        input: "#e8e8e8",
        ring: "#b3b3b3",

        // Legacy
        brand: "#007291",
      },
    },
  },
} satisfies TailwindConfig;
