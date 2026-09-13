import { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onComplete: (taskId: number) => void;
  onRemove: (taskId: number) => void;
}

export function TaskList({ tasks, loading, onComplete, onRemove }: TaskListProps) {
  if (loading) return <p role="status">Loading quests…</p>;

  if (tasks.length === 0) {
    return <p data-component="task-list-empty">No quests yet — add one above to get started.</p>;
  }

  return (
    <ul data-component="task-list">
      {tasks.map((task) => (
        <li key={task.id} data-completed={task.completed}>
          <span>{task.title}</span>
          <span>{task.attribute}</span>
          {!task.completed && (
            <button onClick={() => onComplete(task.id)} aria-label={`Complete ${task.title}`}>
              Complete
            </button>
          )}
          <button onClick={() => onRemove(task.id)} aria-label={`Delete ${task.title}`}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
