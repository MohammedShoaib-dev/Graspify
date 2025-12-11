import { Mission } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Target, Zap } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
}

const missionIcons: Record<Mission['type'], string> = {
  quiz: '📝',
  flashcard: '🧠',
  doubt: '💡',
  streak: '🔥',
  study: '📚',
};

export function MissionCard({ mission }: MissionCardProps) {
  const progress = (mission.progress / mission.target) * 100;

  return (
    <div
      className={cn(
        'relative p-4 rounded-xl border transition-all duration-300',
        mission.completed
          ? 'bg-success/10 border-success/30'
          : 'bg-card border-border hover:border-primary/30 hover:shadow-lg'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
            mission.completed ? 'bg-success/20' : 'bg-primary/10'
          )}
        >
          {missionIcons[mission.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{mission.title}</h4>
            {mission.completed && (
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">{mission.description}</p>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {mission.progress} / {mission.target}
              </span>
              <span className="flex items-center gap-1 text-primary font-medium">
                <Zap className="w-3 h-3" />
                +{mission.xpReward} XP
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  mission.completed ? 'gradient-success' : 'gradient-primary'
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {mission.completed && (
        <div className="absolute top-2 right-2">
          <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
            Complete!
          </span>
        </div>
      )}
    </div>
  );
}
