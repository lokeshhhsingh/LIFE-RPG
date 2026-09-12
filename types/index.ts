/**
 * Shared type contract between frontend and backend.
 *
 * ASSUMPTIONS: these fields are inferred from the problem statement, not an
 * agreed spec. Confirm/adjust with your backend teammates in your first
 * sync, then this file becomes the single source of truth both sides code
 * against — do not let frontend and backend drift into separate shapes.
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string; // ISO date string
}

export type TaskCategory =
  | "Coding"
  | "Fitness"
  | "Creativity"
  | "Mindfulness"
  | "Study"
  | "Chores";

export interface Task {
  id: string;
  userId: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  xpReward: number;
}

export interface AttributeStats {
  intellect: number;
  strength: number;
  creativity: number;
  discipline: number;
}

export interface Character {
  userId: string;
  level: number;
  totalXp: number;
  gold: number;
  attributes: AttributeStats;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null; // ISO date, date-only comparison for streaks
  equippedItemIds: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  iconUrl: string;
  category: "theme" | "badge" | "cosmetic";
  owned: boolean;
}
