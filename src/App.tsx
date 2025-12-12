/**
 * App Component - Root Application Router and Provider Setup
 *
 * This component sets up:
 * - All necessary providers (React Query, Routing, UI components)
 * - Application routes/pages
 * - Notification systems (Toast, Sonner notifications, Tooltips)
 */

// Toast notification component from shadcn/ui
import { Toaster } from "@/components/ui/toaster";

// Sonner toast notifications - alternative toast system
import { Toaster as Sonner } from "@/components/ui/sonner";

// Tooltip provider - enables tooltips across the app
import { TooltipProvider } from "@/components/ui/tooltip";

// React Query - for server state management and data fetching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React Router - for client-side routing and navigation
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Main layout component that wraps all pages
import { AppLayout } from "@/components/layout/AppLayout";

// Page components - each representing a different route in the app
import Dashboard from "@/pages/Dashboard";
import StudyPlanner from "@/pages/StudyPlanner";
import QuizGenerator from "@/pages/QuizGenerator";
import Flashcards from "@/pages/Flashcards";
import DoubtSolver from "@/pages/DoubtSolver";
import Leaderboard from "@/pages/Leaderboard";
import Profile from "@/pages/Profile";
import NotFound from "./pages/NotFound";

// Create a React Query client for managing server state
const queryClient = new QueryClient();

/**
 * App Component
 * Wraps the entire application with necessary providers and sets up routes
 */
const App = () => (
  // React Query provider - enables useQuery and other data fetching hooks
  <QueryClientProvider client={queryClient}>
    {/* Tooltip provider - enables tooltips for UI elements */}
    <TooltipProvider>
      {/* Toast notification systems - for displaying notifications */}
      <Toaster />
      <Sonner />

      {/* Browser Router - enables client-side routing */}
      <BrowserRouter>
        {/* App Layout - provides sidebar, header, and main layout structure */}
        <AppLayout>
          {/* Route definitions for all pages in the application */}
          <Routes>
            {/* Dashboard - home page showing user overview */}
            <Route path="/" element={<Dashboard />} />

            {/* Study Planner - for creating and managing study schedules */}
            <Route path="/study-planner" element={<StudyPlanner />} />

            {/* Quiz Generator - create and take quizzes */}
            <Route path="/quiz" element={<QuizGenerator />} />

            {/* Flashcards - study using flashcard system */}
            <Route path="/flashcards" element={<Flashcards />} />

            {/* Doubt Solver - AI-powered Q&A system */}
            <Route path="/doubt-solver" element={<DoubtSolver />} />

            {/* Leaderboard - view user rankings and achievements */}
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Profile - user profile and settings */}
            <Route path="/profile" element={<Profile />} />

            {/* Catch-all route - displays 404 page for undefined routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
