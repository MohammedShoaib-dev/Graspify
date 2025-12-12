/**
 * MissionCard Component
 *
 * Displays a single daily mission with:
 * - Mission icon, title, and description
 * - Progress bar showing completion status
 * - XP reward amount
 * - Completion status indicator
 */

// Type definitions
import { Mission } from "@/types";

// Utility functions
import { cn } from "@/lib/utils";

// Icons from lucide-react
import { CheckCircle2, Target, Zap } from "lucide-react";

/**
 * Props for MissionCard component
 */
interface MissionCardProps {
  // The mission object to display
  mission: Mission;
}

/**
 * Mapping of mission types to their emoji icons
 * Used to visually identify different types of missions
 */
const missionIcons: Record<Mission["type"], string> = {
  quiz: "📝", // Quiz mission
  flashcard: "🧠", // Flashcard review mission
  doubt: "💡", // Doubt solver mission
  streak: "🔥", // Streak maintenance mission
  study: "📚", // Study session mission
};

/**
 * MissionCard Component
 *
 * Displays a card representing a daily mission with:
 * - Icon, title, description
 * - Progress bar showing progress/target
 * - XP reward amount
 * - Completion badge when finished
 *
 * @param mission - The mission object to display
 */
export function MissionCard({ mission }: MissionCardProps) {
  // Calculate progress percentage for the progress bar
  const progress = (mission.progress / mission.target) * 100;

  return (
    <div
      className={cn(
        // Base styles
        "relative p-4 rounded-xl border transition-all duration-300",
        // Conditional styles for completed vs incomplete
        mission.completed
          ? "bg-success/10 border-success/30" // Completed styling
          : "bg-card border-border hover:border-primary/30 hover:shadow-lg" // Incomplete styling with hover effect
      )}
    >
      <div className="flex items-start gap-3">
        {/* Mission Type Icon Container */}
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
            mission.completed ? "bg-success/20" : "bg-primary/10"
          )}
        >
          {missionIcons[mission.type]}
        </div>

        {/* Mission Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Completion Badge */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{mission.title}</h4>

            {/* Check circle icon shown when mission is complete */}
            {mission.completed && (
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
            )}
          </div>

          {/* Mission Description */}
          <p className="text-xs text-muted-foreground mb-2">
            {mission.description}
          </p>

          {/* Progress Section */}
          <div className="space-y-1">
            {/* Progress Counter and XP Reward */}
            <div className="flex justify-between text-xs">
              {/* Current Progress / Target */}
              <span className="text-muted-foreground">
                {mission.progress} / {mission.target}
              </span>

              {/* XP Reward Display */}
              <span className="flex items-center gap-1 text-primary font-medium">
                <Zap className="w-3 h-3" />+{mission.xpReward} XP
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  mission.completed ? "gradient-success" : "gradient-primary"
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Badge - Top right corner */}
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
