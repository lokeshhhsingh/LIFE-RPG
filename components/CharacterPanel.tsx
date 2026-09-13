import { Character } from "@/types";
import { getXpProgress } from "@/lib/xp-engine";

interface CharacterPanelProps {
  character: Character | null;
  loading: boolean;
}

export function CharacterPanel({ character, loading }: CharacterPanelProps) {
  if (loading) {
    return <p role="status">Loading character…</p>;
  }
  if (!character) {
    return null;
  }

  const xp = getXpProgress(character.level, character.current_xp);

  return (
    <div data-component="character-panel">
      <h2 data-field="level">Level {character.level}</h2>

      <div
        data-field="xp-bar"
        role="progressbar"
        aria-valuenow={xp.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${xp.current} of ${xp.required} XP to next level`}
      >
        <div data-fill style={{ width: `${xp.percent}%` }} />
      </div>
      <p data-field="xp-text">
        {xp.current} / {xp.required} XP
      </p>

      <p data-field="streak">
        {character.streak_count > 0
          ? `${character.streak_count} day streak`
          : "No streak yet — complete a quest today to start one."}
      </p>

      <div data-field="attributes">
        {Object.entries(character.attributes).map(([name, value]) => (
          <div key={name} data-attribute={name}>
            <span data-attribute-name>{name}</span>
            <div
              role="progressbar"
              aria-valuenow={Math.min(100, value)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${name}: ${value}`}
            >
              <div data-fill style={{ width: `${Math.min(100, value)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p data-field="gold">{character.currency} gold</p>
    </div>
  );
}
