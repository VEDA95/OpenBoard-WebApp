import type { APIResponse } from '@appTypes/response';
import type {
  ChecklistItemResponse,
  CreateChecklistItemPayload,
  UpdateChecklistItemPayload,
} from '@appTypes/board';

const API_BASE = 'http://localhost:8080';

export async function getChecklistItems(): Promise<APIResponse<ChecklistItemResponse[]>> {
  const response = await fetch(`${API_BASE}/checklist-items`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getChecklistItemsByCard(cardId: string): Promise<APIResponse<ChecklistItemResponse[]>> {
  const response = await fetch(`${API_BASE}/checklist-items?card_id=${cardId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getChecklistItem(id: string): Promise<APIResponse<ChecklistItemResponse>> {
  const response = await fetch(`${API_BASE}/checklist-items/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function createChecklistItem(data: CreateChecklistItemPayload): Promise<APIResponse<ChecklistItemResponse>> {
  const response = await fetch(`${API_BASE}/checklist-items`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateChecklistItem(id: string, data: UpdateChecklistItemPayload): Promise<APIResponse<ChecklistItemResponse>> {
  const response = await fetch(`${API_BASE}/checklist-items/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteChecklistItem(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await fetch(`${API_BASE}/checklist-items/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function reorderChecklistItems(cardId: string, itemIds: string[]): Promise<APIResponse<{ message: string }>> {
  const response = await fetch(`${API_BASE}/checklist-items/card/${cardId}/reorder`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ item_ids: itemIds }),
  });
  return await response.json();
}
