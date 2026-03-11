import { create } from "zustand";

export interface ModalState {
  cardDetailOpen: boolean;
  cardDetailId: string | null;
  createListOpen: boolean;
  createCardListId: string | null;
  createWorkspaceOpen: boolean;
  createBoardOpen: boolean;
  createBoardWorkspaceId: string | null;
  editLabelOpen: boolean;
  editLabelId: string | null;
  deleteConfirmOpen: boolean;
  deleteConfirmType: "card" | "list" | "board" | "workspace" | null;
  deleteConfirmId: string | null;
  openCardDetail: (cardId: string) => void;
  closeCardDetail: () => void;
  openCreateList: () => void;
  closeCreateList: () => void;
  openCreateCard: (listId: string) => void;
  closeCreateCard: () => void;
  openCreateWorkspace: () => void;
  closeCreateWorkspace: () => void;
  openCreateBoard: (workspaceId: string) => void;
  closeCreateBoard: () => void;
  openEditLabel: (labelId: string | null) => void;
  closeEditLabel: () => void;
  openDeleteConfirm: (
    type: ModalState["deleteConfirmType"],
    id: string,
  ) => void;
  closeDeleteConfirm: () => void;
}

export const useModalState = create<ModalState>((set) => ({
  cardDetailOpen: false,
  cardDetailId: null,
  createListOpen: false,
  createCardListId: null,
  createWorkspaceOpen: false,
  createBoardOpen: false,
  createBoardWorkspaceId: null,
  editLabelOpen: false,
  editLabelId: null,
  deleteConfirmOpen: false,
  deleteConfirmType: null,
  deleteConfirmId: null,
  openCardDetail: (cardId) =>
    set({ cardDetailOpen: true, cardDetailId: cardId }),
  closeCardDetail: () =>
    set({ cardDetailOpen: false, cardDetailId: null }),
  openCreateList: () =>
    set({ createListOpen: true }),
  closeCreateList: () =>
    set({ createListOpen: false }),
  openCreateCard: (listId) =>
    set({ createCardListId: listId }),
  closeCreateCard: () =>
    set({ createCardListId: null }),
  openCreateWorkspace: () =>
    set({ createWorkspaceOpen: true }),
  closeCreateWorkspace: () =>
    set({ createWorkspaceOpen: false }),
  openCreateBoard: (workspaceId) =>
    set({ createBoardOpen: true, createBoardWorkspaceId: workspaceId }),
  closeCreateBoard: () =>
    set({ createBoardOpen: false, createBoardWorkspaceId: null }),
  openEditLabel: (labelId) =>
    set({ editLabelOpen: true, editLabelId: labelId }),
  closeEditLabel: () =>
    set({ editLabelOpen: false, editLabelId: null }),
  openDeleteConfirm: (type, id) =>
    set({ deleteConfirmOpen: true, deleteConfirmType: type, deleteConfirmId: id }),
  closeDeleteConfirm: () =>
    set({ deleteConfirmOpen: false, deleteConfirmType: null, deleteConfirmId: null }),
}));
