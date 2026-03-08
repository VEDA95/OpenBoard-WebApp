import type { APIResponse } from '@appTypes/response';
import type {
  CardResponse,
  CreateCardPayload,
  UpdateCardPayload,
  MoveCardPayload,
} from '@appTypes/board';

const API_BASE = 'http://localhost:8080';

export async function getCards(): Promise<APIResponse<CardResponse[]>> {
  const response = await fetch(`${API_BASE}/cards`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getCardsByList(listId: string): Promise<APIResponse<CardResponse[]>> {
  const response = await fetch(`${API_BASE}/cards?list_id=${listId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function getCard(id: string): Promise<APIResponse<CardResponse>> {
  const response = await fetch(`${API_BASE}/cards/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function createCard(data: CreateCardPayload): Promise<APIResponse<CardResponse>> {
  const response = await fetch(`${API_BASE}/cards`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateCard(id: string, data: UpdateCardPayload): Promise<APIResponse<CardResponse>> {
  const response = await fetch(`${API_BASE}/cards/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function moveCard(id: string, data: MoveCardPayload): Promise<APIResponse<CardResponse>> {
  const response = await fetch(`${API_BASE}/cards/${id}/move`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteCard(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await fetch(`${API_BASE}/cards/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

// Label operations on cards
export async function addLabelToCard(cardId: string, labelId: string): Promise<APIResponse<CardResponse>> {
  const response = await fetch(`${API_BASE}/cards/${cardId}/labels/${labelId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

export async function removeLabelFromCard(cardId: string, labelId: string): Promise<APIResponse<{ message: string }>> {
  const response = await fetch(`${API_BASE}/cards/${cardId}/labels/${labelId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}
