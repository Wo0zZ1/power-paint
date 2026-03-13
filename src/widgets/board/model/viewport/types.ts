export type Viewport = {
  scale: number;
  x: number;
  y: number;
};

export type ViewportAction = {
  type: "zoom" | "pan" | "reset";
  payload?: Partial<Viewport>;
};
