/**
 * Application Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout the Graspify application
 * Organized by feature: Gamification, Study Planner, Quiz, Flashcards, Doubt Solver
 */

// ============================================================================
// GAMIFICATION & USER TYPES
// ============================================================================

/**
 * User Interface
 * Represents a player's profile and progress
 */
export interface User {
  id: string;              // Unique user identifier
  name: string;            // Display name
  avatar?: string;         // Optional profile picture URL
  xp: number;              // Total experience points
  level: number;           // Current level (derived from XP)
  streak: number;          // Current daily login streak
  lastActiveDate: string;  // Last date user was active (YYYY-MM-DD)
  badges: string[];        // Array of unlocked badge IDs
  createdAt: string;       // Account creation date (ISO 8601)
}

/**
 * Badge Interface
 * Represents an achievement/badge that can be unlocked
 */
export interface Badge {
  id: string;              // Unique badge identifier
  name: string;            // Badge display name
  description: string;     // What the badge represents
  icon: string;            // Emoji or icon representation
  requirement: string;     // Text describing how to unlock
  xpReward: number;        // XP awarded when unlocked
  unlocked: boolean;       // Whether user has unlocked this
  unlockedAt?: string;     // Date/time badge was unlocked (ISO 8601)
}

/**
 * Mission Interface
 * Represents a daily goal/mission for the player
 */
export interface Mission {
  id: string;              // Unique mission identifier
  title: string;           // Mission name (e.g., "Quiz Champion")
  description: string;     // What needs to be accomplished
  type: 'quiz' | 'flashcard' | 'doubt' | 'streak' | 'study'; // Category of mission
  target: number;          // Number to reach to complete
  progress: number;        // Current progress towards target
  xpReward: number;        // XP given when completed
  completed: boolean;      // Whether mission is finished
}

/**
 * LeaderboardEntry Interface
 * Represents a player's position on the leaderboard
 */
export interface LeaderboardEntry {
  rank: number;            // Position on leaderboard (1 = top)
  userId: string;          // Reference to user
  name: string;            // User's display name
  avatar?: string;         // Optional profile picture
  xp: number;              // Total XP
  level: number;           // Current level
  streak: number;          // Current streak
}

// ============================================================================
// STUDY PLANNER TYPES
// ============================================================================

/**
 * StudyPlan Interface
 * Main study planning entity for exam preparation
 */
export interface StudyPlan {
  id: string;              // Unique plan identifier
  subject: string;         // Subject being studied for
  chapters: Chapter[];     // List of chapters to study
  examDate: string;        // Target exam date (YYYY-MM-DD)
  dailyHours: number;      // Planned hours to study daily
  schedule: ScheduleDay[]; // Detailed daily schedule
  createdAt: string;       // When plan was created
}

/**
 * Chapter Interface
 * Represents a chapter or topic within a study subject
 */
export interface Chapter {
  id: string;              // Unique chapter identifier
  name: string;            // Chapter title
  difficulty: 'easy' | 'medium' | 'hard'; // Difficulty level
  estimatedHours: number;  // Estimated hours to complete
  completed: boolean;      // Whether chapter is done
}

/**
 * ScheduleDay Interface
 * Represents scheduled tasks for a specific date
 */
export interface ScheduleDay {
  date: string;            // Date in YYYY-MM-DD format
  tasks: ScheduleTask[];   // Tasks scheduled for this day
}

/**
 * ScheduleTask Interface
 * Individual task within a day's schedule
 */
export interface ScheduleTask {
  chapterId: string;       // Reference to chapter being studied
  chapterName: string;     // Chapter name (for convenience)
  subject: string;         // Subject name
  hours: number;           // Hours allocated for this task
  completed: boolean;      // Whether task is completed
}

// ============================================================================
// QUIZ TYPES
// ============================================================================

/**
 * Quiz Interface
 * Represents a complete quiz with questions and attempt history
 */
export interface Quiz {
  id: string;              // Unique quiz identifier
  title: string;           // Quiz name
  source: string;          // Source or topic
  questions: Question[];   // Array of questions in quiz
  createdAt: string;       // When quiz was created
  attempts: QuizAttempt[]; // History of attempts
}

