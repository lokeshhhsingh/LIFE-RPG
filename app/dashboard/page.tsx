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

  const {
    tasks,
    loading,
    error,
    lastLevelUp,
    add,
    complete,
    remove,
    clearLevelUp,
    clearError,
  } = useTasks();

  const {
    character,
    loading: characterLoading,
    setCharacter,
  } = useCharacter();

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
    <section
      data-page="dashboard"
      className="min-h-screen bg-[#08080d] text-white selection:bg-purple-500/30"
    >
      {/* =========================================
          HEADER
      ========================================== */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#08080d]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* Brand */}
          <button
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 p-1.5 shadow-lg shadow-purple-950/20 transition group-hover:border-purple-400/40 group-hover:bg-purple-500/15">
              <img
                src="/images/life-rpg-logo.png"
                alt="Life RPG"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-black tracking-[0.12em] text-white">
                LIFE RPG
              </p>

              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">
                Level up your life
              </p>
            </div>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <a
              href="/dashboard"
              className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-500"
            >
              Dashboard
            </a>

            <a
              href="/character"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              Character
            </a>

            <a
              href="/quests"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              Quests
            </a>

            <a
              href="/achievements"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              Achievements
            </a>

            <a
              href="/shop"
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              Shop
            </a>
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-gray-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
          >
            <span className="hidden sm:inline">Log Out</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>

        {/* Mobile navigation */}
        <div className="border-t border-white/[0.06] bg-black/10 px-4 py-2.5 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto pb-0.5">
            <a
              href="/dashboard"
              className="shrink-0 rounded-lg bg-purple-600 px-3.5 py-2 text-xs font-bold text-white"
            >
              Dashboard
            </a>

            <a
              href="/character"
              className="shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Character
            </a>

            <a
              href="/quests"
              className="shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Quests
            </a>

            <a
              href="/achievements"
              className="shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Achievements
            </a>

            <a
              href="/shop"
              className="shrink-0 rounded-lg px-3.5 py-2 text-xs font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
            >
              Shop
            </a>
          </nav>
        </div>
      </header>

      {/* =========================================
          MAIN
      ========================================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* Hero introduction */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-purple-400/10 bg-gradient-to-br from-purple-500/[0.10] via-white/[0.03] to-transparent p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />

          <div className="relative">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />

              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 sm:text-xs">
                Your Adventure
              </p>
            </div>

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
                  Your Quest Log
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base">
                  Complete quests, earn XP, collect rewards, and become the
                  best version of yourself.
                </p>
              </div>

              <a
                href="/shop"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-300 transition hover:border-yellow-300/30 hover:bg-yellow-400/15"
              >
                <span className="text-base">🪙</span>
                Visit Shop
              </a>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3.5 text-sm text-red-200">
            <p role="alert" data-component="task-error">
              {error}
            </p>

            <button
              onClick={clearError}
              aria-label="Dismiss error"
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold text-red-300 transition hover:bg-red-500/10"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* =========================================
            CHARACTER / RPG STATS
        ========================================== */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />

            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
              Character Status
            </span>

            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-1 shadow-2xl shadow-black/20">
            <CharacterPanel
              character={character}
              loading={characterLoading}
            />
          </div>
        </div>

        {/* Level-up celebration */}
        <LevelUpCelebration
          data={lastLevelUp}
          onDismiss={clearLevelUp}
        />

        {/* =========================================
            CREATE QUEST
        ========================================== */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/20">
          <div className="border-b border-white/[0.07] bg-white/[0.015] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                ✦
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-400">
                  New Mission
                </p>

                <h2 className="mt-0.5 text-xl font-black text-white">
                  Create a Quest
                </h2>
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Turn something you want to accomplish into an XP-giving quest.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <CreateTaskForm onCreate={add} />
          </div>
        </div>

        {/* =========================================
            QUEST LIST
        ========================================== */}
        <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/20">
          <div className="border-b border-white/[0.07] bg-white/[0.015] px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-lg shadow-green-400/40" />

                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-green-400">
                    Active Missions
                  </p>
                </div>

                <h2 className="mt-1 text-xl font-black text-white">
                  Today&apos;s Quests
                </h2>
              </div>

              <div className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-bold text-gray-400">
                {tasks.length}{" "}
                {tasks.length === 1 ? "Quest" : "Quests"}
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <TaskList
              tasks={tasks}
              loading={loading}
              onComplete={complete}
              onRemove={remove}
            />
          </div>
        </div>

        {/* =========================================
            ENCOURAGEMENT
        ========================================== */}
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-purple-400/10 bg-purple-500/[0.04] px-5 py-8 text-center sm:px-8">
          <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-64 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative">
            <p className="text-lg font-black text-white sm:text-xl">
              Every quest completed is progress.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Keep going, adventurer. Your next level is waiting.
            </p>
          </div>
        </div>
      </main>
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