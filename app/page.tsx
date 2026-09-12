import Link from "next/link";
import { AttributeBar } from "@/components/AttributeBar";
import { QuestBoardPreview } from "@/components/landing/QuestBoardPreview";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Life RPG",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description:
    "Life RPG turns everyday tasks into quests. Complete them to earn XP and gold, level up a character, and build streaks.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-display text-lg text-ink">Life RPG</span>
        <Link href="/login" className="text-sm text-ink-muted hover:text-ink">
          Log in
        </Link>
      </header>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-10 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <h1 className="max-w-sm font-display text-4xl leading-tight text-ink md:text-5xl">
            Turn chores into quests.
          </h1>
          <p className="mt-5 max-w-sm text-ink-muted">
            Life RPG tracks your real to-dos as quests. Complete one and your
            character earns XP and gold, levels up, and keeps a streak going —
            so the habit sticks because the game notices.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="rounded-card bg-ink px-6 py-3 text-sm font-medium text-parchment-light transition-colors hover:bg-rust"
            >
              Start your quest log
            </Link>
            <Link href="/login" className="text-sm text-ink-muted hover:text-ink">
              Already adventuring? Log in
            </Link>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <QuestBoardPreview />
        </div>
      </section>

      <section className="border-y border-parchment-line bg-parchment-light py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-2xl text-ink">How it works</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-display text-3xl text-gold">1</p>
              <p className="mt-2 font-medium text-ink">Post a quest</p>
              <p className="mt-1 text-sm text-ink-muted">
                Add a real task — a workout, a chore, an hour of study — and
                tag it with the attribute it trains.
              </p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold">2</p>
              <p className="mt-2 font-medium text-ink">Complete it</p>
              <p className="mt-1 text-sm text-ink-muted">
                Mark it done and your character earns XP and gold on the
                spot. No manual logging.
              </p>
            </div>
            <div>
              <p className="font-display text-3xl text-gold">3</p>
              <p className="mt-2 font-medium text-ink">Level up</p>
              <p className="mt-1 text-sm text-ink-muted">
                Fill the XP bar enough times and your character levels up.
                Miss a day and the streak resets — so momentum matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display text-2xl text-ink">
          Every quest trains a stat
        </h2>
        <p className="mt-2 max-w-xl text-ink-muted">
          Tasks aren&apos;t just checked off — they feed one of three
          attributes, so your character sheet actually reflects what
          you&apos;ve been doing.
        </p>
        <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-3">
          <div>
            <AttributeBar label="Strength" percent={62} color="rust" valueLabel="Fitness, chores" />
            <p className="mt-2 text-sm text-ink-muted">
              Workouts, physical chores, anything that moves your body.
            </p>
          </div>
          <div>
            <AttributeBar label="Intellect" percent={45} color="indigo" valueLabel="Study, coding" />
            <p className="mt-2 text-sm text-ink-muted">
              Reading, studying, coding — anything that trains your mind.
            </p>
          </div>
          <div>
            <AttributeBar label="Discipline" percent={78} color="forest" valueLabel="Habits, mindfulness" />
            <p className="mt-2 text-sm text-ink-muted">
              Chores, mindfulness, and the boring habits that compound.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-parchment-line bg-ink py-16 text-parchment-light">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="font-display text-2xl">
            Your quest log is waiting.
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-parchment-line">
            Free to start. No credit card, no ads — just a character that
            grows as you do.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-block rounded-card bg-gold px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-gold-bright"
          >
            Start your quest log
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-8 text-sm text-ink-muted">
        Life RPG
      </footer>
    </>
  );
}
