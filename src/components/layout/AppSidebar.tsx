import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  FileQuestion,
  Layers,
  MessageCircleQuestion,
  Trophy,
  User,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/lib/gameStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/study-planner', icon: Calendar, label: 'Study Planner' },
  { to: '/quiz', icon: FileQuestion, label: 'Quiz Generator' },
  { to: '/flashcards', icon: Layers, label: 'Flashcards' },
  { to: '/doubt-solver', icon: MessageCircleQuestion, label: 'Doubt Solver' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, getLevelProgress } = useGameStore();
  const levelProgress = getLevelProgress();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-gradient">Graspify</h1>
            <p className="text-xs text-muted-foreground">AI Learning Companion</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-sidebar-accent group',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                  : 'text-sidebar-foreground/70'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-sidebar-primary' : 'text-muted-foreground group-hover:text-sidebar-primary'
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Stats */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
              {user.level}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.xp.toLocaleString()} XP</p>
            </div>
            {user.streak > 0 && (
              <div className="flex items-center gap-1 text-streak">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-bold">{user.streak}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Level {user.level}</span>
              <span>Level {user.level + 1}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${levelProgress.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
