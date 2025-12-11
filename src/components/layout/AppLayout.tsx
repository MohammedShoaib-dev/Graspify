import { ReactNode, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { XPBar } from '../gamification/XPBar';
import { useGameStore } from '@/lib/gameStore';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { updateStreak } = useGameStore();

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
          <XPBar />
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
