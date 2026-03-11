import { apiClient } from './client';
import type { APIResponse } from '@appTypes/response';
import type {
  BoardResponse,
  CreateBoardPayload,
  UpdateBoardPayload,
} from '@appTypes/board';

export async function getBoards(): Promise<APIResponse<BoardResponse[]>> {
  const response = await apiClient.get('/api/boards', {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getBoardsByWorkspace(workspaceId: string): Promise<APIResponse<BoardResponse[]>> {
  const response = await apiClient.get(`/api/boards?workspace_id=${workspaceId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getBoard(id: string): Promise<APIResponse<BoardResponse>> {
  const response = await apiClient.get(`/api/boards/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function createBoard(data: CreateBoardPayload): Promise<APIResponse<BoardResponse>> {
  const response = await apiClient.post('/api/boards', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateBoard(id: string, data: UpdateBoardPayload): Promise<APIResponse<BoardResponse>> {
  const response = await apiClient.patch(`/api/boards/${id}`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteBoard(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await apiClient.delete(`/api/boards/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}
