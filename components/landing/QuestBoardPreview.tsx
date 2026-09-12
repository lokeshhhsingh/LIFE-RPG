const SAMPLE_QUESTS = [
  { title: "Read 20 pages", attribute: "Intellect", xp: 10, done: true },
  { title: "Run 5k", attribute: "Strength", xp: 15, done: false },
  { title: "No phone after 10pm", attribute: "Discipline", xp: 10, done: false },
];

const ATTRIBUTE_DOT: Record<string, string> = {
  Intellect: "bg-indigo",
  Strength: "bg-rust",
  Discipline: "bg-forest",
};

export function QuestBoardPreview() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-sm -rotate-1 rounded-card border border-parchment-line bg-parchment-light p-5 shadow-[6px_6px_0_0_#D8C79C]"
    >
      <div className="flex items-baseline justify-between">
        <p className="font-display text-lg text-ink">Today&apos;s Quests</p>
        <p className="text-sm text-ink-muted">Day 6 streak</p>
      </div>
      <ul className="mt-4 space-y-3">
        {SAMPLE_QUESTS.map((q) => (
          <li key={q.title} className="flex items-center gap-3 text-sm">
            <span
              className={`h-4 w-4 shrink-0 rounded-sm border border-ink/20 ${
                q.done ? "bg-forest" : "bg-transparent"
              }`}
            />
            <span
              className={`flex-1 ${q.done ? "text-ink-muted line-through" : "text-ink"}`}
            >
              {q.title}
            </span>
            <span
              className={`h-2 w-2 rounded-full ${ATTRIBUTE_DOT[q.attribute]}`}
            />
            <span className="w-10 text-right text-ink-muted">+{q.xp}xp</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
