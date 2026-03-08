import { create } from "zustand";
import type { Card, List } from "@appTypes/board";

export interface DragState {
  activeCard: Card | null;
  activeList: List | null;
  overListId: string | null;
  overCardId: string | null;
  setActiveCard: (card: Card | null) => void;
  setActiveList: (list: List | null) => void;
  setOverListId: (id: string | null) => void;
  setOverCardId: (id: string | null) => void;
  resetDragState: () => void;
}

export const useDragState = create<DragState>(
  (set): DragState => ({
    activeCard: null,
    activeList: null,
    overListId: null,
    overCardId: null,
    setActiveCard: (card: Card | null): void =>
      set((state: DragState): DragState => ({ ...state, activeCard: card })),
    setActiveList: (list: List | null): void =>
      set((state: DragState): DragState => ({ ...state, activeList: list })),
    setOverListId: (id: string | null): void =>
      set((state: DragState): DragState => ({ ...state, overListId: id })),
    setOverCardId: (id: string | null): void =>
      set((state: DragState): DragState => ({ ...state, overCardId: id })),
    resetDragState: (): void =>
      set(
        (state: DragState): DragState => ({
          ...state,
          activeCard: null,
          activeList: null,
          overListId: null,
          overCardId: null,
        }),
      ),
  }),
);
