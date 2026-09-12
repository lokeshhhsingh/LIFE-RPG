/**
 * Pure XP/leveling functions. No side effects, no API calls — easy to unit
 * test in isolation and safe to mirror client-side for optimistic UI while
 * the backend remains the authoritative source of truth (per the brief's
 * anti-cheat requirement, backend should recompute and validate this too).
 */

/** XP required to REACH a given level from level 1 (non-linear curve). */
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(100 * Math.pow(level, 1.5));
}

/** Given a total XP amount, what level is the character currently at? */
export function getLevelFromTotalXp(totalXp: number): number {
  let level = 1;
  while (getXpForLevel(level + 1) <= totalXp) {
    level += 1;
  }
  return level;
}

export interface XpProgress {
  currentLevel: number;
  xpIntoLevel: number;
  xpRequiredForNextLevel: number;
  percent: number; // 0-100
}

/** Progress bar data: how far into the current level the user is. */
export function getXpProgressToNextLevel(totalXp: number): XpProgress {
  const currentLevel = getLevelFromTotalXp(totalXp);
  const currentLevelFloor = getXpForLevel(currentLevel);
  const nextLevelCeiling = getXpForLevel(currentLevel + 1);
  const xpIntoLevel = totalXp - currentLevelFloor;
  const xpRequiredForNextLevel = nextLevelCeiling - currentLevelFloor;
  const percent = Math.min(
    100,
    Math.round((xpIntoLevel / xpRequiredForNextLevel) * 100)
  );

  return { currentLevel, xpIntoLevel, xpRequiredForNextLevel, percent };
}

/**
 * Streak logic: pass calendar-date strings (YYYY-MM-DD), not timestamps,
 * to avoid timezone/time-of-day bugs.
 */
export function calculateStreak(
  lastActiveDate: string | null,
  currentStreak: number,
  today: string
): number {
  if (!lastActiveDate) return 1;
  if (lastActiveDate === today) return currentStreak; // already logged today

  const last = new Date(lastActiveDate);
  const now = new Date(today);
  const diffDays = Math.round(
    (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 1) return currentStreak + 1; // consecutive day
  return 1; // streak broken, restart
}
