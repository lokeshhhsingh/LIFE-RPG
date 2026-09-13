"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  xp: number;
  stat: string;
  completed: boolean;
};

type Reward = {
  id: number;
  title: string;
  description: string;
  cost: number;
  icon: string;
};

type SavedGame = {
  playerName: string;
  xp: number;
  coins: number;
  strength: number;
  intelligence: number;
  vitality: number;
  agility: number;
  discipline: number;
  hp: number;
  energy: number;
  streak: number;
  lastCompletionDate: string;
  tasks: Task[];
  rewards: Reward[];
  purchasedRewards: number[];
};

const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Exercise for 30 minutes",
    xp: 20,
    stat: "Strength",
    completed: false,
  },
  {
    id: 2,
    title: "Study for 1 hour",
    xp: 30,
    stat: "Intelligence",
    completed: false,
  },
  {
    id: 3,
    title: "Read a book",
    xp: 15,
    stat: "Discipline",
    completed: false,
  },
];

const defaultRewards: Reward[] = [
  {
    id: 1,
    title: "Cheat Meal",
    description: "Enjoy one guilt-free cheat meal.",
    cost: 100,
    icon: "🍕",
  },
  {
    id: 2,
    title: "1 Hour Gaming",
    description: "Play your favorite game for one hour.",
    cost: 150,
    icon: "🎮",
  },
  {
    id: 3,
    title: "Watch a Movie",
    description: "Relax and watch a movie of your choice.",
    cost: 200,
    icon: "🎬",
  },
  {
    id: 4,
    title: "Extra Relax Time",
    description: "Take some extra time to rest and recharge.",
    cost: 250,
    icon: "🛌",
  },
];

