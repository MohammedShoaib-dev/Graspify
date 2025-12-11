import { useGameStore } from '@/lib/gameStore';
import { Flame, Zap, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function XPBar() {
  const { user, getLevelProgress, getLevelTitle, getStreakMultiplier } = useGameStore();
  const levelProgress = getLevelProgress();
  const multiplier = getStreakMultiplier();

  return (
    <div className="flex items-center justify-between gap-6">
      {/* Level & XP */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground shadow-lg glow-primary">
            {user.level}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
            <Star className="w-3 h-3 text-primary" />
          </div>
        </div>
        <div className="flex-1 max-w-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">{getLevelTitle()}</span>
            <span className="text-xs text-muted-foreground">
              {levelProgress.current.toLocaleString()} / {levelProgress.next.toLocaleString()} XP
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(levelProgress.progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        {/* XP Multiplier */}
        {multiplier > 1 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full border border-accent/30">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">{multiplier}x XP</span>
          </div>
        )}

        {/* Streak */}
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl",
          user.streak > 0
            ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-streak/30"
            : "bg-muted"
        )}>
          <Flame className={cn("w-5 h-5", user.streak > 0 ? "text-streak" : "text-muted-foreground")} />
          <div>
            <p className={cn("text-lg font-bold leading-none", user.streak > 0 ? "text-streak" : "text-muted-foreground")}>
              {user.streak}
            </p>
            <p className="text-xs text-muted-foreground">day streak</p>
          </div>
        </div>

        {/* Total XP */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30">
          <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">XP</span>
          </div>
          <div>
            <p className="text-lg font-bold leading-none text-primary">{user.xp.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
