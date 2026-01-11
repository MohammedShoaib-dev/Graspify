# Graspify - AI Learning Companion

An intelligent learning platform that gamifies education with XP systems, daily missions, badges, and AI-powered tutoring. Built with modern web technologies for an engaging learning experience.

## 🎮 Features

### Gamification System

- **XP & Leveling**: Earn experience points through various learning activities and progress through levels with descriptive titles (Novice Learner → Knowledge Legend)
- **Daily Missions**: Complete daily goals like quizzes, flashcard reviews, and doubt solving sessions
- **Badges & Achievements**: Unlock 10+ achievement badges by hitting milestones
- **Streak System**: Maintain daily login streaks with XP multipliers up to 2.0x
- **Leaderboard**: Compete with other learners and see community rankings

### Learning Features

- **Study Planner**: Create customized exam preparation schedules with chapters and daily study plans
- **Quiz Generator**: Generate and take quizzes with detailed explanations
- **Flashcards**: Study using spaced repetition algorithm (SM-2) for optimal retention
- **Doubt Solver**: AI-powered Q&A system to clarify concepts with step verification
- **OCR Support**: Upload images for text extraction and problem solving

### User Profile

- Track comprehensive learning statistics
- View all earned badges and achievements
- Monitor personal learning progress
- Customize profile settings

## 🛠️ Technology Stack

This project is built with:

| Technology       | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| **Vite**         | Fast build tool and development server          |
| **TypeScript**   | Type-safe JavaScript for robust code            |
| **React 18**     | UI library with hooks and functional components |
| **React Router** | Client-side routing and navigation              |
| **Zustand**      | Lightweight state management with persistence   |
| **React Query**  | Server state management and data fetching       |
| **shadcn/ui**    | Pre-built, customizable UI components           |
| **Tailwind CSS** | Utility-first CSS framework                     |
| **Lucide React** | Beautiful SVG icons                             |

## 📦 Project Structure

```
src/
├── components/
│   ├── layout/              # Layout components (Sidebar, Header)
│   ├── gamification/        # Badges, Missions, XP Bar, Confetti
│   ├── ui/                  # shadcn/ui components
│   └── NavLink.tsx          # Custom nav link wrapper
├── pages/                   # Page components (Dashboard, Quiz, etc.)
├── lib/
│   ├── gameStore.ts         # Zustand game state management
│   └── utils.ts             # Utility functions
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript type definitions
├── App.tsx                  # Main app component with routing
└── main.tsx                 # Entry point

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd Graspify

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📖 Key Components

### Game Store (`src/lib/gameStore.ts`)

Central state management using Zustand with localStorage persistence. Handles:

- User XP, levels, streaks
- Badge unlocking and tracking
- Daily mission progress
- Player statistics
- Level progression

### Gamification Components

- **XPBar**: Displays current level, progress, streak, and XP multiplier
- **MissionCard**: Shows daily mission with progress bar
- **BadgeGrid**: Displays all badges with unlock status and tooltips
- **Confetti**: Celebration animation on achievements

### Pages

- **Dashboard**: Home page with missions, stats, and quick actions
- **Study Planner**: Create and manage study schedules
- **Quiz Generator**: Take quizzes and track attempts
- **Flashcards**: Review flashcards with spaced repetition
- **Doubt Solver**: Chat with AI tutor for help
- **Leaderboard**: View rankings and achievements
- **Profile**: User profile and settings

## 🎯 Game Mechanics

### XP System

- Base XP varies by activity type (2-50 XP)
- Streak multiplier: 1.0x → 2.0x depending on consecutive days
- Level formula: `level = floor(sqrt(xp / 100)) + 1`

### Streaks

- Maintains daily consecutive login streak
- Multiplier tiers: 3+ days (1.25x), 7+ days (1.5x), 14+ days (1.75x), 30+ days (2.0x)
- Resets if user misses a day

### Missions

- Reset daily at midnight
- 4 mission types: Quiz, Flashcard, Doubt, Study
- Completion awards bonus XP

### Badges (10 Available)

1. **First Steps** - Submit first solution step
2. **Sharp Mind** - Get first correct step
3. **Quiz Master** - Complete 5 quizzes
4. **Perfectionist** - Score 100% on a quiz
5. **Memory Master** - Review 50 flashcards
6. **On Fire** - Maintain 7-day streak
7. **Organized Learner** - Create first study plan
8. **Problem Solver** - Solve 10 doubts
9. **Rising Star** - Reach level 10
10. **OCR Explorer** - Upload 5 images

## 🎨 Styling

The project uses Tailwind CSS with a custom design system:

- Color themes: Primary, Accent, Success, Warning
- Responsive design with mobile-first approach
- Smooth animations and transitions
- Dark/Light mode support via CSS variables

## 💾 State Management

**Zustand Store** (`gameStore.ts`) persists to localStorage:

- `graspify-game-storage` key
- Auto-syncs across browser tabs
- Survives page refreshes

## 🔄 Data Types

Comprehensive TypeScript interfaces for:

- User profiles and badges
- Quizzes and questions
- Flashcards with spaced repetition
- Study plans and schedules
- Doubt sessions and messages
- XP events and tracking

See [src/types/index.ts](src/types/index.ts) for complete type definitions.

## 📝 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint TypeScript
npm run lint
```

### Code Style

- TypeScript for type safety
- Functional components with React hooks
- ESLint configuration for code quality
- Component-based architecture

## 🔒 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

