/**
 * AppLayout Component
 *
 * Main layout wrapper for the entire application
 * Provides:
 * - Sidebar navigation
 * - Sticky XP progress bar header
 * - Main content area
 * - Streak update on page load
 */

// React hooks
import { ReactNode, useEffect } from "react";

// Layout components
import { AppSidebar } from "./AppSidebar";

// Gamification component - displays user XP and progress
import { XPBar } from "../gamification/XPBar";

// Game state management
import { useGameStore } from "@/lib/gameStore";

/**
 * Props for AppLayout component
 */
interface AppLayoutProps {
  // Child components to render in main content area
  children: ReactNode;
}

/**
 * AppLayout Component
 *
 * Structure:
 * - Fixed sidebar on left (width: 256px / w-64)
 * - Main content area offset by sidebar width
 * - Sticky header with XP bar
 * - Main content area for page content
 *
 * @param children - Page content to render
 */
export function AppLayout({ children }: AppLayoutProps) {
  // Get updateStreak function from game store
  const { updateStreak } = useGameStore();

  /**
   * Effect: Update streak on component mount
   * Ensures streak is updated when user first visits the app
   * This helps track daily engagement
   */
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Fixed navigation panel on the left */}
      <AppSidebar />

      {/* Main content area - offset by sidebar width */}
      <div className="ml-64 min-h-screen">
        {/* Header - Sticky XP and stats display */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
          <XPBar />
        </header>

        {/* Main content area - Page-specific content goes here */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
