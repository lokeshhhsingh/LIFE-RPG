"use client";

import { useEffect, useState } from "react";
import { Task, TaskCategory } from "@/types";
import { fetchTasks, createTask, completeTask, deleteTask } from "@/lib/api/tasks";

/**
 * Example of the intended convention: this component owns state/logic and
 * exposes data-* attributes + plain class hooks for Teammate A to style —
 * it deliberately has zero Tailwind classes yet beyond structural ones.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function add(title: string, category: TaskCategory) {
    if (!title.trim()) {
      setError("Task title can't be empty.");
      return;
    }
    const optimistic: Task = {
      id: `temp-${Date.now()}`,
      userId: "me",
      title,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      xpReward: 10,
    };
    setTasks((prev) => [...prev, optimistic]);
    try {
      const real = await createTask(title, category);
      setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? real : t)));
    } catch (e) {
      setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
      setError("Couldn't save that task — try again.");
    }
  }

  async function complete(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );
    try {
      await completeTask(taskId);
    } catch (e) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: false } : t))
      );
      setError("Couldn't complete that task — try again.");
    }
  }

  async function remove(taskId: string) {
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await deleteTask(taskId);
    } catch (e) {
      setTasks(prevTasks);
      setError("Couldn't delete that task — try again.");
    }
  }

  return { tasks, loading, error, add, complete, remove };
}

export function TaskList() {
  const { tasks, loading, error, complete, remove } = useTasks();

  if (loading) return <p role="status">Loading quests…</p>;

  return (
    <div data-component="task-list">
      {error && <p role="alert">{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id} data-completed={task.completed}>
            <span>{task.title}</span>
            <span>{task.category}</span>
            {!task.completed && (
              <button onClick={() => complete(task.id)} aria-label={`Complete ${task.title}`}>
                Complete
              </button>
            )}
            <button onClick={() => remove(task.id)} aria-label={`Delete ${task.title}`}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
