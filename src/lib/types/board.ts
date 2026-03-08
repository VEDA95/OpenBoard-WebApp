import type { User, UserResponse } from "@appTypes/user";

// Base types
export type Base = {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type BaseResponse = {
  id: string;
  created_at: string;
  updated_at: string | null;
};

// Workspace
export type Workspace = Base & {
  name: string;
  description: string | null;
  isPublic: boolean;
  user: string;
  boards?: Board[];
};

export type WorkspaceResponse = BaseResponse & {
  name: string;
  description: string | null;
  is_public: boolean;
  user?: UserResponse;
  boards?: BoardResponse[];
};

export type CreateWorkspacePayload = {
  name: string;
  description?: string;
  is_public?: boolean;
};

export type UpdateWorkspacePayload = Partial<CreateWorkspacePayload>;

// Board
export type Board = Base & {
  name: string;
  isPublic: boolean;
  user?: User;
  workspace?: Workspace;
  lists?: List[];
};

export type BoardResponse = BaseResponse & {
  name: string;
  is_public: boolean;
  user?: UserResponse;
  workspace?: WorkspaceResponse;
  lists?: ListResponse[];
};

export type CreateBoardPayload = {
  name: string;
  workspace_id: string;
  is_public?: boolean;
};

export type UpdateBoardPayload = {
  name?: string;
  is_public?: boolean;
};

// List
export type List = Base & {
  name: string;
  color: string | null;
  position: number;
  board?: Board;
  cards?: Card[];
};

export type ListResponse = BaseResponse & {
  name: string;
  color: string | null;
  position: number;
  board?: BoardResponse;
  cards?: CardResponse[];
};

export type CreateListPayload = {
  name: string;
  board_id: string;
  color?: string;
  position?: number;
};

export type UpdateListPayload = {
  name?: string;
  color?: string;
  position?: number;
};

export type ReorderListsPayload = {
  list_ids: string[];
};

// Card
export type Card = Base & {
  name: string;
  description: string | null;
  color: string | null;
  position: number;
  reminderDate: Date | null;
  dueDate: Date | null;
  timeSpent: number | null;
  estimatedTimeSpent: number | null;
  isActive: boolean;
  list?: List;
  comments?: Comment[];
  labels?: Label[];
  checklistItems?: ChecklistItem[];
};

export type CardResponse = BaseResponse & {
  name: string;
  description: string | null;
  color: string | null;
  position: number;
  reminder_date: string | null;
  due_date: string | null;
  time_spent: number | null;
  estimated_time_spent: number | null;
  is_active: boolean;
  list?: ListResponse;
  comments?: CommentResponse[];
  labels?: LabelResponse[];
  checklist_items?: ChecklistItemResponse[];
};

export type CreateCardPayload = {
  name: string;
  list_id: string;
  description?: string;
  color?: string;
  position?: number;
  reminder_date?: string;
  due_date?: string;
  estimated_time_spent?: number;
};

export type UpdateCardPayload = {
  name?: string;
  description?: string;
  color?: string;
  position?: number;
  reminder_date?: string;
  due_date?: string;
  time_spent?: number;
  estimated_time_spent?: number;
  is_active?: boolean;
};

export type MoveCardPayload = {
  list_id: string;
  position: number;
};

// Label
export type Label = Base & {
  name: string;
  color: string;
  board?: Board;
};

export type LabelResponse = BaseResponse & {
  name: string;
  color: string;
  board?: BoardResponse;
};

export type CreateLabelPayload = {
  name: string;
  color: string;
  board_id: string;
};

export type UpdateLabelPayload = {
  name?: string;
  color?: string;
};

// Comment
export type Comment = Base & {
  comment: string;
  user?: User;
  card?: Card;
};

export type CommentResponse = BaseResponse & {
  comment: string;
  user?: UserResponse;
  card?: CardResponse;
};

export type CreateCommentPayload = {
  comment: string;
  card_id: string;
};

export type UpdateCommentPayload = {
  comment: string;
};

// Checklist Item
export type ChecklistItem = Base & {
  name: string;
  isChecked: boolean;
  position: number;
  card?: Card;
};

export type ChecklistItemResponse = BaseResponse & {
  name: string;
  is_checked: boolean;
  position: number;
  card?: CardResponse;
};

export type CreateChecklistItemPayload = {
  name: string;
  card_id: string;
  position?: number;
};

export type UpdateChecklistItemPayload = {
  name?: string;
  is_checked?: boolean;
  position?: number;
};

// Transform functions
export function transformWorkspace(data: WorkspaceResponse): Workspace {
  return {
    id: data.id,
    createdAt: new Date(data.created_at),
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    name: data.name,
    description: data.description,
    isPublic: data.is_public,
    boards: data.boards?.map(transformBoard),
  };
}

export function transformBoard(data: BoardResponse): Board {
  return {
    id: data.id,
    createdAt: new Date(data.created_at),
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    name: data.name,
    isPublic: data.is_public,
    lists: data.lists?.map(transformList),
  };
}

export function transformList(data: ListResponse): List {
  return {
    id: data.id,
    createdAt: new Date(data.created_at),
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    name: data.name,
    color: data.color,
    position: data.position,
    cards: data.cards?.map(transformCard),
  };
}

export function transformCard(data: CardResponse): Card {
  return {
    id: data.id,
    createdAt: new Date(data.created_at),
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    name: data.name,
    description: data.description,
    color: data.color,
    position: data.position,
    reminderDate: data.reminder_date ? new Date(data.reminder_date) : null,
    dueDate: data.due_date ? new Date(data.due_date) : null,
    timeSpent: data.time_spent,
    estimatedTimeSpent: data.estimated_time_spent,
    isActive: data.is_active,
    comments: data.comments?.map(transformComment),
    labels: data.labels?.map(transformLabel),
    checklistItems: data.checklist_items?.map(transformChecklistItem),
  };
}

export function transformLabel(data: LabelResponse): Label {
  return {
    id: data.id,
    createdAt: new Date(data.created_at),
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    name: data.name,
    color: data.color,
  };
}

export function transformComment(data: CommentResponse): Comment {
  return {
    id: data.id,
    createdAt: new Date(data.created_at),
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    comment: data.comment,
  };
}

export function transformChecklistItem(
  data: ChecklistItemResponse,
): ChecklistItem {
  return {
    id: data.id,
    createdAt: new Date(data.created_at),
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
    name: data.name,
    isChecked: data.is_checked,
    position: data.position,
  };
}
