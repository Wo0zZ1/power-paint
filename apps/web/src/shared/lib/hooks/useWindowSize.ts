import { useWindowSizeStore } from "@/shared/store";

export const useWindowSize = () => {
  const width = useWindowSizeStore((state) => state.width);
  const height = useWindowSizeStore((state) => state.height);

  return { width, height };
};
