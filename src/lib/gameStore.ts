/**
 * Game Store Module - Zustand State Management
 * 
 * This module manages all gamification-related state including:
 * - User profile, XP, levels, and streaks
 * - Badges earned and achievements
 * - Daily missions and progress tracking
 * - Player statistics
 * 
 * Uses Zustand with persist middleware for localStorage persistence
 */

// Zustand - lightweight state management library
import { create } from 'zustand';

// Persist middleware - automatically saves state to localStorage
import { persist } from 'zustand/middleware';

// Type definitions for game entities
import { User, Badge, Mission, XPEventType } from '@/types';

/**
 * BADGES - Collection of all available badges/achievements
 * Users can unlock these by completing specific requirements
 */
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

/**
 * DAILY_MISSIONS - Collection of missions that reset daily
 * Players must complete these to earn bonus XP
 */
const DAILY_MISSIONS: Omit<Mission, 'progress' | 'completed'>[] = [
  { id: 'mission_quiz', title: 'Quiz Champion', description: 'Complete 2 quizzes today', type: 'quiz', target: 2, xpReward: 75 },
  { id: 'mission_flashcard', title: 'Flash Review', description: 'Review 15 flashcards', type: 'flashcard', target: 15, xpReward: 50 },
  { id: 'mission_doubt', title: 'Curious Mind', description: 'Ask 3 questions to the AI tutor', type: 'doubt', target: 3, xpReward: 60 },
  { id: 'mission_study', title: 'Focused Learner', description: 'Complete 1 study session', type: 'study', target: 1, xpReward: 40 },
];

/**
 * XP_REWARDS - Mapping of events to their base XP values
 * Actual XP earned is multiplied by streak multiplier
 */
const XP_REWARDS: Record<XPEventType, number> = {
  correct_step: 10,
  submit_step: 2,
  complete_quiz: 50,
  perfect_quiz: 25,
  review_flashcard: 3,
  complete_mission: 0, // Dynamic based on mission
  streak_bonus: 0, // Dynamic based on streak
};

/**
 * calculateLevel - Converts total XP to player level
 * Formula: level = floor(sqrt(xp / 100)) + 1
 * This creates exponential difficulty progression
 * 
 * @param xp - Total experience points
 * @returns Current level (1+)
 */
const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

/**
 * getLevelTitle - Returns a descriptive title based on player level
 * Provides motivational titles as players progress
 * 
 * @param level - Player level
 * @returns Descriptive level title
 */
const getLevelTitle = (level: number): string => {
  if (level <= 5) return 'Novice Learner';
  if (level <= 10) return 'Curious Student';
  if (level <= 20) return 'Knowledge Seeker';
  if (level <= 35) return 'Wisdom Gatherer';
  if (level <= 50) return 'Expert Scholar';
  if (level <= 75) return 'Master Mind';
  return 'Knowledge Legend';
};

/**
 * GameState Interface
 * Defines the shape of all game state and actions available
 */
interface GameState {
  // User profile information
  user: User;
  
  // All available badges in the game
  badges: Badge[];
  
  // Daily missions for the user
  missions: Mission[];
  
  // Track user activity across different features
  stats: {
    quizzesCompleted: number;
    flashcardsReviewed: number;
    doubtsAsked: number;
    stepsSubmitted: number;
    correctSteps: number;
    studyPlansCreated: number;
    imagesUploaded: number;
  };
  
  // Action methods
  /**
   * Add XP to the user for various events
   * Applies streak multiplier automatically
   */
  addXP: (type: XPEventType, customAmount?: number) => { xpGained: number; leveledUp: boolean; newLevel?: number };
  
  /**
   * Update user's daily streak
   * Handles streak continuation and reset logic
   */
  updateStreak: () => void;
  
  /**
   * Unlock a badge for the user
   * Awards bonus XP when badge is unlocked
   */
  unlockBadge: (badgeId: string) => Badge | null;
  
  /**
   * Progress daily mission towards completion
   */
  updateMissionProgress: (type: Mission['type'], amount?: number) => void;
  
  /**
   * Reset all daily missions (called at midnight)
   */
  resetDailyMissions: () => void;
  
  /**
   * Increment a player statistic
   * May trigger badge unlocks based on thresholds
   */
  incrementStat: (stat: keyof GameState['stats']) => void;
  
  /**
   * Get XP multiplier based on current streak
   */
  getStreakMultiplier: () => number;
  
  /**
   * Get progress towards next level
   */
  getLevelProgress: () => { current: number; next: number; progress: number };
  
  /**
   * Get the title for current level
   */
  getLevelTitle: () => string;

