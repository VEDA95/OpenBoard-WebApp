import type { APIResponse } from '@appTypes/response';
import type {
  CommentResponse,
  CreateCommentPayload,
  UpdateCommentPayload,
} from '@appTypes/board';

const API_BASE = 'http://localhost:8080';

export async function getComments(): Promise<APIResponse<CommentResponse[]>> {
  const response = await fetch(`${API_BASE}/comments`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getCommentsByCard(cardId: string): Promise<APIResponse<CommentResponse[]>> {
  const response = await fetch(`${API_BASE}/comments?card_id=${cardId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getComment(id: string): Promise<APIResponse<CommentResponse>> {
  const response = await fetch(`${API_BASE}/comments/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function createComment(data: CreateCommentPayload): Promise<APIResponse<CommentResponse>> {
  const response = await fetch(`${API_BASE}/comments`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateComment(id: string, data: UpdateCommentPayload): Promise<APIResponse<CommentResponse>> {
  const response = await fetch(`${API_BASE}/comments/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteComment(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await fetch(`${API_BASE}/comments/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}
