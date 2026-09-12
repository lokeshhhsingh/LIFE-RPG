import { Task, TaskCategory } from "@/types";
import { apiFetch } from "./client";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

// In-memory mock store — resets on page refresh. Replace with real
// endpoints; NOTE per the brief, localStorage-only persistence is a
// disqualifying condition, so this mock must never ship as-is.
let mockTasks: Task[] = [];

export async function fetchTasks(): Promise<Task[]> {
  if (USE_MOCK) return [...mockTasks];
  return apiFetch<Task[]>("/tasks");
}

export async function createTask(
  title: string,
  category: TaskCategory,
  xpReward: number = 10
): Promise<Task> {
  if (USE_MOCK) {
    const task: Task = {
      id: crypto.randomUUID(),
      userId: "mock-user-1",
      title,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      xpReward,
    };
    mockTasks = [...mockTasks, task];
    return task;
  }
  return apiFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({ title, category, xpReward }),
  });
}

export async function completeTask(taskId: string): Promise<Task> {
  if (USE_MOCK) {
    const task = mockTasks.find((t) => t.id === taskId);
    if (!task) throw new Error("Task not found");
    task.completed = true;
    task.completedAt = new Date().toISOString();
    return task;
  }
  return apiFetch<Task>(`/tasks/${taskId}/complete`, { method: "POST" });
}

export async function deleteTask(taskId: string): Promise<void> {
  if (USE_MOCK) {
    mockTasks = mockTasks.filter((t) => t.id !== taskId);
    return;
  }
  return apiFetch<void>(`/tasks/${taskId}`, { method: "DELETE" });
}
