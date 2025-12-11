import { Badge } from '@/types';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BadgeGridProps {
  badges: Badge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {badges.map((badge) => (
        <Tooltip key={badge.id}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'relative aspect-square rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-300',
                badge.unlocked
                  ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 hover:scale-110 hover:shadow-lg'
                  : 'bg-muted border-2 border-border grayscale opacity-50 hover:opacity-70'
              )}
            >
              <span className={cn(badge.unlocked ? '' : 'blur-[2px]')}>
                {badge.icon}
              </span>
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              {badge.unlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center">
                  <span className="text-[10px]">✓</span>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="text-center">
              <p className="font-medium">{badge.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
              <p className="text-xs text-primary mt-1">+{badge.xpReward} XP</p>
              {!badge.unlocked && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {badge.requirement}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
