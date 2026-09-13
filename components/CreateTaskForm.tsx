"use client";

import { useState, FormEvent } from "react";

/**
 * ⚠️ STILL TODO confirm with backend: the full canonical list of attribute
 * keys. types.ts confirms Character.attributes is a Record<string, number>
 * with example keys "strength", "intellect", "discipline" — those 3 are
 * CONFIRMED. "creativity" below is a GUESS based on the original brief's
 * "Creativity" category; since attributes is a dynamic Record, it likely
 * works and just adds a new key, but verify a stat bar actually renders
 * for it before relying on it.
 *
 * Note: several labels intentionally map to the SAME backend attribute
 * (Coding + Study -> intellect, Chores + Mindfulness -> discipline). Each
 * option still needs a UNIQUE `id` for the <select> itself — using the
 * shared `value` as the option's value causes a real browser bug where
 * picking the second option with a duplicate value visually snaps back
 * to displaying the first one. `id` drives the dropdown; `value` is only
 * looked up at submit time for what actually gets sent to the API.
 */
const ATTRIBUTE_OPTIONS: { id: string; label: string; value: string }[] = [
  { id: "coding", label: "Coding", value: "intellect" }, // CONFIRMED key
  { id: "study", label: "Study", value: "intellect" }, // CONFIRMED key
  { id: "fitness", label: "Fitness", value: "strength" }, // CONFIRMED key
  { id: "chores", label: "Chores", value: "discipline" }, // CONFIRMED key
  { id: "mindfulness", label: "Mindfulness", value: "discipline" }, // CONFIRMED key
  { id: "creativity", label: "Creativity", value: "creativity" }, // GUESS — confirm with backend
];

interface CreateTaskFormProps {
  onCreate: (title: string, attribute: string) => unknown;
}

export function CreateTaskForm({ onCreate }: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [optionId, setOptionId] = useState(ATTRIBUTE_OPTIONS[0].id);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      setValidationError("Give your quest a title.");
      return;
    }
    const selected = ATTRIBUTE_OPTIONS.find((opt) => opt.id === optionId);
    const attribute = selected ? selected.value : ATTRIBUTE_OPTIONS[0].value;

    setValidationError(null);
    setSubmitting(true);
    try {
      await onCreate(trimmed, attribute);
      setTitle(""); // clear on success so the form is ready for the next quest
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-component="create-task-form"
      aria-label="Add a new quest"
      className="rounded-card border border-parchment-line bg-parchment-light p-4"
    >
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-ink">
          New quest
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          placeholder="e.g. Read 20 pages"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (validationError) setValidationError(null);
          }}
          aria-invalid={!!validationError}
          disabled={submitting}
          className="mt-1 w-full rounded-card border border-parchment-line bg-parchment-light px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
      </div>

      <div className="mt-3">
        <label htmlFor="task-attribute" className="block text-sm font-medium text-ink">
          Attribute
        </label>
        <select
          id="task-attribute"
          name="attribute"
          value={optionId}
          onChange={(e) => setOptionId(e.target.value)}
          disabled={submitting}
          className="mt-1 w-full rounded-card border border-parchment-line bg-parchment-light px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        >
          {ATTRIBUTE_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {validationError && (
        <p role="alert" className="mt-2 text-sm text-rust">
          {validationError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 rounded-card bg-ink px-4 py-2 text-sm font-medium text-parchment-light hover:bg-rust disabled:opacity-60"
      >
        {submitting ? "Adding…" : "Add Quest"}
      </button>
    </form>
  );
}
