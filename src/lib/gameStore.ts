import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Badge, Mission, XPEventType } from '@/types';

const BADGES: Badge[] = [
  { id: 'first_step', name: 'First Steps', description: 'Submit your first solution step', icon: '🎯', requirement: 'Submit 1 step', xpReward: 25, unlocked: false },
  { id: 'correct_step', name: 'Sharp Mind', description: 'Get your first correct step', icon: '✅', requirement: 'Get 1 correct step', xpReward: 50, unlocked: false },
  { id: 'quiz_master', name: 'Quiz Master', description: 'Complete 5 quizzes', icon: '📝', requirement: 'Complete 5 quizzes', xpReward: 100, unlocked: false },
  { id: 'perfect_score', name: 'Perfectionist', description: 'Get a perfect quiz score', icon: '💯', requirement: 'Score 100% on a quiz', xpReward: 150, unlocked: false },
  { id: 'flashcard_fan', name: 'Memory Master', description: 'Review 50 flashcards', icon: '🧠', requirement: 'Review 50 flashcards', xpReward: 75, unlocked: false },
  { id: 'week_streak', name: 'On Fire', description: 'Maintain a 7-day streak', icon: '🔥', requirement: '7-day streak', xpReward: 200, unlocked: false },
  { id: 'study_planner', name: 'Organized Learner', description: 'Create your first study plan', icon: '📅', requirement: 'Create 1 study plan', xpReward: 50, unlocked: false },
  { id: 'doubt_solver', name: 'Problem Solver', description: 'Solve 10 doubts with AI tutor', icon: '💡', requirement: 'Solve 10 doubts', xpReward: 100, unlocked: false },
  { id: 'level_10', name: 'Rising Star', description: 'Reach level 10', icon: '⭐', requirement: 'Reach level 10', xpReward: 250, unlocked: false },
  { id: 'ocr_explorer', name: 'OCR Explorer', description: 'Upload 5 images for text extraction', icon: '📸', requirement: 'Upload 5 images', xpReward: 50, unlocked: false },
];

const DAILY_MISSIONS: Omit<Mission, 'progress' | 'completed'>[] = [
  { id: 'mission_quiz', title: 'Quiz Champion', description: 'Complete 2 quizzes today', type: 'quiz', target: 2, xpReward: 75 },
  { id: 'mission_flashcard', title: 'Flash Review', description: 'Review 15 flashcards', type: 'flashcard', target: 15, xpReward: 50 },
  { id: 'mission_doubt', title: 'Curious Mind', description: 'Ask 3 questions to the AI tutor', type: 'doubt', target: 3, xpReward: 60 },
  { id: 'mission_study', title: 'Focused Learner', description: 'Complete 1 study session', type: 'study', target: 1, xpReward: 40 },
];

const XP_REWARDS: Record<XPEventType, number> = {
  correct_step: 10,
  submit_step: 2,
  complete_quiz: 50,
  perfect_quiz: 25,
  review_flashcard: 3,
  complete_mission: 0, // Dynamic based on mission
  streak_bonus: 0, // Dynamic based on streak
};

