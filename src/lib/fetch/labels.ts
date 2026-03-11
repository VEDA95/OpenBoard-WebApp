import { apiClient } from './client';
import type { APIResponse } from '@appTypes/response';
import type {
  LabelResponse,
  CreateLabelPayload,
  UpdateLabelPayload,
} from '@appTypes/board';

export async function getLabels(): Promise<APIResponse<LabelResponse[]>> {
  const response = await apiClient.get('/api/labels', {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getLabelsByBoard(boardId: string): Promise<APIResponse<LabelResponse[]>> {
  const response = await apiClient.get(`/api/labels?board_id=${boardId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getLabel(id: string): Promise<APIResponse<LabelResponse>> {
  const response = await apiClient.get(`/api/labels/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function createLabel(data: CreateLabelPayload): Promise<APIResponse<LabelResponse>> {
  const response = await apiClient.post('/api/labels', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateLabel(id: string, data: UpdateLabelPayload): Promise<APIResponse<LabelResponse>> {
  const response = await apiClient.patch(`/api/labels/${id}`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteLabel(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await apiClient.delete(`/api/labels/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}