export default function Home() {
  const [playerName, setPlayerName] = useState("Hero");

  const [xp, setXp] = useState(120);
  const [coins, setCoins] = useState(50);

  const [strength, setStrength] = useState(10);
  const [intelligence, setIntelligence] = useState(10);
  const [vitality, setVitality] = useState(10);
  const [agility, setAgility] = useState(10);
  const [discipline, setDiscipline] = useState(10);

  const [hp, setHp] = useState(100);
  const [energy, setEnergy] = useState(100);

  const [streak, setStreak] = useState(0);
  const [lastCompletionDate, setLastCompletionDate] = useState("");

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskXP, setNewTaskXP] = useState(20);
  const [newTaskStat, setNewTaskStat] = useState("Strength");

  const [rewards, setRewards] =
    useState<Reward[]>(defaultRewards);

  const [purchasedRewards, setPurchasedRewards] =
    useState<number[]>([]);

  const [newRewardTitle, setNewRewardTitle] =
    useState("");

  const [newRewardCost, setNewRewardCost] =
    useState(100);

  const [newRewardDescription, setNewRewardDescription] =
    useState("");

  const [gameLoaded, setGameLoaded] = useState(false);

  const [activeSection, setActiveSection] =
    useState("dashboard");

  // =========================
  // LEVEL
  // =========================

  const level = Math.floor(xp / 200) + 1;

  const xpInCurrentLevel = xp % 200;

  const xpProgress = (xpInCurrentLevel / 200) * 100;

  const xpForNextLevel = level * 200;

  // =========================
  // QUESTS
  // =========================

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  // =========================
  // STATS
  // =========================

  const totalStats =
    strength +
    intelligence +
    vitality +
    agility +
    discipline;

  const stats = [
    {
      name: "Strength",
      value: strength,
      icon: "💪",
    },
    {
      name: "Intelligence",
      value: intelligence,
      icon: "🧠",
    },
    {
      name: "Vitality",
      value: vitality,
      icon: "❤️",
    },
    {
      name: "Agility",
      value: agility,
      icon: "⚡",
    },
    {
      name: "Discipline",
      value: discipline,
      icon: "🎯",
    },
  ];

  // =========================
  // ACHIEVEMENTS
  // =========================

  const achievements = [
    {
      id: 1,
      title: "First Quest",
      description: "Complete your first quest.",
      icon: "🥇",
      requirement: "Complete 1 quest",
      unlocked: completedTasks >= 1,
    },
    {
      id: 2,
      title: "Quest Hunter",
      description: "Become a true questing machine.",
      icon: "⚔️",
      requirement: "Complete 5 quests",
      unlocked: completedTasks >= 5,
    },
    {
      id: 3,
      title: "On Fire",
      description: "Keep your daily momentum going.",
      icon: "🔥",
      requirement: "Reach a 3-day streak",
      unlocked: streak >= 3,
    },
    {
      id: 4,
      title: "Strong Warrior",
      description: "Build your physical strength.",
      icon: "💪",
      requirement: "Reach 15 Strength",
      unlocked: strength >= 15,
    },
    {
      id: 5,
      title: "Knowledge Seeker",
      description: "Grow your intelligence through learning.",
      icon: "🧠",
      requirement: "Reach 15 Intelligence",
      unlocked: intelligence >= 15,
    },
    {
      id: 6,
      title: "Level Up!",
      description: "Reach your second character level.",
      icon: "⭐",
      requirement: "Reach Level 2",
      unlocked: level >= 2,
    },
  ];

  const unlockedAchievements = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  // =========================
  // LOAD GAME
  // =========================

  useEffect(() => {
    try {
      const savedGame = localStorage.getItem(
        "life-rpg-save"
      );

      if (savedGame) {
        const game: SavedGame = JSON.parse(savedGame);

        setPlayerName(game.playerName);
        setXp(game.xp);
        setCoins(game.coins);

        setStrength(game.strength);
        setIntelligence(game.intelligence);
        setVitality(game.vitality);
        setAgility(game.agility);
        setDiscipline(game.discipline);

        setHp(game.hp);
        setEnergy(game.energy);

        setStreak(game.streak);
        setLastCompletionDate(
          game.lastCompletionDate
        );

        setTasks(game.tasks);
        setRewards(game.rewards);
        setPurchasedRewards(
          game.purchasedRewards
        );
      }
    } catch (error) {
      console.error(
        "Could not load saved game:",
        error
      );
    }

    setGameLoaded(true);
  }, []);

  // =========================
  // SAVE GAME
  // =========================

  useEffect(() => {
    if (!gameLoaded) {
      return;
    }

    const game: SavedGame = {
      playerName,
      xp,
      coins,

      strength,
      intelligence,
      vitality,
      agility,
      discipline,

      hp,
      energy,

      streak,
      lastCompletionDate,

      tasks,
      rewards,
      purchasedRewards,
    };

    try {
      localStorage.setItem(
        "life-rpg-save",
        JSON.stringify(game)
      );
    } catch (error) {
      console.error(
        "Could not save game:",
        error
      );
    }
  }, [
    gameLoaded,
    playerName,
    xp,
    coins,
    strength,
    intelligence,
    vitality,
    agility,
    discipline,
    hp,
    energy,
    streak,
    lastCompletionDate,
    tasks,
    rewards,
    purchasedRewards,
  ]);

  // =========================
  // DATE
  // =========================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getYesterdayDate = () => {
    const yesterday = new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const year = yesterday.getFullYear();
    const month = String(
      yesterday.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      yesterday.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================
  // STREAK
  // =========================

  const updateStreak = () => {
    const today = getTodayDate();
    const yesterday = getYesterdayDate();

    if (lastCompletionDate === today) {
      return;
    }

    if (lastCompletionDate === yesterday) {
      setStreak(
        (currentStreak) =>
          currentStreak + 1
      );
    } else {
      setStreak(1);
    }

    setLastCompletionDate(today);
  };

  // =========================
  // STAT
  // =========================

  const increaseStat = (stat: string) => {
    if (stat === "Strength") {
      setStrength((value) => value + 1);
    }

    if (stat === "Intelligence") {
      setIntelligence(
        (value) => value + 1
      );
    }

    if (stat === "Vitality") {
      setVitality((value) => value + 1);
    }

    if (stat === "Agility") {
      setAgility((value) => value + 1);
    }

    if (stat === "Discipline") {
      setDiscipline(
        (value) => value + 1
      );
    }
  };

  // =========================
  // COMPLETE QUEST
  // =========================

  const completeTask = (id: number) => {
    if (energy < 10) {
      alert(
        "⚡ Not enough Energy! Restore some Energy first."
      );
      return;
    }

    const task = tasks.find(
      (item) => item.id === id
    );

    if (!task || task.completed) {
      return;
    }

    setXp(
      (currentXP) =>
        currentXP + task.xp
    );

    setCoins(
      (currentCoins) =>
        currentCoins + 10
    );

    setEnergy(
      (currentEnergy) =>
        Math.max(
          0,
          currentEnergy - 10
        )
    );

    increaseStat(task.stat);
    updateStreak();

    setTasks(
      (currentTasks) =>
        currentTasks.map((item) =>
          item.id === id
            ? {
                ...item,
                completed: true,
              }
            : item
        )
    );
  };

  // =========================
  // ADD QUEST
  // =========================

  const addTask = () => {
    if (newTaskTitle.trim() === "") {
      alert(
        "Please enter a quest title."
      );
      return;
    }

    if (newTaskXP <= 0) {
      alert(
        "XP must be greater than 0."
      );
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      xp: newTaskXP,
      stat: newTaskStat,
      completed: false,
    };

    setTasks(
      (currentTasks) => [
        ...currentTasks,
        newTask,
      ]
    );

    setNewTaskTitle("");
    setNewTaskXP(20);
    setNewTaskStat("Strength");
  };

  // =========================
  // DELETE QUEST
  // =========================

  const deleteTask = (id: number) => {
    setTasks(
      (currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== id
        )
    );
  };

  // =========================
  // ENERGY
  // =========================

  const restoreEnergy = () => {
    setEnergy(
      (currentEnergy) =>
        Math.min(
          100,
          currentEnergy + 20
        )
    );
  };

  // =========================
  // BUY REWARD
  // =========================

  const buyReward = (
    reward: Reward
  ) => {
    if (
      purchasedRewards.includes(
        reward.id
      )
    ) {
      return;
    }

    if (coins < reward.cost) {
      alert(
        `🪙 Not enough coins! You need ${reward.cost} coins.`
      );
      return;
    }

    setCoins(
      (currentCoins) =>
        currentCoins - reward.cost
    );

    setPurchasedRewards(
      (currentPurchased) => [
        ...currentPurchased,
        reward.id,
      ]
    );

    alert(
      `🎉 Reward unlocked: ${reward.title}!`
    );
  };

  // =========================
  // ADD REWARD
  // =========================

  const addReward = () => {
    if (
      newRewardTitle.trim() === ""
    ) {
      alert(
        "Please enter a reward name."
      );
      return;
    }

    if (newRewardCost <= 0) {
      alert(
        "Reward cost must be greater than 0."
      );
      return;
    }

    const newReward: Reward = {
      id: Date.now(),
      title: newRewardTitle.trim(),
      description:
        newRewardDescription.trim() ||
        "A custom reward for your hard work.",
      cost: newRewardCost,
      icon: "🎁",
    };

    setRewards(
      (currentRewards) => [
        ...currentRewards,
        newReward,
      ]
    );

    setNewRewardTitle("");
    setNewRewardCost(100);
    setNewRewardDescription("");
  };

  // =========================
  // DELETE REWARD
  // =========================

  const deleteReward = (
    id: number
  ) => {
    setRewards(
      (currentRewards) =>
        currentRewards.filter(
          (reward) =>
            reward.id !== id
        )
    );

    setPurchasedRewards(
      (currentPurchased) =>
        currentPurchased.filter(
          (rewardId) =>
            rewardId !== id
        )
    );
  };

  // =========================
  // RESET
  // =========================

  const resetGame = () => {
    const confirmed =
      window.confirm(
        "⚠️ Are you sure you want to reset ALL progress?"
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      "life-rpg-save"
    );

    setPlayerName("Hero");

    setXp(120);
    setCoins(50);

    setStrength(10);
    setIntelligence(10);
    setVitality(10);
    setAgility(10);
    setDiscipline(10);

    setHp(100);
    setEnergy(100);

    setStreak(0);
    setLastCompletionDate("");

    setTasks(defaultTasks);
    setRewards(defaultRewards);
    setPurchasedRewards([]);

    alert(
      "🔄 Your Life RPG has been reset."
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =========================
          TOP NAVIGATION
      ========================= */}

      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-lg border-b border-slate-800">

        <div className="max-w-6xl mx-auto px-4">

          <div className="flex items-center justify-between h-16">

            <button
              onClick={() =>
                setActiveSection(
                  "dashboard"
                )
              }
              className="font-bold text-xl whitespace-nowrap"
            >
              ⚔️ Life RPG
            </button>

            <div className="hidden md:flex items-center gap-1">

              {[
                ["dashboard", "🏠 Dashboard"],
                ["character", "🧙 Character"],
                ["quests", "⚔️ Quests"],
                ["achievements", "🏆 Achievements"],
                ["shop", "🛒 Shop"],
              ].map(([id, label]) => (

                <button
                  key={id}
                  onClick={() =>
                    setActiveSection(id)
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    activeSection === id
                      ? "bg-purple-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {label}
                </button>

              ))}

            </div>

            <div className="flex items-center gap-2">

              <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg text-sm">
                🪙 {coins}
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg text-sm">
                Lv. {level}
              </div>

            </div>

          </div>

          {/* MOBILE NAV */}

          <div className="md:hidden flex gap-2 overflow-x-auto pb-3">

            {[
              ["dashboard", "🏠"],
              ["character", "🧙"],
              ["quests", "⚔️"],
              ["achievements", "🏆"],
              ["shop", "🛒"],
            ].map(([id, icon]) => (

              <button
                key={id}
                onClick={() =>
                  setActiveSection(id)
                }
                className={`min-w-[48px] h-10 rounded-lg font-bold transition ${
                  activeSection === id
                    ? "bg-purple-600"
                    : "bg-slate-900 border border-slate-800"
                }`}
              >
                {icon}
              </button>

            ))}

          </div>

        </div>

      </nav>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">

        {/* SAVE STATUS */}

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3 mb-6">

          <div className="flex items-center justify-between gap-3">

            <p className="text-green-400 text-sm">
              💾 Progress saved automatically
            </p>

            <span className="text-xs text-green-500">
              {gameLoaded
                ? "Saved"
                : "Loading..."}
            </span>

          </div>

        </div>

        {/* =========================
            DASHBOARD
        ========================= */}

        {activeSection === "dashboard" && (

          <section>

            <div className="mb-8">

              <p className="text-purple-400 font-semibold text-sm">
                WELCOME BACK, ADVENTURER
              </p>

              <h1 className="text-4xl md:text-5xl font-black mt-2">
                {playerName} ⚔️
              </h1>

              <p className="text-slate-400 mt-2">
                Turn your real life into an RPG.
              </p>

            </div>

            {/* QUICK STATS */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">

                <p className="text-slate-500 text-xs">
                  LEVEL
                </p>

                <p className="text-3xl font-black mt-1">
                  {level}
                </p>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">

                <p className="text-slate-500 text-xs">
                  XP
                </p>

                <p className="text-2xl font-black mt-1">
                  ⭐ {xp}
                </p>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">

                <p className="text-slate-500 text-xs">
                  STREAK
                </p>

                <p className="text-2xl font-black mt-1">
                  🔥 {streak}
                </p>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">

                <p className="text-slate-500 text-xs">
                  QUESTS
                </p>

                <p className="text-2xl font-black mt-1">
                  ⚔️ {completedTasks}
                </p>

              </div>

            </div>

            {/* XP */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6">

              <div className="flex justify-between mb-3">

                <div>
                  <p className="font-bold">
                    ⭐ Experience
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Level {level}
                  </p>
                </div>

                <p className="text-sm text-slate-400">
                  {xpInCurrentLevel} / 200 XP
                </p>

              </div>

              <div className="h-4 bg-slate-800 rounded-full overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full transition-all duration-700"
                  style={{
                    width: `${xpProgress}%`,
                  }}
                />

              </div>

              <p className="text-xs text-slate-500 mt-2">
                {xpForNextLevel - xp} XP until your next level
              </p>

            </div>

            {/* HP / ENERGY */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <div className="flex justify-between">

                  <div>

                    <p className="text-slate-400 text-sm">
                      Health
                    </p>

                    <p className="text-2xl font-black mt-1">
                      ❤️ {hp} / 100
                    </p>

                  </div>

                  <span className="text-3xl">
                    ❤️
                  </span>

                </div>

                <div className="h-3 bg-slate-800 rounded-full overflow-hidden mt-4">

                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${hp}%`,
                    }}
                  />

                </div>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <div className="flex justify-between">

                  <div>

                    <p className="text-slate-400 text-sm">
                      Energy
                    </p>

                    <p className="text-2xl font-black mt-1">
                      ⚡ {energy} / 100
                    </p>

                  </div>

                  <span className="text-3xl">
                    ⚡
                  </span>

                </div>

                <div className="h-3 bg-slate-800 rounded-full overflow-hidden mt-4">

                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{
                      width: `${energy}%`,
                    }}
                  />

                </div>

                <button
                  onClick={restoreEnergy}
                  className="mt-4 w-full bg-cyan-600 hover:bg-cyan-500 py-2 rounded-lg font-bold transition"
                >
                  ⚡ Restore 20 Energy
                </button>

              </div>

            </div>

            {/* DASHBOARD QUEST PREVIEW */}

            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-2xl font-bold">
                  ⚔️ Today&apos;s Quests
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  {completedTasks} of {tasks.length} completed
                </p>
              </div>

              <button
                onClick={() =>
                  setActiveSection("quests")
                }
                className="text-purple-400 hover:text-purple-300 text-sm font-bold"
              >
                View All →
              </button>

            </div>

            <div className="space-y-3">

              {tasks.slice(0, 3).map(
                (task) => (

                  <div
                    key={task.id}
                    className={`bg-slate-900 border rounded-2xl p-4 transition ${
                      task.completed
                        ? "border-green-500/30 opacity-60"
                        : "border-slate-800 hover:border-purple-500/40"
                    }`}
                  >

                    <div className="flex items-center gap-3">

                      <div className="text-2xl">
                        {task.completed
                          ? "✅"
                          : "⚔️"}
                      </div>

                      <div className="flex-1 min-w-0">

                        <p
                          className={`font-bold truncate ${
                            task.completed
                              ? "line-through text-slate-500"
                              : ""
                          }`}
                        >
                          {task.title}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          +{task.xp} XP • +1 {task.stat}
                        </p>

                      </div>

                      {!task.completed && (

                        <button
                          onClick={() =>
                            completeTask(
                              task.id
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-sm font-bold transition"
                        >
                          Complete
                        </button>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}

        {/* =========================
            CHARACTER
        ========================= */}

        {activeSection === "character" && (

          <section>

            <div className="mb-6">

              <p className="text-purple-400 text-sm font-bold">
                YOUR HERO
              </p>

              <h1 className="text-4xl font-black mt-1">
                🧙 Character
              </h1>

            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">

              <div className="flex flex-col md:flex-row items-center gap-6">

                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-7xl shadow-2xl">
                  🧙
                </div>

                <div className="text-center md:text-left flex-1">

                  <p className="text-slate-500 text-sm">
                    CHARACTER NAME
                  </p>

                  <h2 className="text-3xl font-black mt-1">
                    {playerName}
                  </h2>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">

                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-bold">
                      Level {level}
                    </span>

                    <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ {xp} XP
                    </span>

                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-5">

                    <input
                      value={playerName}
                      onChange={(event) =>
                        setPlayerName(
                          event.target.value
                        )
                      }
                      className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                      placeholder="Character name"
                    />

                    <button
                      onClick={() => {
                        if (
                          playerName.trim() ===
                          ""
                        ) {
                          setPlayerName(
                            "Hero"
                          );
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-500 px-5 py-3 rounded-xl font-bold transition"
                    >
                      Save Name
                    </button>

                  </div>

                </div>

                <div className="bg-slate-800 rounded-2xl p-6 text-center">

                  <p className="text-slate-500 text-xs">
                    RANK
                  </p>

                  <p className="text-5xl font-black mt-1">
                    {level >= 10
                      ? "S"
                      : level >= 7
                      ? "A"
                      : level >= 4
                      ? "B"
                      : level >= 2
                      ? "C"
                      : "D"}
                  </p>

                </div>

              </div>

            </div>

            {/* STATS */}

            <div className="mt-6">

              <h2 className="text-2xl font-bold mb-4">
                📊 Attributes
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

                {stats.map((stat) => (

                  <div
                    key={stat.name}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-2xl">
                        {stat.icon}
                      </span>

                      <span className="text-3xl font-black">
                        {stat.value}
                      </span>

                    </div>

                    <p className="text-slate-400 text-sm mt-3">
                      {stat.name}
                    </p>

                    <div className="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">

                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            stat.value * 5,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                    <button
                      onClick={() =>
                        increaseStat(
                          stat.name
                        )
                      }
                      className="mt-4 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition"
                    >
                      +1 Test
                    </button>

                  </div>

                ))}

              </div>

            </div>

            {/* CHARACTER SUMMARY */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <p className="text-slate-500 text-xs">
                  TOTAL STATS
                </p>

                <p className="text-3xl font-black mt-1">
                  {totalStats}
                </p>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <p className="text-slate-500 text-xs">
                  COINS
                </p>

                <p className="text-3xl font-black mt-1">
                  🪙 {coins}
                </p>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <p className="text-slate-500 text-xs">
                  STREAK
                </p>

                <p className="text-3xl font-black mt-1">
                  🔥 {streak}
                </p>

              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                <p className="text-slate-500 text-xs">
                  ACHIEVEMENTS
                </p>

                <p className="text-3xl font-black mt-1">
                  🏆 {unlockedAchievements}
                </p>

              </div>

            </div>

          </section>

        )}

        {/* =========================
            QUESTS
        ========================= */}

        {activeSection === "quests" && (

          <section>

            <div className="mb-6">

              <p className="text-purple-400 text-sm font-bold">
                YOUR MISSIONS
              </p>

              <h1 className="text-4xl font-black mt-1">
                ⚔️ Quests
              </h1>

              <p className="text-slate-400 mt-2">
                Complete real-life tasks to level up.
              </p>

            </div>

            {/* ADD QUEST */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-5">

              <h2 className="font-bold text-lg mb-4">
                ➕ Create Quest
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                <input
                  type="text"
                  placeholder="Quest title"
                  value={newTaskTitle}
                  onChange={(event) =>
                    setNewTaskTitle(
                      event.target.value
                    )
                  }
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                />

                <input
                  type="number"
                  min="1"
                  value={newTaskXP}
                  onChange={(event) =>
                    setNewTaskXP(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                />

                <select
                  value={newTaskStat}
                  onChange={(event) =>
                    setNewTaskStat(
                      event.target.value
                    )
                  }
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
                >

                  <option value="Strength">
                    Strength
                  </option>

                  <option value="Intelligence">
                    Intelligence
                  </option>

                  <option value="Vitality">
                    Vitality
                  </option>

                  <option value="Agility">
                    Agility
                  </option>

                  <option value="Discipline">
                    Discipline
                  </option>

                </select>

                <button
                  onClick={addTask}
                  className="bg-green-600 hover:bg-green-500 rounded-xl px-4 py-3 font-bold transition"
                >
                  Add Quest
                </button>

              </div>

            </div>

            {/* QUEST LIST */}

            <div className="space-y-3">

              {tasks.map((task) => (

                <div
                  key={task.id}
                  className={`bg-slate-900 border rounded-2xl p-5 transition hover:-translate-y-0.5 ${
                    task.completed
                      ? "border-green-500/30 opacity-60"
                      : "border-slate-800 hover:border-purple-500/40"
                  }`}
                >

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {task.completed
                        ? "✅"
                        : "⚔️"}
                    </div>

                    <div className="flex-1 min-w-0">

                      <h3
                        className={`font-bold text-lg ${
                          task.completed
                            ? "line-through text-slate-500"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-2">

                        <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full text-xs font-bold">
                          +{task.xp} XP
                        </span>

                        <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full text-xs font-bold">
                          +1 {task.stat}
                        </span>

                        <span className="bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full text-xs font-bold">
                          +10 🪙
                        </span>

                        <span className="bg-red-500/10 text-red-400 px-2 py-1 rounded-full text-xs font-bold">
                          -10 ⚡
                        </span>

                      </div>

                    </div>

                    <div className="flex gap-2">

                      {!task.completed && (

                        <button
                          onClick={() =>
                            completeTask(
                              task.id
                            )
                          }
                          className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl font-bold transition"
                        >
                          Complete
                        </button>

                      )}

                      <button
                        onClick={() =>
                          deleteTask(
                            task.id
                          )
                        }
                        className="bg-red-600 hover:bg-red-500 px-3 py-2.5 rounded-xl transition"
                      >
                        🗑️
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {tasks.length === 0 && (

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

                <p className="text-5xl">
                  📭
                </p>

                <p className="font-bold text-lg mt-4">
                  No quests yet
                </p>

                <p className="text-slate-500 text-sm mt-1">
                  Create your first quest above.
                </p>

              </div>

            )}

          </section>

        )}

        {/* =========================
            ACHIEVEMENTS
        ========================= */}

        {activeSection === "achievements" && (

          <section>

            <div className="mb-6">

              <p className="text-purple-400 text-sm font-bold">
                YOUR TROPHIES
              </p>

              <h1 className="text-4xl font-black mt-1">
                🏆 Achievements
              </h1>

              <p className="text-slate-400 mt-2">
                {unlockedAchievements} of{" "}
                {achievements.length} unlocked.
              </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {achievements.map(
                (achievement) => (

                  <div
                    key={achievement.id}
                    className={`rounded-2xl border p-5 transition hover:-translate-y-1 ${
                      achievement.unlocked
                        ? "bg-yellow-950/30 border-yellow-500/40"
                        : "bg-slate-900 border-slate-800 opacity-60"
                    }`}
                  >

                    <div className="flex items-start gap-4">

                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
                          achievement.unlocked
                            ? "bg-yellow-500/20"
                            : "bg-slate-800"
                        }`}
                      >
                        {achievement.unlocked
                          ? achievement.icon
                          : "🔒"}
                      </div>

                      <div>

                        <div className="flex items-center gap-2 flex-wrap">

                          <h3 className="font-bold text-lg">
                            {achievement.title}
                          </h3>

                          {achievement.unlocked && (

                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                              Unlocked
                            </span>

                          )}

                        </div>

                        <p className="text-slate-400 text-sm mt-1">
                          {achievement.description}
                        </p>

                        <p className="text-xs text-slate-500 mt-3">
                          {achievement.requirement}
                        </p>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}

        {/* =========================
            SHOP
        ========================= */}

        {activeSection === "shop" && (

          <section>

            <div className="mb-6">

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">

                <div>

                  <p className="text-purple-400 text-sm font-bold">
                    SPEND YOUR LOOT
                  </p>

                  <h1 className="text-4xl font-black mt-1">
                    🛒 Reward Shop
                  </h1>

                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3">

                  <p className="text-yellow-500 text-xs">
                    BALANCE
                  </p>

                  <p className="text-xl font-black text-yellow-400">
                    🪙 {coins}
                  </p>

                </div>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {rewards.map((reward) => {

                const purchased =
                  purchasedRewards.includes(
                    reward.id
                  );

                const canAfford =
                  coins >= reward.cost;

                return (

                  <div
                    key={reward.id}
                    className={`bg-slate-900 border rounded-2xl p-5 transition hover:-translate-y-1 ${
                      purchased
                        ? "border-green-500/40"
                        : "border-slate-800"
                    }`}
                  >

                    <div className="flex gap-4">

                      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-4xl shrink-0">
                        {purchased
                          ? "✅"
                          : reward.icon}
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">

                          <div>

                            <h3 className="font-bold text-lg">
                              {reward.title}
                            </h3>

                            <p className="text-slate-400 text-sm mt-1">
                              {reward.description}
                            </p>

                          </div>

                          <span className="text-yellow-400 font-black whitespace-nowrap">
                            🪙 {reward.cost}
                          </span>

                        </div>

                        <div className="flex gap-2 mt-4">

                          {!purchased && (

                            <button
                              onClick={() =>
                                buyReward(
                                  reward
                                )
                              }
                              disabled={
                                !canAfford
                              }
                              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold transition ${
                                canAfford
                                  ? "bg-green-600 hover:bg-green-500"
                                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              {canAfford
                                ? "Buy Reward"
                                : "Need More Coins"}
                            </button>

                          )}

                          {purchased && (

                            <div className="text-green-400 bg-green-500/10 px-4 py-2 rounded-xl font-bold">
                              Purchased ✓
                            </div>

                          )}

                          <button
                            onClick={() =>
                              deleteReward(
                                reward.id
                              )
                            }
                            className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-xl transition"
                          >
                            🗑️
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

            {/* CUSTOM REWARD */}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mt-5">

              <h2 className="font-bold text-lg mb-4">
                🎁 Create Custom Reward
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                <input
                  type="text"
                  placeholder="Reward name"
                  value={newRewardTitle}
                  onChange={(event) =>
                    setNewRewardTitle(
                      event.target.value
                    )
                  }
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
                />

                <input
                  type="number"
                  min="1"
                  value={newRewardCost}
                  onChange={(event) =>
                    setNewRewardCost(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
                />

                <input
                  type="text"
                  placeholder="Description"
                  value={
                    newRewardDescription
                  }
                  onChange={(event) =>
                    setNewRewardDescription(
                      event.target.value
                    )
                  }
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-yellow-500"
                />

                <button
                  onClick={addReward}
                  className="bg-yellow-600 hover:bg-yellow-500 rounded-xl px-4 py-3 font-bold transition"
                >
                  Add Reward
                </button>

              </div>

            </div>

          </section>

        )}

        {/* =========================
            SETTINGS
        ========================= */}

        <section className="mt-12 bg-slate-900 border border-red-900/40 rounded-2xl p-5">

          <h2 className="font-bold text-lg">
            ⚙️ Game Settings
          </h2>

          <p className="text-slate-500 text-sm mt-1 mb-4">
            Your progress is saved automatically in this browser.
          </p>

          <button
            onClick={resetGame}
            className="bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-xl font-bold transition"
          >
            🔄 Reset All Progress
          </button>

        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="text-center text-slate-600 text-sm py-10">
          Life RPG • Level up your real life ⚔️
        </footer>

      </div>

    </main>
  );
}