"use client";

import { useCallback, useEffect, useState } from "react";
import { Character } from "@/types";
import { fetchCharacter } from "@/lib/api/character";
import { ApiError } from "@/lib/api/client";

/**
 * Fetches the current user's character on mount. Exposes `setCharacter`
 * so callers (e.g. the dashboard, after a task completion returns an
 * updated Character in its response) can sync this hook's state without
 * an extra round trip — see useTasks().lastLevelUp.
 */
export function useCharacter() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    return fetchCharacter()
      .then(setCharacter)
      .catch((e) =>
        setError(e instanceof ApiError ? e.body.error : "Couldn't load your character.")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { character, loading, error, setCharacter, refresh };
}
