import { WebSocketStatus, type HocuspocusProvider } from "@hocuspocus/provider";
import type { Layer } from "konva/lib/Layer";
import type { Line } from "konva/lib/shapes/Line";
import type { Rect } from "konva/lib/shapes/Rect";
import type { Transformer } from "konva/lib/shapes/Transformer";
import type { Stage } from "konva/lib/Stage";
import type * as Y from "yjs";
import { create } from "zustand";

import type { Tool } from "@/shared/constants";

import {
  expandIdsWithGroups,
  getGroupingSelectionState,
} from "../lib/grouping";
import { generateId } from "../lib/utils";
import type {
  ElementType,
  GlobalsState,
  AwarenessMap,
  SelectionType,
  Viewport,
} from "../types";

type ImageUploadStatus = "uploading" | "failed";

type ImageUploadState = {
  status: ImageUploadStatus;
  error?: string;
};

const getMaxZIndex = (elements: Iterable<{ zIndex: number }>) => {
  let maxZIndex = -1;

  for (const element of elements)
    if (getElementZIndex(element) > maxZIndex)
      maxZIndex = getElementZIndex(element);

  return maxZIndex;
};

const getElementZIndex = (element: { zIndex?: number }) =>
  element.zIndex && !Number.isNaN(element.zIndex) ? element.zIndex : 0;

interface BoardState {
  // ── Yjs-ссылки ──
  provider: HocuspocusProvider | null;
  yElements: Y.Map<ElementType> | null;
  yGlobals: Y.Map<unknown> | null;
  undoManager: Y.UndoManager | null;

  // ── Konva Root Elements ──
  stage: Stage | null;
  setStage: (stage: Stage | null) => void;
  contentLayer: Layer | null;
  setContentLayer: (layer: Layer | null) => void;
  transformer: Transformer | null;
  setTransformer: (transformer: Transformer | null) => void;
  selectionRect: Rect | null;
  setSelectionRect: (rect: Rect | null) => void;
  eraserLine: Line | null;
  setEraserLine: (line: Line | null) => void;

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

  imageUploads: Record<string, ImageUploadState>;
  setImageUploadState: (id: string, state: ImageUploadState) => void;
  clearImageUploadState: (id: string) => void;

  // ── Hocuspocus connection status ──
  connectionStatus: WebSocketStatus;
  setConnectionStatus: (status: WebSocketStatus) => void;

  // ── Инструменты ──
  tool: Tool;
  setTool: (tool: Tool) => void;

  currentStrokeColor: string;
  setCurrentStrokeColor: (color: string) => void;

  currentStrokeWidth: number;
  setCurrentStrokeWidth: (width: number) => void;

  currentFillEnabled: boolean;
  setCurrentFillEnabled: (enabled: boolean) => void;

  currentFillColor: string;
  setCurrentFillColor: (color: string) => void;

  // ── Модификаторы (зажатые клавиши) ──
  modifiers: { space: boolean; ctrl: boolean; shift: boolean; alt: boolean };
  setModifiers: (modifiers: {
    space?: boolean;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
  }) => void;

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
  bringToFront: (ids: Set<string>) => void;
  sendToBack: (ids: Set<string>) => void;
  bringForward: (ids: Set<string>) => void;
  sendBackward: (ids: Set<string>) => void;
  groupSelected: () => void;
  ungroupSelected: () => void;

  // ── Действия (пишут в Yjs → observe обновит React-state) ──
  addElement: (el: ElementType) => void;
  addElements: (els: ElementType[]) => void;
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
  contentLayer: null,
  setContentLayer: (layer) => set({ contentLayer: layer }),
  transformer: null,
  setTransformer: (transformer) => set({ transformer }),
  selectionRect: null,
  setSelectionRect: (rect) => set({ selectionRect: rect }),
  eraserLine: null,
  setEraserLine: (line) => set({ eraserLine: line }),

  canUndo: false,
  canRedo: false,
  undo: () => get().undoManager?.undo(),
  redo: () => get().undoManager?.redo(),

  elements: new Map(),
  globals: { backgroundColor: "#ffffff" },
  awareness: new Map(),
  clientID: 0,

  imageUploads: {},
  setImageUploadState: (id, state) =>
    set((current) => ({
      imageUploads: {
        ...current.imageUploads,
        [id]: state,
      },
    })),
  clearImageUploadState: (id) =>
    set((current) => {
      if (!(id in current.imageUploads)) return current;

      const { [id]: _removed, ...rest } = current.imageUploads;
      return { imageUploads: rest };
    }),

  connectionStatus: WebSocketStatus.Connecting,
  setConnectionStatus: (status) => set({ connectionStatus: status }),

  tool: "select",
  setTool: (tool) => set({ tool }),

  currentStrokeColor: "#000000",
  setCurrentStrokeColor: (color) => set({ currentStrokeColor: color }),