const calculateLevel = (xp: number): number => {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const getLevelTitle = (level: number): string => {
  if (level <= 5) return 'Novice Learner';
  if (level <= 10) return 'Curious Student';
  if (level <= 20) return 'Knowledge Seeker';
  if (level <= 35) return 'Wisdom Gatherer';
  if (level <= 50) return 'Expert Scholar';
  if (level <= 75) return 'Master Mind';
  return 'Knowledge Legend';
};

interface GameState {
  user: User;
  badges: Badge[];
  missions: Mission[];
  stats: {
    quizzesCompleted: number;
    flashcardsReviewed: number;
    doubtsAsked: number;
    stepsSubmitted: number;
    correctSteps: number;
    studyPlansCreated: number;
    imagesUploaded: number;
  };
  addXP: (type: XPEventType, customAmount?: number) => { xpGained: number; leveledUp: boolean; newLevel?: number };
  updateStreak: () => void;
  unlockBadge: (badgeId: string) => Badge | null;
  updateMissionProgress: (type: Mission['type'], amount?: number) => void;
  resetDailyMissions: () => void;
  incrementStat: (stat: keyof GameState['stats']) => void;
  getStreakMultiplier: () => number;
  getLevelProgress: () => { current: number; next: number; progress: number };
  getLevelTitle: () => string;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'user-1',
        name: 'Learner',
        xp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        badges: [],
        createdAt: new Date().toISOString(),
      },
      badges: BADGES,
      missions: DAILY_MISSIONS.map(m => ({ ...m, progress: 0, completed: false })),
      stats: {
        quizzesCompleted: 0,
        flashcardsReviewed: 0,
        doubtsAsked: 0,
        stepsSubmitted: 0,
        correctSteps: 0,
        studyPlansCreated: 0,
        imagesUploaded: 0,
      },

      addXP: (type, customAmount) => {
        const state = get();
        const baseXP = customAmount ?? XP_REWARDS[type];
        const multiplier = state.getStreakMultiplier();
        const xpGained = Math.floor(baseXP * multiplier);
        const newXP = state.user.xp + xpGained;
        const newLevel = calculateLevel(newXP);
        const leveledUp = newLevel > state.user.level;

        set({
          user: {
            ...state.user,
            xp: newXP,
            level: newLevel,
          },
        });

        // Check for level 10 badge
        if (newLevel >= 10) {
          get().unlockBadge('level_10');
        }

        return { xpGained, leveledUp, newLevel: leveledUp ? newLevel : undefined };
      },

      updateStreak: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const lastActive = state.user.lastActiveDate;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = state.user.streak;
        if (lastActive === yesterdayStr) {
          newStreak += 1;
        } else if (lastActive !== today) {
          newStreak = 1;
        }

        set({
          user: {
            ...state.user,
            streak: newStreak,
            lastActiveDate: today,
          },
        });

        // Check for streak badge
        if (newStreak >= 7) {
          get().unlockBadge('week_streak');
        }
      },

      unlockBadge: (badgeId) => {
        const state = get();
        const badge = state.badges.find(b => b.id === badgeId);
        if (!badge || badge.unlocked) return null;

        const updatedBadges = state.badges.map(b =>
          b.id === badgeId ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
        );

        set({
          badges: updatedBadges,
          user: {
            ...state.user,
            badges: [...state.user.badges, badgeId],
            xp: state.user.xp + badge.xpReward,
          },
        });

        return { ...badge, unlocked: true };
      },

      updateMissionProgress: (type, amount = 1) => {
        const state = get();
        const updatedMissions = state.missions.map(m => {
          if (m.type === type && !m.completed) {
            const newProgress = Math.min(m.progress + amount, m.target);
            const completed = newProgress >= m.target;
            if (completed && !m.completed) {
              // Award mission XP
              get().addXP('complete_mission', m.xpReward);
            }
            return { ...m, progress: newProgress, completed };
          }
          return m;
        });

        set({ missions: updatedMissions });
      },

      resetDailyMissions: () => {
        set({
          missions: DAILY_MISSIONS.map(m => ({ ...m, progress: 0, completed: false })),
        });
      },

      incrementStat: (stat) => {
        const state = get();
        const newStats = { ...state.stats, [stat]: state.stats[stat] + 1 };
        set({ stats: newStats });

        // Check for badge unlocks based on stats
        if (stat === 'stepsSubmitted' && newStats.stepsSubmitted === 1) {
          get().unlockBadge('first_step');
        }
        if (stat === 'correctSteps' && newStats.correctSteps === 1) {
          get().unlockBadge('correct_step');
        }
        if (stat === 'quizzesCompleted' && newStats.quizzesCompleted >= 5) {
          get().unlockBadge('quiz_master');
        }
        if (stat === 'flashcardsReviewed' && newStats.flashcardsReviewed >= 50) {
          get().unlockBadge('flashcard_fan');
        }
        if (stat === 'studyPlansCreated' && newStats.studyPlansCreated === 1) {
          get().unlockBadge('study_planner');
        }
        if (stat === 'doubtsAsked' && newStats.doubtsAsked >= 10) {
          get().unlockBadge('doubt_solver');
        }
        if (stat === 'imagesUploaded' && newStats.imagesUploaded >= 5) {
          get().unlockBadge('ocr_explorer');
        }
      },

      getStreakMultiplier: () => {
        const streak = get().user.streak;
        if (streak >= 30) return 2.0;
        if (streak >= 14) return 1.75;
        if (streak >= 7) return 1.5;
        if (streak >= 3) return 1.25;
        return 1.0;
      },

      getLevelProgress: () => {
        const xp = get().user.xp;
        const level = get().user.level;
        const currentLevelXP = Math.pow(level - 1, 2) * 100;
        const nextLevelXP = Math.pow(level, 2) * 100;
        const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
        return { current: xp - currentLevelXP, next: nextLevelXP - currentLevelXP, progress };
      },

      getLevelTitle: () => getLevelTitle(get().user.level),
    }),
    {
      name: 'graspify-game-storage',
    }
  )
);
