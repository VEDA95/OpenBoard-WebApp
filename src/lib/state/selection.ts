import { create } from "zustand";

export interface SelectionState {
  selectedCardIds: Set<string>;
  toggleCardSelection: (cardId: string) => void;
  clearCardSelection: () => void;
  selectCards: (cardIds: Array<string>) => void;
}

export const useSelectionState = create<SelectionState>({
  selectedCardIds: new Set(),
  toggleCardSelection: (cardId) =>
    set((state) => {
      const newSelected = new Set(state.selectedCardIds);
      if (newSelected.has(cardId)) {
        newSelected.delete(cardId);
      } else {
        newSelected.add(cardId);
      }
      return { selectedCardIds: newSelected };
    }),
  clearCardSelection: () => set({ selectedCardIds: new Set() }),
  selectCards: (cardIds) => set({ selectedCardIds: new Set(cardIds) }),
});