  currentStrokeWidth: 5,
  setCurrentStrokeWidth: (width) => set({ currentStrokeWidth: width }),

  currentFillEnabled: false,
  setCurrentFillEnabled: (enabled) => set({ currentFillEnabled: enabled }),

  currentFillColor: "#000000",
  setCurrentFillColor: (color) => set({ currentFillColor: color }),

  modifiers: { space: false, ctrl: false, shift: false, alt: false },
  setModifiers: (modifiers) =>
    set({ modifiers: { ...get().modifiers, ...modifiers } }),

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
      const expandedIds = expandIdsWithGroups(state.elements, new Set([id]));
      expandedIds.forEach((expandedId) => newSelectedIds.add(expandedId));
      return { selectedIds: newSelectedIds };
    }),

  selectMany: (ids) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      const expandedIds = expandIdsWithGroups(state.elements, ids);
      expandedIds.forEach((id) => newSelectedIds.add(id));
      return { selectedIds: newSelectedIds };
    }),

  pureSelect: (id) =>
    set((state) => ({
      selectedIds: expandIdsWithGroups(state.elements, new Set([id])),
    })),

  pureSelectMany: (ids) =>
    set((state) => ({ selectedIds: expandIdsWithGroups(state.elements, ids) })),

  toggleSelect: (id) => {
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      const expandedIds = expandIdsWithGroups(state.elements, new Set([id]));

      const hasAll = Array.from(expandedIds).every((itemId) =>
        newSelectedIds.has(itemId),
      );

      if (hasAll)
        expandedIds.forEach((itemId) => newSelectedIds.delete(itemId));
      else expandedIds.forEach((itemId) => newSelectedIds.add(itemId));

      return { selectedIds: newSelectedIds };
    });
  },

  toggleSelectMany: (ids) => {
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);

      ids.forEach((id) => {
        const expandedIds = expandIdsWithGroups(state.elements, new Set([id]));
        const hasAll = Array.from(expandedIds).every((itemId) =>
          newSelectedIds.has(itemId),
        );

        if (hasAll)
          expandedIds.forEach((itemId) => newSelectedIds.delete(itemId));
        else expandedIds.forEach((itemId) => newSelectedIds.add(itemId));
      });

      return { selectedIds: newSelectedIds };
    });
  },

  deselect: (id) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      const expandedIds = expandIdsWithGroups(state.elements, new Set([id]));
      expandedIds.forEach((itemId) => newSelectedIds.delete(itemId));
      return { selectedIds: newSelectedIds };
    }),

  deselectMany: (ids) =>
    set((state) => {
      const newSelectedIds = new Set(state.selectedIds);
      const expandedIds = expandIdsWithGroups(state.elements, ids);
      expandedIds.forEach((id) => newSelectedIds.delete(id));
      return { selectedIds: newSelectedIds };
    }),

  clearSelection: () => set({ selectedIds: new Set() }),

  bringToFront: (ids) => {
    const { yElements, elements } = get();

    if (!yElements || ids.size === 0) return;

    const effectiveIds = expandIdsWithGroups(elements, ids);
    if (effectiveIds.size === 0) return;

    const orderedElements = Array.from(yElements.values()).sort(
      (a, b) => getElementZIndex(a) - getElementZIndex(b),
    );
    const selectedElements = orderedElements.filter((element) =>
      effectiveIds.has(element.id),
    );
    if (selectedElements.length === 0) return;

    const maxZIndex = orderedElements.reduce(
      (max, element) => Math.max(max, getElementZIndex(element)),
      -Infinity,
    );

    yElements.doc?.transact(() => {
      selectedElements.forEach((element, index) => {
        yElements.set(element.id, {
          ...element,
          zIndex: maxZIndex + 1 + index,
        });
      });
    });
  },

  sendToBack: (ids) => {
    const { yElements, elements } = get();
    if (!yElements || ids.size === 0) return;

    const effectiveIds = expandIdsWithGroups(elements, ids);
    if (effectiveIds.size === 0) return;

    const orderedElements = Array.from(yElements.values()).sort(
      (a, b) => getElementZIndex(a) - getElementZIndex(b),
    );
    const selectedElements = orderedElements.filter((element) =>
      effectiveIds.has(element.id),
    );
    if (selectedElements.length === 0) return;

    const minZIndex = orderedElements.reduce(
      (min, element) => Math.min(min, getElementZIndex(element)),
      Infinity,
    );

    yElements.doc?.transact(() => {
      selectedElements.forEach((element, index) => {
        yElements.set(element.id, {
          ...element,
          zIndex: minZIndex - selectedElements.length + index,
        });
      });
    });
  },

  bringForward: (ids) => {
    const { elements, yElements } = get();
    if (!yElements || ids.size === 0) return;

    const effectiveIds = expandIdsWithGroups(elements, ids);
    if (effectiveIds.size === 0) return;

    const orderedElements = Array.from(elements.values())
      .sort((a, b) => getElementZIndex(a) - getElementZIndex(b))
      .map((element) => ({
        id: element.id,
        zIndex: getElementZIndex(element),
      }));

    const originalZIndexes = new Map(
      orderedElements.map((element) => [element.id, getElementZIndex(element)]),
    );

    for (let index = orderedElements.length - 2; index >= 0; index--) {
      const current = orderedElements[index];
      const next = orderedElements[index + 1];

      if (effectiveIds.has(current.id) && !effectiveIds.has(next.id)) {
        [current.zIndex, next.zIndex] = [next.zIndex, current.zIndex];
        [orderedElements[index], orderedElements[index + 1]] = [
          orderedElements[index + 1],
          orderedElements[index],
        ];
      }
    }

    const updates = new Map<string, Partial<ElementType>>();

    orderedElements.forEach((element) => {
      if (originalZIndexes.get(element.id) !== getElementZIndex(element)) {
        const current = elements.get(element.id);
        if (current)
          updates.set(element.id, {
            ...current,
            zIndex: getElementZIndex(element),
          });
      }
    });

    if (updates.size === 0) return;

    get().updateElements(updates);
  },

  sendBackward: (ids) => {
    const { elements } = get();
    if (ids.size === 0) return;

    const effectiveIds = expandIdsWithGroups(elements, ids);
    if (effectiveIds.size === 0) return;

    const orderedElements = Array.from(elements.values())
      .sort((a, b) => getElementZIndex(a) - getElementZIndex(b))
      .map((element) => ({
        id: element.id,
        zIndex: getElementZIndex(element),
      }));

    const originalZIndexes = new Map(
      orderedElements.map((element) => [element.id, getElementZIndex(element)]),
    );

    for (let index = 1; index < orderedElements.length; index++) {
      const previous = orderedElements[index - 1];
      const current = orderedElements[index];

      if (effectiveIds.has(current.id) && !effectiveIds.has(previous.id)) {
        [current.zIndex, previous.zIndex] = [previous.zIndex, current.zIndex];
        [orderedElements[index - 1], orderedElements[index]] = [
          orderedElements[index],
          orderedElements[index - 1],
        ];
      }
    }

    const updates = new Map<string, Partial<ElementType>>();

    orderedElements.forEach((element) => {
      if (originalZIndexes.get(element.id) !== getElementZIndex(element)) {
        const current = elements.get(element.id);
        if (current)
          updates.set(element.id, {
            ...current,
            zIndex: getElementZIndex(element),
          });
      }
    });

    if (updates.size === 0) return;

    get().updateElements(updates);
  },

  groupSelected: () => {
    const { selectedIds, elements, yElements } = get();
    if (!yElements) return;

    const groupingState = getGroupingSelectionState(elements, selectedIds);
    if (!groupingState.canGroup) return;

    const groupId = generateId();

    yElements.doc?.transact(() => {
      selectedIds.forEach((id) => {
        const current = yElements.get(id);
        if (!current) return;

        yElements.set(id, {
          ...current,
          groupId,
        });
      });
    });

    set({ selectedIds: new Set(selectedIds) });
  },

  ungroupSelected: () => {
    const { selectedIds, elements, yElements } = get();
    if (!yElements || selectedIds.size === 0) return;

    const groupingState = getGroupingSelectionState(elements, selectedIds);
    if (!groupingState.canUngroup) return;

    yElements.doc?.transact(() => {
      yElements.forEach((element, id) => {
        if (
          !element.groupId ||
          !groupingState.selectedGroupIds.has(element.groupId)
        )
          return;

        const { groupId: _groupId, ...rest } = element;
        yElements.set(id, rest as ElementType);
      });
    });
  },

  updateViewport: (updates) =>
    set((state) => ({ viewport: { ...state.viewport, ...updates } })),

  addElement: (el) => {
    const yElements = get().yElements;
    if (!yElements) return;

    const maxZIndex = getMaxZIndex(yElements.values());

    yElements.set(el.id, { ...el, zIndex: maxZIndex + 1 });
  },

  addElements: (els) => {
    const yElements = get().yElements;
    if (!yElements) return;

    const maxZIndex = getMaxZIndex(yElements.values());

    yElements.doc?.transact(() => {
      els.forEach((el, index) =>
        yElements.set(el.id, { ...el, zIndex: maxZIndex + 1 + index }),
      );
    });
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
    const { selectedIds, yElements, elements } = get();
    if (!yElements || selectedIds.size === 0) return;

    const effectiveIds = expandIdsWithGroups(elements, selectedIds);
    if (effectiveIds.size === 0) return;

    yElements.doc?.transact(() => {
      effectiveIds.forEach((id) => yElements.delete(id));
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
      imageUploads: {},
    }),
}));
