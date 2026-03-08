import type { APIResponse } from '@appTypes/response';
import type {
  ListResponse,
  CreateListPayload,
  UpdateListPayload,
} from '@appTypes/board';

const API_BASE = 'http://localhost:8080';

export async function getLists(): Promise<APIResponse<ListResponse[]>> {
  const response = await fetch(`${API_BASE}/lists`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getListsByBoard(boardId: string): Promise<APIResponse<ListResponse[]>> {
  const response = await fetch(`${API_BASE}/lists?board_id=${boardId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getList(id: string): Promise<APIResponse<ListResponse>> {
  const response = await fetch(`${API_BASE}/lists/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function createList(data: CreateListPayload): Promise<APIResponse<ListResponse>> {
  const response = await fetch(`${API_BASE}/lists`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateList(id: string, data: UpdateListPayload): Promise<APIResponse<ListResponse>> {
  const response = await fetch(`${API_BASE}/lists/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteList(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await fetch(`${API_BASE}/lists/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}