  /**
   * Update user information (for login/registration)
   * Updates name and email fields
   */
  setUser: (updates: Partial<Omit<User, 'id' | 'xp' | 'level' | 'streak' | 'badges' | 'createdAt' | 'lastActiveDate'>>) => void;

  /**
   * Check if user is currently logged in
   */
  isAuthenticated: () => boolean;

  /**
   * Logout user and clear session
   */
  logout: () => void;
}

/**
 * useGameStore - Main game state hook
 * Created with Zustand, persisted to localStorage under 'graspify-game-storage'
 */
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial user state
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
      // Initialize badges from BADGES array
      badges: BADGES,
      
      // Initialize missions with 0 progress, marked as not completed
      missions: DAILY_MISSIONS.map(m => ({ ...m, progress: 0, completed: false })),
      
      // Initialize all statistics to 0
      stats: {
        quizzesCompleted: 0,
        flashcardsReviewed: 0,
        doubtsAsked: 0,
        stepsSubmitted: 0,
        correctSteps: 0,
        studyPlansCreated: 0,
        imagesUploaded: 0,
      },

      /**
       * addXP - Award XP to the player for various activities
       * Automatically applies streak multiplier for extra rewards
       * 
       * @param type - Type of activity (from XPEventType enum)
       * @param customAmount - Override default XP amount (optional)
       * @returns Object with xpGained, leveledUp status, and new level if leveled up
       */
      addXP: (type, customAmount) => {
        const state = get();
        
        // Get base XP from rewards table, or use custom amount
        const baseXP = customAmount ?? XP_REWARDS[type];
        
        // Apply streak multiplier (1.0 to 2.0x)
        const multiplier = state.getStreakMultiplier();
        const xpGained = Math.floor(baseXP * multiplier);
        
        // Calculate new total XP and level
        const newXP = state.user.xp + xpGained;
        const newLevel = calculateLevel(newXP);
        const leveledUp = newLevel > state.user.level;

        // Update user state with new XP and level
        set({
          user: {
            ...state.user,
            xp: newXP,
            level: newLevel,
          },
        });

        // Unlock level 10 badge when milestone is reached
        if (newLevel >= 10) {
          get().unlockBadge('level_10');
        }

        return { xpGained, leveledUp, newLevel: leveledUp ? newLevel : undefined };
      },

      /**
       * updateStreak - Update player's daily streak
       * Increments streak if player was active yesterday, resets if inactive, or starts at 1 if first activity today
       */
      updateStreak: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const lastActive = state.user.lastActiveDate;
        
        // Calculate yesterday's date for comparison
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // Determine new streak value
        let newStreak = state.user.streak;
        if (lastActive === yesterdayStr) {
          // Player was active yesterday - increment streak
          newStreak += 1;
        } else if (lastActive !== today) {
          // Player wasn't active today yet and wasn't active yesterday - reset to 1
          newStreak = 1;
        }
        // If lastActive === today, streak stays the same (already counted today)

        // Update user state with new streak and today's date
        set({
          user: {
            ...state.user,
            streak: newStreak,
            lastActiveDate: today,
          },
        });

        // Unlock streak badge at 7 day milestone
        if (newStreak >= 7) {
          get().unlockBadge('week_streak');
        }
      },

      /**
       * unlockBadge - Unlock a badge for the user
       * Awards bonus XP from the badge and adds badge ID to user's collection
       * 
       * @param badgeId - ID of the badge to unlock
       * @returns Unlocked badge object or null if already unlocked
       */
      unlockBadge: (badgeId) => {
        const state = get();
        
        // Find the badge and check if it's already unlocked
        const badge = state.badges.find(b => b.id === badgeId);
        if (!badge || badge.unlocked) return null;

        // Mark badge as unlocked in badges array
        const updatedBadges = state.badges.map(b =>
          b.id === badgeId ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
        );

        // Update user with badge and award XP
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

      /**
       * updateMissionProgress - Increment progress on a daily mission
       * Auto-completes mission when target is reached and awards XP
       * 
       * @param type - Mission type to update
       * @param amount - Amount to increment progress by (default: 1)
       */
      updateMissionProgress: (type, amount = 1) => {
        const state = get();
        
        // Find and update matching mission
        const updatedMissions = state.missions.map(m => {
          if (m.type === type && !m.completed) {
            const newProgress = Math.min(m.progress + amount, m.target);
            const completed = newProgress >= m.target;
            
            // Award XP when mission is completed
            if (completed && !m.completed) {
              get().addXP('complete_mission', m.xpReward);
            }
            
            return { ...m, progress: newProgress, completed };
          }
          return m;
        });

        set({ missions: updatedMissions });
      },

      /**
       * resetDailyMissions - Reset all daily missions to initial state
       * Called at midnight to give players fresh daily goals
       */
      resetDailyMissions: () => {
        set({
          missions: DAILY_MISSIONS.map(m => ({ ...m, progress: 0, completed: false })),
        });
      },

      /**
       * incrementStat - Increment a player statistic and check for badge unlocks
       * Different stats unlock different badges at specific thresholds
       * 
       * @param stat - Statistic key to increment
       */
      incrementStat: (stat) => {
        const state = get();
        const newStats = { ...state.stats, [stat]: state.stats[stat] + 1 };
        set({ stats: newStats });

        // Badge unlock checks - trigger when specific stat thresholds are reached
        
        // Submit first step
        if (stat === 'stepsSubmitted' && newStats.stepsSubmitted === 1) {
          get().unlockBadge('first_step');
        }
        
        // Get first correct step
        if (stat === 'correctSteps' && newStats.correctSteps === 1) {
          get().unlockBadge('correct_step');
        }
        
        // Complete 5 quizzes
        if (stat === 'quizzesCompleted' && newStats.quizzesCompleted >= 5) {
          get().unlockBadge('quiz_master');
        }
        
        // Review 50 flashcards
        if (stat === 'flashcardsReviewed' && newStats.flashcardsReviewed >= 50) {
          get().unlockBadge('flashcard_fan');
        }
        
        // Create first study plan
        if (stat === 'studyPlansCreated' && newStats.studyPlansCreated === 1) {
          get().unlockBadge('study_planner');
        }
        
        // Ask 10 questions in doubt solver
        if (stat === 'doubtsAsked' && newStats.doubtsAsked >= 10) {
          get().unlockBadge('doubt_solver');
        }
        
        // Upload 5 images for OCR
        if (stat === 'imagesUploaded' && newStats.imagesUploaded >= 5) {
          get().unlockBadge('ocr_explorer');
        }
      },

      /**
       * getStreakMultiplier - Calculate XP multiplier based on current streak
       * Rewards players for maintaining consistent daily engagement
       * 
       * Multiplier tiers:
       * - 3+ days: 1.25x
       * - 7+ days: 1.5x
       * - 14+ days: 1.75x
       * - 30+ days: 2.0x
       * 
       * @returns Multiplier value (1.0 - 2.0)
       */
      getStreakMultiplier: () => {
        const streak = get().user.streak;
        if (streak >= 30) return 2.0;    // Double XP after a month
        if (streak >= 14) return 1.75;   // +75% after 2 weeks
        if (streak >= 7) return 1.5;     // +50% after a week
        if (streak >= 3) return 1.25;    // +25% after 3 days
        return 1.0;                       // Base multiplier
      },

      /**
       * getLevelProgress - Calculate progress towards next level
       * Returns both absolute XP progress and percentage completion
       * 
       * @returns Object with:
       *   - current: XP earned towards current level
       *   - next: Total XP needed for next level
       *   - progress: Percentage progress (0-100)
       */
      getLevelProgress: () => {
        const xp = get().user.xp;
        const level = get().user.level;
        
        // Calculate XP requirements using quadratic formula
        const currentLevelXP = Math.pow(level - 1, 2) * 100;
        const nextLevelXP = Math.pow(level, 2) * 100;
        const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
        
        return { 
          current: xp - currentLevelXP, 
          next: nextLevelXP - currentLevelXP, 
          progress 
        };
      },

      /**
       * getLevelTitle - Get descriptive title for current level
       * Provides motivational titles as players progress
       * 
       * @returns Current level title
       */
      getLevelTitle: () => getLevelTitle(get().user.level),

      /**
       * setUser - Update user information
       * Used for login/registration to update name and email
       * 
       * @param updates - Partial user object with name/email to update
       */
      setUser: (updates) => {
        set((state) => ({
          user: {
            ...state.user,
            ...updates,
          },
        }));
      },

      /**
       * isAuthenticated - Check if user is logged in
       * Checks localStorage for valid auth session
       * 
       * @returns True if user has active session
       */
      isAuthenticated: () => {
        return !!localStorage.getItem('auth-session');
      },

      /**
       * logout - Clear user session
       * Removes authentication token from localStorage
       * Note: Supabase signOut should be called separately in the component
       */
      logout: () => {
        localStorage.removeItem('auth-session');
        // Reset user to default state
        set({
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
        });
      },
    }),
    {
      // Persist configuration - saves state to browser localStorage
      name: 'graspify-game-storage',
    }
  )
);
