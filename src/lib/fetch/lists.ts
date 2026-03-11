import { apiClient } from './client';
import type { APIResponse } from '@appTypes/response';
import type {
  ListResponse,
  CreateListPayload,
  UpdateListPayload,
} from '@appTypes/board';

export async function getLists(): Promise<APIResponse<ListResponse[]>> {
  const response = await apiClient.get('/api/lists', {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getListsByBoard(boardId: string): Promise<APIResponse<ListResponse[]>> {
  const response = await apiClient.get(`/api/lists?board_id=${boardId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getList(id: string): Promise<APIResponse<ListResponse>> {
  const response = await apiClient.get(`/api/lists/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function createList(data: CreateListPayload): Promise<APIResponse<ListResponse>> {
  const response = await apiClient.post('/api/lists', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateList(id: string, data: UpdateListPayload): Promise<APIResponse<ListResponse>> {
  const response = await apiClient.patch(`/api/lists/${id}`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteList(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await apiClient.delete(`/api/lists/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}
