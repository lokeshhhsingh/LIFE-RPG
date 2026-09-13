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
 * The `value` sent to the API is the attribute key (lowercase, must match
 * Character.attributes). The `label` is just user-facing quest framing.
 */
const ATTRIBUTE_OPTIONS: { label: string; value: string }[] = [
  { label: "Coding", value: "intellect" }, // CONFIRMED key
  { label: "Study", value: "intellect" }, // CONFIRMED key
  { label: "Fitness", value: "strength" }, // CONFIRMED key
  { label: "Chores", value: "discipline" }, // CONFIRMED key
  { label: "Mindfulness", value: "discipline" }, // CONFIRMED key
  { label: "Creativity", value: "creativity" }, // GUESS — confirm with backend
];

interface CreateTaskFormProps {
  onCreate: (title: string, attribute: string) => void | Promise<void>;
}

export function CreateTaskForm({ onCreate }: CreateTaskFormProps) {
  const [title, setTitle] = useState("");
  const [attribute, setAttribute] = useState(ATTRIBUTE_OPTIONS[0].value);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      setValidationError("Give your quest a title.");
      return;
    }
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
    >
      <div>
        <label htmlFor="task-title">New quest</label>
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
        />
      </div>

      <div>
        <label htmlFor="task-attribute">Attribute</label>
        <select
          id="task-attribute"
          name="attribute"
          value={attribute}
          onChange={(e) => setAttribute(e.target.value)}
          disabled={submitting}
        >
          {ATTRIBUTE_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {validationError && <p role="alert">{validationError}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding…" : "Add Quest"}
      </button>
    </form>
  );
}
