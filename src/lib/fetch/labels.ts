import type { APIResponse } from '@appTypes/response';
import type {
  LabelResponse,
  CreateLabelPayload,
  UpdateLabelPayload,
} from '@appTypes/board';

const API_BASE = 'http://localhost:8080';

export async function getLabels(): Promise<APIResponse<LabelResponse[]>> {
  const response = await fetch(`${API_BASE}/labels`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getLabelsByBoard(boardId: string): Promise<APIResponse<LabelResponse[]>> {
  const response = await fetch(`${API_BASE}/labels?board_id=${boardId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getLabel(id: string): Promise<APIResponse<LabelResponse>> {
  const response = await fetch(`${API_BASE}/labels/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function createLabel(data: CreateLabelPayload): Promise<APIResponse<LabelResponse>> {
  const response = await fetch(`${API_BASE}/labels`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateLabel(id: string, data: UpdateLabelPayload): Promise<APIResponse<LabelResponse>> {
  const response = await fetch(`${API_BASE}/labels/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteLabel(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await fetch(`${API_BASE}/labels/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}
