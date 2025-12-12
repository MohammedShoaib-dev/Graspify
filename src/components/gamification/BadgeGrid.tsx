/**
 * BadgeGrid Component
 *
 * Displays a grid of all badges (achievements) with:
 * - Visual lock/unlock status
 * - Hover effects and animations
 * - Tooltips showing badge details and unlock requirements
 */

// Type definitions
import { Badge } from "@/types";

// Utility functions
import { cn } from "@/lib/utils";

// Icons
import { Lock } from "lucide-react";

// Tooltip component from shadcn/ui
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Props for BadgeGrid component
 */
interface BadgeGridProps {
  // Array of all badges to display
  badges: Badge[];
}

/**
 * BadgeGrid Component
 *
 * Displays badges in a 5-column grid with:
 * - Unlocked badges: colored with glow effect and checkmark
 * - Locked badges: grayscale with lock icon and blurred
 * - Tooltips on hover showing full badge info
 *
 * @param badges - Array of badge objects to display
 */
export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {badges.map((badge) => (
        // Tooltip wrapper for badge details
        <Tooltip key={badge.id}>
          <TooltipTrigger asChild>
            {/* Badge Container */}
            <div
              className={cn(
                // Base styles - square with icon centered
                "relative aspect-square rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all duration-300",
                // Unlocked badge styling
                badge.unlocked
                  ? "bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 hover:scale-110 hover:shadow-lg"
                  : "bg-muted border-2 border-border grayscale opacity-50 hover:opacity-70" // Locked badge styling
              )}
            >
              {/* Badge Icon (blurred if locked) */}
              <span className={cn(badge.unlocked ? "" : "blur-[2px]")}>
                {badge.icon}
              </span>

              {/* Lock Icon (shown on locked badges) */}
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              )}

              {/* Checkmark Badge (shown on unlocked badges) */}
              {badge.unlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success flex items-center justify-center">
                  <span className="text-[10px]">✓</span>
                </div>
              )}
            </div>
          </TooltipTrigger>

          {/* Tooltip Content - Shows on hover */}
          <TooltipContent side="top" className="max-w-xs">
            <div className="text-center">
              {/* Badge Name */}
              <p className="font-medium">{badge.name}</p>

              {/* Badge Description */}
              <p className="text-xs text-muted-foreground mt-1">
                {badge.description}
              </p>

              {/* XP Reward */}
              <p className="text-xs text-primary mt-1">+{badge.xpReward} XP</p>

              {/* Unlock Requirement (shown if not unlocked) */}
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
