import { WebSocketStatus, type HocuspocusProvider } from "@hocuspocus/provider";
import type { Stage } from "konva/lib/Stage";
import type * as Y from "yjs";
import { create } from "zustand";

import type { Tool } from "@/shared/constants";

import type {
  ElementType,
  GlobalsState,
  AwarenessMap,
  SelectionType,
  Viewport,
} from "../types";

interface BoardState {
  // ── Yjs-ссылки ──
  provider: HocuspocusProvider | null;
  yElements: Y.Map<ElementType> | null;
  yGlobals: Y.Map<unknown> | null;
  undoManager: Y.UndoManager | null;

  // ── Konva Stage ──
  stage: Stage | null;
  setStage: (stage: Stage | null) => void;

  // ── Undo / Redo ──
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  // ── React-состояние (обновляется через Yjs observe) ──
  elements: Map<string, ElementType>;
  globals: GlobalsState;
  awareness: AwarenessMap;
  clientID: number;

  // ── Hocuspocus connection status ──
  connectionStatus: WebSocketStatus;
  setConnectionStatus: (status: WebSocketStatus) => void;

  // ── Инструменты ──
  tool: Tool;
  setTool: (tool: Tool) => void;

  // ── Модификаторы (зажатые клавиши) ──
  modifiers: { space: boolean; ctrl: boolean; shift: boolean };

  // ── Viewport ──
  viewport: Viewport;
  updateViewport: (updates: Partial<Viewport>) => void;

  // ── Действия ──
  selectionType: SelectionType;
  setSelectionType: (type: SelectionType) => void;
  selectedIds: Set<string>;
  select: (id: string) => void;
  selectMany: (ids: Set<string>) => void;
  pureSelect: (id: string) => void;
  pureSelectMany: (ids: Set<string>) => void;
  toggleSelect: (id: string) => void;
  toggleSelectMany: (ids: Set<string>) => void;
  deselect: (id: string) => void;
  deselectMany: (ids: Set<string>) => void;
  clearSelection: () => void;

  // ── Действия (пишут в Yjs → observe обновит React-state) ──
  addElement: (el: ElementType) => void;
  updateElement: <T extends Partial<ElementType>>(
    id: string,
    changes: Partial<T>,
  ) => void;
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

  stage: null,
  setStage: (stage) => set({ stage }),

  canUndo: false,
  canRedo: false,
  undo: () => get().undoManager?.undo(),
  redo: () => get().undoManager?.redo(),

  elements: new Map(),
  globals: { backgroundColor: "#ffffff" },
  awareness: new Map(),
  clientID: 0,

  connectionStatus: WebSocketStatus.Connecting,
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  tool: "select",

  modifiers: { space: false, ctrl: false, shift: false },

  viewport: {
    x: 0,
    y: 0,
    scale: 1,
  },

  selectionType: "none",

  setSelectionType: (type) => set({ selectionType: type }),

  selectedIds: new Set(),

  select: (id) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      newSelectedIds.add(id);
      return { selectedIds: newSelectedIds };
    }),

  selectMany: (ids) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      ids.forEach((id) => newSelectedIds.add(id));
      return { selectedIds: newSelectedIds };
    }),

  pureSelect: (id) => set({ selectedIds: new Set([id]) }),

  pureSelectMany: (ids) => set({ selectedIds: new Set(ids) }),

  toggleSelect: (id) => {
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      if (newSelectedIds.has(id)) newSelectedIds.delete(id);
      else newSelectedIds.add(id);

      return { selectedIds: newSelectedIds };
    });
  },

  toggleSelectMany: (ids) => {
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      ids.forEach((id) => {
        if (newSelectedIds.has(id)) newSelectedIds.delete(id);
        else newSelectedIds.add(id);
      });
      return { selectedIds: newSelectedIds };
    });
  },

  deselect: (id) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      newSelectedIds.delete(id);
      return { selectedIds: newSelectedIds };
    }),

  deselectMany: (ids) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      ids.forEach((id) => newSelectedIds.delete(id));
      return { selectedIds: newSelectedIds };
    }),

  clearSelection: () => set({ selectedIds: new Set() }),

  setTool: (tool) => set({ tool }),

  updateViewport: (updates) =>
    set((state) => ({ viewport: { ...state.viewport, ...updates } })),

  addElement: (el) => {
    get().yElements?.set(el.id, el);
  },

  updateElement: (id, changes) => {
    const yElements = get().yElements;
    const current = yElements?.get(id);
    if (!current) return;
    yElements!.set(id, { ...current, ...changes });
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
      awareness: new Map(),
    }),
}));
