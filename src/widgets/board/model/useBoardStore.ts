import type { HocuspocusProvider } from "@hocuspocus/provider";
import type * as Y from "yjs";
import { create } from "zustand";

import type {
  ElementType,
  GlobalsState,
  RemoteCursorsMap,
  Tool,
  Viewport,
} from "./types";

interface BoardState {
  // ── Yjs-ссылки (устанавливаются один раз при подключении) ──
  provider: HocuspocusProvider | null;
  yElements: Y.Map<ElementType> | null;
  yGlobals: Y.Map<unknown> | null;
  undoManager: Y.UndoManager | null;

  // ── Undo / Redo ──
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  // ── React-состояние (обновляется через Yjs observe) ──
  elements: Map<string, ElementType>;
  globals: GlobalsState;
  remoteCursors: RemoteCursorsMap;

  // ── Инструменты ──
  tool: Tool;
  setTool: (tool: Tool) => void;

  // ── Модификаторы (зажатые клавиши) ──
  modifiers: { space: boolean; ctrl: boolean; shift: boolean };

  // ── Viewport ──
  viewport: Viewport;
  updateViewport: (updates: Partial<Viewport>) => void;
  resetViewport: () => void;

  // ── Действия ──
  selectedIds: Set<string>;
  select: (id: string) => void;
  pureSelect: (id: string) => void;
  toggleSelect: (id: string) => void;
  deselect: (id: string) => void;
  pureSelectMany: (ids: Set<string>) => void;
  clearSelection: () => void;

  // ── Действия (пишут в Yjs → observe обновит React-state) ──
  addElement: (el: ElementType) => void;
  updateElement: (id: string, changes: Partial<ElementType>) => void;
  updateElements: (updates: Map<string, Partial<ElementType>>) => void;
  removeElement: (id: string) => void;
  removeSelectedElements: () => void;
  setGlobal: (key: string, value: unknown) => void;
  reset: () => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  provider: null,
  yElements: null,
  yGlobals: null,
  undoManager: null,

  canUndo: false,
  canRedo: false,
  undo: () => get().undoManager?.undo(),
  redo: () => get().undoManager?.redo(),

  elements: new Map(),
  globals: { backgroundColor: "#ffffff" },
  remoteCursors: new Map(),

  tool: "select",

  modifiers: { space: false, ctrl: false, shift: false },

  viewport: {
    x: 0,
    y: 0,
    scale: 1,
  },

  selectedIds: new Set(),

  select: (id) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      newSelectedIds.add(id);
      return { selectedIds: newSelectedIds };
    }),

  pureSelect: (id) => set({ selectedIds: new Set([id]) }),

  toggleSelect: (id) => {
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      if (newSelectedIds.has(id)) newSelectedIds.delete(id);
      else newSelectedIds.add(id);

      return { selectedIds: newSelectedIds };
    });
  },

  deselect: (id) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      newSelectedIds.delete(id);
      return { selectedIds: newSelectedIds };
    }),

  pureSelectMany: (ids) => set({ selectedIds: new Set(ids) }),

  clearSelection: () => set({ selectedIds: new Set() }),

  setTool: (tool) => set({ tool }),

  updateViewport: (updates) =>
    set((state) => ({ viewport: { ...state.viewport, ...updates } })),

  resetViewport: () => set({ viewport: { x: 0, y: 0, scale: 1 } }),

  addElement: (el) => {
    get().yElements?.set(el.id, el);
  },

  updateElement: (id, changes) => {
    const yElements = get().yElements;
    const current = yElements?.get(id);
    if (!current) return;
    yElements!.set(id, { ...current, ...changes } as ElementType);
  },

  updateElements: (updates) => {
    const yElements = get().yElements;
    if (!yElements) return;

    yElements.doc?.transact(() => {
      updates.forEach((changes, id) => {
        const current = yElements.get(id);
        if (!current) return;
        yElements.set(id, { ...current, ...changes } as ElementType);
      });
    });
  },

  removeElement: (id) => {
    get().yElements?.delete(id);
    get().deselect(id);
  },

  removeSelectedElements: () => {
    const { selectedIds, yElements } = get();
    if (!yElements || selectedIds.size === 0) return;

    yElements.doc?.transact(() => {
      selectedIds.forEach((id) => yElements.delete(id));
    });

    set({ selectedIds: new Set() });
  },

  setGlobal: (key, value) => {
    get().yGlobals?.set(key, value);
  },

  reset: () =>
    set({
      provider: null,
      yElements: null,
      yGlobals: null,
      undoManager: null,
      canUndo: false,
      canRedo: false,
      elements: new Map(),
      globals: { backgroundColor: "#ffffff" },
      remoteCursors: new Map(),
    }),
}));
