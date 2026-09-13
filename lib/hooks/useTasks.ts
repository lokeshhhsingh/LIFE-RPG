"use client";

import { useEffect, useState } from "react";
import { Task, isCompletionResponse, Character } from "@/types";
import { fetchTasks, createTask, completeTask, deleteTask } from "@/lib/api/tasks";
import { ApiError } from "@/lib/api/client";

/**
 * Logic-owner hook, lifted to page level so a create-task form and the
 * task list can share the same state without prop-drilling a refetch.
 * Exposes `lastLevelUp` so a UI component (Teammate A's territory) can
 * watch for it and fire confetti/animation — clear it via clearLevelUp()
 * once the animation plays.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastLevelUp, setLastLevelUp] = useState<{
    character: Character;
    xpGained: number;
    currencyGained: number;
  } | null>(null);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((e) => setError(e instanceof ApiError ? e.body.error : e.message))
      .finally(() => setLoading(false));
  }, []);

  async function add(title: string, attribute: string, xpValue?: number) {
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Task title can't be empty.");
      return;
    }
    const optimisticId = -Date.now(); // negative = guaranteed to never collide with a real auto-increment id
    const optimistic: Task = {
      id: optimisticId,
      user_id: "me",
      title: trimmed,
      attribute,
      xp_value: xpValue ?? 10,
      completed: false,
      created_at: new Date().toISOString(),
      completed_at: null,
    };
    setTasks((prev) => [optimistic, ...prev]);
    try {
      const real = await createTask(trimmed, attribute, xpValue);
      setTasks((prev) => prev.map((t) => (t.id === optimisticId ? real : t)));
    } catch (e) {
      setTasks((prev) => prev.filter((t) => t.id !== optimisticId));
      setError(e instanceof ApiError ? e.body.error : "Couldn't save that task — try again.");
    }
  }

  async function complete(taskId: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );
    try {
      const res = await completeTask(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.task : t)));
      if (isCompletionResponse(res)) {
        setLastLevelUp({
          character: res.character,
          xpGained: res.xp_gained,
          currencyGained: res.currency_gained,
        });
      }
    } catch (e) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: false } : t))
      );
      setError(e instanceof ApiError ? e.body.error : "Couldn't complete that task — try again.");
    }
  }

  async function remove(taskId: number) {
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await deleteTask(taskId);
    } catch (e) {
      setTasks(prevTasks);
      setError(e instanceof ApiError ? e.body.error : "Couldn't delete that task — try again.");
    }
  }

  function clearLevelUp() {
    setLastLevelUp(null);
  }

  function clearError() {
    setError(null);
  }

  return {
    tasks,
    loading,
    error,
    lastLevelUp,
    add,
    complete,
    remove,
    clearLevelUp,
    clearError,
  };
}
