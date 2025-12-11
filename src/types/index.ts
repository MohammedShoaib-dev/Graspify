// User & Gamification Types
export interface User {
  id: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  badges: string[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'flashcard' | 'doubt' | 'streak' | 'study';
  target: number;
  progress: number;
  xpReward: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
}

// Study Planner Types
export interface StudyPlan {
  id: string;
  subject: string;
  chapters: Chapter[];
  examDate: string;
  dailyHours: number;
  schedule: ScheduleDay[];
  createdAt: string;
}

export interface Chapter {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
  completed: boolean;
}

export interface ScheduleDay {
  date: string;
  tasks: ScheduleTask[];
}

export interface ScheduleTask {
  chapterId: string;
  chapterName: string;
  subject: string;
  hours: number;
  completed: boolean;
}

// Quiz Types
export interface Quiz {
  id: string;
  title: string;
  source: string;
  questions: Question[];
  createdAt: string;
  attempts: QuizAttempt[];
}

export interface Question {
  id: string;
  type: 'mcq' | 'short';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  answers: { questionId: string; answer: string; correct: boolean }[];
  xpEarned: number;
  completedAt: string;
}

// Flashcard Types
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  deckId: string;
  // Spaced repetition fields (SM-2)
  interval: number; // days until next review
  easeFactor: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate?: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description?: string;
  cards: Flashcard[];
  createdAt: string;
}

// Doubt Solver Types
export interface DoubtSession {
  id: string;
  title: string;
  messages: DoubtMessage[];
  createdAt: string;
}

export interface DoubtMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  step?: StepCheck;
  timestamp: string;
}

export interface StepCheck {
  userStep: string;
  correct: boolean;
  explanation: string;
  hint?: string;
  suggestedNextStep?: string;
  confidence: number;
}

// XP Event Types
export type XPEventType = 
  | 'correct_step'
  | 'submit_step'
  | 'complete_quiz'
  | 'perfect_quiz'
  | 'review_flashcard'
  | 'complete_mission'
  | 'streak_bonus';

export interface XPEvent {
  type: XPEventType;
  amount: number;
  multiplier?: number;
  timestamp: string;
}
