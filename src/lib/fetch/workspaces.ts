import { apiClient } from './client';
import type { APIResponse } from "@appTypes/response";
import type {
  WorkspaceResponse,
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
} from "@appTypes/board";

export async function getWorkspaces(): Promise<APIResponse<WorkspaceResponse[]>> {
  const response = await apiClient.get('/api/workspaces', {
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
}

export async function getWorkspace(id: string): Promise<APIResponse<WorkspaceResponse>> {
  const response = await apiClient.get(`/api/workspaces/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
}

export async function createWorkspace(data: CreateWorkspacePayload): Promise<APIResponse<WorkspaceResponse>> {
  const response = await apiClient.post('/api/workspaces', {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateWorkspace(id: string, data: UpdateWorkspacePayload): Promise<APIResponse<WorkspaceResponse>> {
  const response = await apiClient.patch(`/api/workspaces/${id}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteWorkspace(id: string): Promise<APIResponse<{ message: string }>> {
  const response = await apiClient.delete(`/api/workspaces/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
  return await response.json();
}
