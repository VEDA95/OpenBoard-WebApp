import { apiClient } from './client';
import type { APIResponse } from '@appTypes/response';
import type {
  CommentResponse,
  CreateCommentPayload,
  UpdateCommentPayload,
} from '@appTypes/board';

export async function getComments(): Promise<APIResponse<CommentResponse[]>> {
  const response = await apiClient.get('/api/comments', {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getCommentsByCard(cardId: string): Promise<APIResponse<CommentResponse[]>> {
  const response = await apiClient.get(`/api/comments?card_id=${cardId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getComment(id: string): Promise<APIResponse<CommentResponse>> {
  const response = await apiClient.get(`/api/comments/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function createComment(data: CreateCommentPayload): Promise<APIResponse<CommentResponse>> {
  const response = await apiClient.post('/api/comments', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateComment(id: string, data: UpdateCommentPayload): Promise<APIResponse<CommentResponse>> {
  const response = await apiClient.patch(`/api/comments/${id}`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteComment(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await apiClient.delete(`/api/comments/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}
