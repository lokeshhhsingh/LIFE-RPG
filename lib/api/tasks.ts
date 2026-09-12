import { Task, TaskUpdateResponse } from "@/types";
import { apiFetch } from "./client";

export async function fetchTasks(): Promise<Task[]> {
  return apiFetch<Task[]>("/tasks");
}

export async function createTask(
  title: string,
  attribute: string,
  xpValue?: number
): Promise<Task> {
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({
      title,
      attribute,
      ...(xpValue !== undefined ? { xp_value: xpValue } : {}),
    }),
  });
}

/**
 * Marks a task complete. Check isCompletionResponse() (from @/types) on
 * the result to know whether to trigger level-up/XP celebration UI — the
 * API only includes character/xp_gained/currency_gained the FIRST time a
 * given task transitions false -> true.
 */
export async function completeTask(taskId: number): Promise<TaskUpdateResponse> {
  return apiFetch<TaskUpdateResponse>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ completed: true }),
  });
}

/** For non-completion edits (e.g. renaming a task). */
export async function updateTask(
  taskId: number,
  updates: Partial<Pick<Task, "title" | "attribute">>
): Promise<TaskUpdateResponse> {
  return apiFetch<TaskUpdateResponse>(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export async function deleteTask(
  taskId: number
): Promise<{ message: string; task: Task }> {
  return apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
}
