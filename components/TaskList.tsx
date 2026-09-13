import { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onComplete: (taskId: number) => void;
  onRemove: (taskId: number) => void;
}

export function TaskList({ tasks, loading, onComplete, onRemove }: TaskListProps) {
  if (loading) return <p role="status" className="text-sm text-ink-muted">Loading quests…</p>;

  if (tasks.length === 0) {
    return (
      <p data-component="task-list-empty" className="text-sm text-ink-muted">
        No quests yet — add one above to get started.
      </p>
    );
  }

  return (
    <ul data-component="task-list" className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          data-completed={task.completed}
          className="flex items-center gap-3 rounded-card border border-parchment-line bg-parchment-light px-4 py-3 text-sm"
        >
          <span className={`flex-1 ${task.completed ? "text-ink-muted line-through" : "text-ink"}`}>
            {task.title}
          </span>
          <span className="text-ink-muted">{task.attribute}</span>
          {!task.completed && (
            <button
              onClick={() => onComplete(task.id)}
              aria-label={`Complete ${task.title}`}
              className="rounded-card bg-ink px-3 py-1 text-xs font-medium text-parchment-light hover:bg-forest"
            >
              Complete
            </button>
          )}
          <button
            onClick={() => onRemove(task.id)}
            aria-label={`Delete ${task.title}`}
            className="rounded-card border border-parchment-line px-3 py-1 text-xs text-ink-muted hover:border-rust hover:text-rust"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
