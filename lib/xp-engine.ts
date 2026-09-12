/**
 * Pure XP/progress-bar math. No side effects, no API calls.
 *
 * IMPORTANT: Character.current_xp is progress toward the NEXT level only —
 * it resets to 0 on level-up. It is NOT a cumulative lifetime total. Don't
 * try to reconstruct "total XP ever earned" from this field; the backend
 * doesn't expose that, and there's no need to — the UI only ever needs
 * "how full is the current level's bar."
 */

/**
 * XP required to advance FROM this level to the next.
 * Confirmed formula from backend: floor(100 * 1.5^(level - 1))
 * Level 1 → 2 needs 100 XP, Level 2 → 3 needs 150, Level 3 → 4 needs 225, etc.
 */
export function getXpThresholdForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export interface XpProgress {
  current: number;
  required: number;
  percent: number; // 0-100
}

/** Progress bar data straight from a Character object. */
export function getXpProgress(level: number, currentXp: number): XpProgress {
  const required = getXpThresholdForLevel(level);
  const percent = required > 0 ? Math.min(100, Math.round((currentXp / required) * 100)) : 0;
  return { current: currentXp, required, percent };
}
