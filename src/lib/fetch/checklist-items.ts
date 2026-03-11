import { apiClient } from './client';
import type { APIResponse } from '@appTypes/response';
import type {
  ChecklistItemResponse,
  CreateChecklistItemPayload,
  UpdateChecklistItemPayload,
} from '@appTypes/board';

export async function getChecklistItems(): Promise<APIResponse<ChecklistItemResponse[]>> {
  const response = await apiClient.get('/api/check_list_items', {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getChecklistItemsByCard(cardId: string): Promise<APIResponse<ChecklistItemResponse[]>> {
  const response = await apiClient.get(`/api/check_list_items?card_id=${cardId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getChecklistItem(id: string): Promise<APIResponse<ChecklistItemResponse>> {
  const response = await apiClient.get(`/api/check_list_items/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function createChecklistItem(data: CreateChecklistItemPayload): Promise<APIResponse<ChecklistItemResponse>> {
  const response = await apiClient.post('/api/check_list_items', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateChecklistItem(id: string, data: UpdateChecklistItemPayload): Promise<APIResponse<ChecklistItemResponse>> {
  const response = await apiClient.patch(`/api/check_list_items/${id}`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteChecklistItem(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await apiClient.delete(`/api/check_list_items/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}
