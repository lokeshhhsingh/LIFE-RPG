"use client";

import { useEffect } from "react";
import { Character } from "@/types";

export interface LevelUpData {
  character: Character;
  xpGained: number;
  currencyGained: number;
}

interface LevelUpCelebrationProps {
  data: LevelUpData | null;
  onDismiss: () => void;
  /** Auto-dismiss after this many ms so it never gets stuck on screen. */
  autoDismissMs?: number;
}

/**
 * FOR TEAMMATE A: this component mounts the instant a task completion
 * returns the reward shape, and unmounts on dismiss (auto or manual).
 * That mount/unmount transition is your animation trigger — e.g. wrap the
 * returned JSX in a Framer Motion <AnimatePresence>/<motion.div> for
 * enter/exit transitions, or fire a confetti burst in a useEffect keyed
 * on `data` changing from null to non-null. Don't need to touch the logic
 * above — `data.xpGained`, `data.currencyGained`, and `data.character.level`
 * are all you need to read for the numbers to display.
 */
export function LevelUpCelebration({
  data,
  onDismiss,
  autoDismissMs = 4000,
}: LevelUpCelebrationProps) {
  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [data, onDismiss, autoDismissMs]);

  if (!data) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      data-component="level-up-celebration"
      data-level={data.character.level}
    >
      <p data-field="xp-gained">+{data.xpGained} XP</p>
      <p data-field="currency-gained">+{data.currencyGained} gold</p>
      <p data-field="level">Level {data.character.level}</p>
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  );
}
