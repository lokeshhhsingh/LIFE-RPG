import { Character } from "@/types";
import { apiFetch } from "./client";

export async function fetchCharacter(): Promise<Character> {
  return apiFetch<Character>("/character");
}
