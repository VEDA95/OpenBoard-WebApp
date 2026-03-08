import type { APIResponse } from '@appTypes/response';
import type {
  BoardResponse,
  CreateBoardPayload,
  UpdateBoardPayload,
} from '@appTypes/board';

const API_BASE = 'http://localhost:8080';

export async function getBoards(): Promise<APIResponse<BoardResponse[]>> {
  const response = await fetch(`${API_BASE}/boards`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getBoardsByWorkspace(workspaceId: string): Promise<APIResponse<BoardResponse[]>> {
  const response = await fetch(`${API_BASE}/boards?workspace_id=${workspaceId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getBoard(id: string): Promise<APIResponse<BoardResponse>> {
  const response = await fetch(`${API_BASE}/boards/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function createBoard(data: CreateBoardPayload): Promise<APIResponse<BoardResponse>> {
  const response = await fetch(`${API_BASE}/boards`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateBoard(id: string, data: UpdateBoardPayload): Promise<APIResponse<BoardResponse>> {
  const response = await fetch(`${API_BASE}/boards/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteBoard(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await fetch(`${API_BASE}/boards/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}
