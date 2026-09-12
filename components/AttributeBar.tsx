const COLOR_MAP = {
  rust: "bg-rust",
  indigo: "bg-indigo",
  forest: "bg-forest",
  gold: "bg-gold",
} as const;

export type AttributeColor = keyof typeof COLOR_MAP;

interface AttributeBarProps {
  label: string;
  /** 0–100 */
  percent: number;
  color: AttributeColor;
  /** Small value shown at the end of the row, e.g. "40" or "Lv. 3" */
  valueLabel?: string;
}

export function AttributeBar({ label, percent, color, valueLabel }: AttributeBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div data-component="attribute-bar">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-ink">{label}</span>
        {valueLabel && <span className="text-ink-muted">{valueLabel}</span>}
      </div>
      <div
        className="mt-1 h-2 w-full overflow-hidden rounded-full bg-parchment-line"
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full ${COLOR_MAP[color]} transition-[width] duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
