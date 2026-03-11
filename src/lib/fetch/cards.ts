import { apiClient } from './client';
import type { APIResponse } from '@appTypes/response';
import type {
  CardResponse,
  CreateCardPayload,
  UpdateCardPayload,
  MoveCardPayload,
} from '@appTypes/board';

export async function getCards(): Promise<APIResponse<CardResponse[]>> {
  const response = await apiClient.get('/api/cards', {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getCardsByList(listId: string): Promise<APIResponse<CardResponse[]>> {
  const response = await apiClient.get(`/api/cards?list_id=${listId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function getCard(id: string): Promise<APIResponse<CardResponse>> {
  const response = await apiClient.get(`/api/cards/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function createCard(data: CreateCardPayload): Promise<APIResponse<CardResponse>> {
  const response = await apiClient.post('/api/cards', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateCard(id: string, data: UpdateCardPayload): Promise<APIResponse<CardResponse>> {
  const response = await apiClient.patch(`/api/cards/${id}`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function moveCard(id: string, data: MoveCardPayload): Promise<APIResponse<CardResponse>> {
  const response = await apiClient.patch(`/api/cards/${id}/move`, {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteCard(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await apiClient.delete(`/api/cards/${id}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

// Label operations on cards
export async function addLabelToCard(cardId: string, labelId: string): Promise<APIResponse<CardResponse>> {
  const response = await apiClient.post(`/api/cards/${cardId}/labels/${labelId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

export async function removeLabelFromCard(cardId: string, labelId: string): Promise<APIResponse<{ message: string }>> {
  const response = await apiClient.delete(`/api/cards/${cardId}/labels/${labelId}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}
