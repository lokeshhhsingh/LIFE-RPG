"use client";

import { useCallback, useEffect, useState } from "react";
import { Character } from "@/types";
import { fetchCharacter } from "@/lib/api/character";
import { ApiError } from "@/lib/api/client";

export function useCharacter() {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchCharacter();
      setCharacter(data);
    } catch (e) {
      setError(e instanceof ApiError ? e.body.error : "Couldn't load your character.");
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  return { character, loading, error, setCharacter, refresh };
}
