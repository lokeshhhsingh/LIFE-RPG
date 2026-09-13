import { Character } from "@/types";
import { AttributeBar, AttributeColor } from "@/components/AttributeBar";
import { getXpProgress } from "@/lib/xp-engine";

const ATTRIBUTE_COLOR: Record<string, AttributeColor> = {
  strength: "rust",
  intellect: "indigo",
  discipline: "forest",
};

function attributeColor(key: string): AttributeColor {
  return ATTRIBUTE_COLOR[key] ?? "gold";
}

function attributeLabel(key: string): string {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

interface CharacterPanelProps {
  character: Character;
}

export function CharacterPanel({ character }: CharacterPanelProps) {
  const xp = getXpProgress(character.level, character.current_xp);
  const attributeEntries = Object.entries(character.attributes);
  // Bars are shown relative to your highest stat, since attributes have
  // no fixed maximum — this keeps them comparative rather than arbitrary.
  const maxAttribute = Math.max(1, ...attributeEntries.map(([, v]) => v));

  return (
    <section
      data-component="character-panel"
      aria-label="Character overview"
      className="rounded-card border border-parchment-line bg-parchment-light p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-2xl text-ink">Level {character.level}</p>
        <Streak count={character.streak_count} />
      </div>

      <div className="mt-3">
        <div className="flex items-baseline justify-between text-sm text-ink-muted">
          <span>XP</span>
          <span>
            {xp.current} / {xp.required}
          </span>
        </div>
        <div
          className="mt-1 h-2 w-full overflow-hidden rounded-full bg-parchment-line"
          role="progressbar"
          aria-label="XP progress to next level"
          aria-valuenow={xp.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-gold transition-[width] duration-700 ease-out"
            style={{ width: `${xp.percent}%` }}
          />
        </div>
      </div>

      {attributeEntries.length > 0 && (
        <div className="mt-5 space-y-3">
          {attributeEntries.map(([key, value]) => (
            <AttributeBar
              key={key}
              label={attributeLabel(key)}
              percent={(value / maxAttribute) * 100}
              color={attributeColor(key)}
              valueLabel={String(value)}
            />
          ))}
        </div>
      )}

      <p className="mt-4 text-sm text-ink-muted">{character.currency} gold</p>
    </section>
  );
}

function Streak({ count }: { count: number }) {
  if (count <= 0) {
    return (
      <p className="text-sm text-ink-muted">
        No streak yet — complete a quest today to start one.
      </p>
    );
  }
  return (
    <p className="text-sm text-ink-muted">
      <span className="font-medium text-rust">{count}</span>{" "}
      {count === 1 ? "day" : "days"} streak
    </p>
  );
}