/**
 * Question Interface
 * Represents a single quiz question
 */
export interface Question {
  id: string;              // Unique question identifier
  type: 'mcq' | 'short';   // Multiple choice or short answer
  question: string;        // Question text
  options?: string[];      // Possible answers (for MCQ)
  correctAnswer: string;   // The correct answer
  explanation: string;     // Explanation of why answer is correct
  difficulty: 'easy' | 'medium' | 'hard'; // Difficulty rating
}

/**
 * QuizAttempt Interface
 * Records a user's attempt at a quiz
 */
export interface QuizAttempt {
  id: string;              // Unique attempt identifier
  score: number;           // Number of questions answered correctly
  totalQuestions: number;  // Total questions in quiz
  answers: { questionId: string; answer: string; correct: boolean }[]; // User's answers
  xpEarned: number;        // XP awarded for this attempt
  completedAt: string;     // When attempt was completed (ISO 8601)
}

// ============================================================================
// FLASHCARD TYPES
// ============================================================================

/**
 * Flashcard Interface
 * Represents a single flashcard with spaced repetition data
 */
export interface Flashcard {
  id: string;              // Unique card identifier
  front: string;           // Question or term side
  back: string;            // Answer or definition side
  difficulty: 'easy' | 'medium' | 'hard'; // Difficulty rating
  deckId: string;          // Reference to parent deck
  
  // Spaced Repetition Algorithm fields (SM-2)
  interval: number;        // Days until next review
  easeFactor: number;      // Difficulty factor for this card (1.3 - 2.5)
  repetitions: number;     // Number of times reviewed
  nextReviewDate: string;  // When next review is due (ISO 8601)
  lastReviewDate?: string; // When last reviewed (ISO 8601)
}

/**
 * FlashcardDeck Interface
 * Represents a collection of flashcards
 */
export interface FlashcardDeck {
  id: string;              // Unique deck identifier
  name: string;            // Deck name/title
  description?: string;    // Optional description
  cards: Flashcard[];      // Array of cards in deck
  createdAt: string;       // When deck was created
}

// ============================================================================
// DOUBT SOLVER TYPES
// ============================================================================

/**
 * DoubtSession Interface
 * Represents a conversation session with the AI tutor
 */
export interface DoubtSession {
  id: string;              // Unique session identifier
  title: string;           // Session topic/title
  messages: DoubtMessage[]; // Chat message history
  createdAt: string;       // When session started
}

/**
 * DoubtMessage Interface
 * Represents a single message in a doubt solver session
 */
export interface DoubtMessage {
  id: string;              // Unique message identifier
  role: 'user' | 'assistant'; // Who sent this message
  content: string;         // Message text
  image?: string;          // Optional image URL (for OCR/problem images)
  step?: StepCheck;        // Optional step verification data
  timestamp: string;       // When message was sent (ISO 8601)
}

/**
 * StepCheck Interface
 * Results of verifying a solution step
 */
export interface StepCheck {
  userStep: string;        // The step provided by user
  correct: boolean;        // Whether step is correct
  explanation: string;     // Why it is/isn't correct
  hint?: string;           // Optional hint if incorrect
  suggestedNextStep?: string; // Suggestion for next step
  confidence: number;      // AI confidence (0-1)
}

// ============================================================================
// XP EVENT TYPES
// ============================================================================

/**
 * XPEventType
 * Union type of all events that award XP
 */
export type XPEventType = 
  | 'correct_step'       // User submitted correct solution step
  | 'submit_step'        // User submitted any solution step
  | 'complete_quiz'      // User completed a quiz attempt
  | 'perfect_quiz'       // User got perfect score on quiz
  | 'review_flashcard'   // User reviewed a flashcard
  | 'complete_mission'   // User completed a daily mission
  | 'streak_bonus';      // Streak bonus (deprecated, use multiplier instead)

/**
 * XPEvent Interface
 * Represents an event that resulted in XP gain
 */
export interface XPEvent {
  type: XPEventType;      // Type of activity
  amount: number;         // Base XP amount
  multiplier?: number;    // Applied multiplier (from streak)
  timestamp: string;      // When event occurred (ISO 8601)
}
