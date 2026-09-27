"use client";

import { useCallback } from "react";

import { useLocalStorage } from "@/shared/lib/hooks";

export type BoardPreferences = {
  showCursors: boolean;
  showOffscreenCursors: boolean;
};

export const BOARD_PREFERENCES_STORAGE_KEY = "boardPreferences";

const DEFAULTS: BoardPreferences = {
  showCursors: true,
  showOffscreenCursors: true,
};

export const useBoardPreferences = () => {
  const [prefs, setPrefs] = useLocalStorage<BoardPreferences>(
    BOARD_PREFERENCES_STORAGE_KEY,
    DEFAULTS,
  );

  const setShowCursors = useCallback(
    (v: boolean) => setPrefs((p) => ({ ...p, showCursors: v })),
    [setPrefs],
  );

  const setShowOffscreen = useCallback(
    (v: boolean) => setPrefs((p) => ({ ...p, showOffscreenCursors: v })),
    [setPrefs],
  );

  return {
    prefs,
    setPrefs,
    showCursors: prefs.showCursors,
    showOffscreenCursors: prefs.showOffscreenCursors,
    setShowCursors,
    setShowOffscreen,
  };
};

export default useBoardPreferences;
