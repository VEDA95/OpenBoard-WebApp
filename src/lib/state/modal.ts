import { create } from "zustand";
import type { Card, List } from "@appTypes/board";

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

export const useModalState = create<ModalState>({
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
    set((state) => ({
      modal: { ...state.modal, cardDetailOpen: true, cardDetailId: cardId },
    })),
  closeCardDetail: () =>
    set((state) => ({
      modal: { ...state.modal, cardDetailOpen: false, cardDetailId: null },
    })),
  openCreateList: () =>
    set((state) => ({
      modal: { ...state.modal, createListOpen: true },
    })),
  closeCreateList: () =>
    set((state) => ({
      modal: { ...state.modal, createListOpen: false },
    })),
  openCreateCard: (listId) =>
    set((state) => ({
      modal: { ...state.modal, createCardListId: listId },
    })),
  closeCreateCard: () =>
    set((state) => ({
      modal: { ...state.modal, createCardListId: null },
    })),
  openCreateWorkspace: () =>
    set((state) => ({
      modal: { ...state.modal, createWorkspaceOpen: true },
    })),
  closeCreateWorkspace: () =>
    set((state) => ({
      modal: { ...state.modal, createWorkspaceOpen: false },
    })),
  openCreateBoard: (workspaceId) =>
    set((state) => ({
      modal: {
        ...state.modal,
        createBoardOpen: true,
        createBoardWorkspaceId: workspaceId,
      },
    })),
  closeCreateBoard: () =>
    set((state) => ({
      modal: {
        ...state.modal,
        createBoardOpen: false,
        createBoardWorkspaceId: null,
      },
    })),
  openEditLabel: (labelId) =>
    set((state) => ({
      modal: { ...state.modal, editLabelOpen: true, editLabelId: labelId },
    })),
  closeEditLabel: () =>
    set((state) => ({
      modal: { ...state.modal, editLabelOpen: false, editLabelId: null },
    })),
  openDeleteConfirm: (type, id) =>
    set((state) => ({
      modal: {
        ...state.modal,
        deleteConfirmOpen: true,
        deleteConfirmType: type,
        deleteConfirmId: id,
      },
    })),
  closeDeleteConfirm: () =>
    set((state) => ({
      modal: {
        ...state.modal,
        deleteConfirmOpen: false,
        deleteConfirmType: null,
        deleteConfirmId: null,
      },
    })),
});
