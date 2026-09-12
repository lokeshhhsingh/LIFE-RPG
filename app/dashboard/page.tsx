"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useTasks } from "@/lib/hooks/useTasks";
import { useCharacter } from "@/lib/hooks/useCharacter";
import { CreateTaskForm } from "@/components/CreateTaskForm";
import { TaskList } from "@/components/TaskList";
import { LevelUpCelebration } from "@/components/LevelUpCelebration";
import { CharacterPanel } from "@/components/CharacterPanel";

function DashboardContent() {
  const router = useRouter();
  const { logout } = useAuth();
  const { tasks, loading, error, lastLevelUp, add, complete, remove, clearLevelUp } =
    useTasks();
  const { character, loading: characterLoading, setCharacter } = useCharacter();

  // A task completion that granted a reward already returns the fresh
  // Character — sync it here instead of doing a second network round trip.
  useEffect(() => {
    if (lastLevelUp) {
      setCharacter(lastLevelUp.character);
    }
  }, [lastLevelUp, setCharacter]);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <section data-page="dashboard" className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">Your Quest Log</h1>
        <div className="flex items-center gap-4 text-sm">
          <a href="/shop" className="text-ink-muted hover:text-ink">
            Visit Shop
          </a>
          <button onClick={handleLogout} className="text-ink-muted hover:text-ink">
            Log Out
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-rust">
          {error}
        </p>
      )}

      {/*
        Teammate A: LevelUpCelebration mounts only when a task completion
        actually granted XP (not on regular edits) — see the component
        file for the animation hook point.
      */}
      <LevelUpCelebration data={lastLevelUp} onDismiss={clearLevelUp} />

      <div className="mt-6">
        {characterLoading ? (
          <p role="status" className="text-sm text-ink-muted">
            Loading character…
          </p>
        ) : (
          character && <CharacterPanel character={character} />
        )}
      </div>

      <div className="mt-8">
        <CreateTaskForm onCreate={add} />
      </div>
      <div className="mt-6">
        <TaskList tasks={tasks} loading={loading} onComplete={complete} onRemove={remove} />
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

