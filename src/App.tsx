/**
 * App Component - Root Application Router and Provider Setup
 *
 * This component sets up:
 * - All necessary providers (React Query, Routing, UI components)
 * - Application routes/pages
 * - Notification systems (Toast, Sonner notifications, Tooltips)
 * - Protected routes with authentication
 */

// React hooks
import { useEffect, useState } from "react";

// Toast notification component from shadcn/ui
import { Toaster } from "@/components/ui/toaster";

// Sonner toast notifications - alternative toast system
import { Toaster as Sonner } from "@/components/ui/sonner";

// Tooltip provider - enables tooltips across the app
import { TooltipProvider } from "@/components/ui/tooltip";

// React Query - for server state management and data fetching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React Router - for client-side routing and navigation
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import Login from "@/pages/Login";
import NotFound from "./pages/NotFound";

// State management
import { useGameStore } from "@/lib/gameStore";
import { supabase } from "@/lib/supabase";

// Create a React Query client for managing server state
const queryClient = new QueryClient();

/**
 * App Component
 * Wraps the entire application with necessary providers and sets up routes
 */
const App = () => {
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount and listen for auth changes
  useEffect(() => {
    // Check initial session
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    // Listen for custom auth event (fired from Login component)
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("auth-changed", handleAuthChange);
    // Also listen for storage changes from other tabs
    window.addEventListener("storage", handleAuthChange);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("auth-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold">Graspify</div>
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    // React Query provider - enables useQuery and other data fetching hooks
    <QueryClientProvider client={queryClient}>
      {/* Tooltip provider - enables tooltips for UI elements */}
      <TooltipProvider>
        {/* Toast notification systems - for displaying notifications */}
        <Toaster />
        <Sonner />

        {/* Browser Router - enables client-side routing */}
        <BrowserRouter>
          {/* Conditionally render layout based on authentication */}
          {isAuthenticated ? (
            // App Layout - provides sidebar, header, and main layout structure
            <AppLayout>
              {/* Route definitions for authenticated pages */}
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

                {/* Redirect login to dashboard if already authenticated */}
                <Route path="/login" element={<Navigate to="/" replace />} />

                {/* Catch-all route - displays 404 page for undefined routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          ) : (
            // Unauthenticated routes
            <Routes>
              {/* Login - authentication page */}
              <Route path="/login" element={<Login />} />

              {/* Redirect all other routes to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
