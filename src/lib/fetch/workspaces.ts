import type { APIResponse } from "@appTypes/response";
import type {
  WorkspaceResponse,
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
} from "@appTypes/board";

const API_BASE = "http://localhost:8080";

export async function getWorkspaces(): Promise<
  APIResponse<WorkspaceResponse[]>
> {
  const response = await fetch(`${API_BASE}/api/workspaces`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export async function getWorkspace(
  id: string,
): Promise<APIResponse<WorkspaceResponse>> {
  const response = await fetch(`${API_BASE}/api/workspaces/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export async function createWorkspace(
  data: CreateWorkspacePayload,
): Promise<APIResponse<WorkspaceResponse>> {
  const response = await fetch(`${API_BASE}/api/workspaces`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function updateWorkspace(
  id: string,
  data: UpdateWorkspacePayload,
): Promise<APIResponse<WorkspaceResponse>> {
  const response = await fetch(`${API_BASE}/api/workspaces/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function deleteWorkspace(
  id: string,
): Promise<APIResponse<{ message: string }>> {
  const response = await fetch(`${API_BASE}/api/workspaces/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}
