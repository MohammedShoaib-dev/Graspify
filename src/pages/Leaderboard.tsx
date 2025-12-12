/**
 * Leaderboard Page Component
 *
 * Displays competitive ranking of all learners with:
 * - Top 10 global rankings
 * - Filtering by time period (weekly, monthly, all-time)
 * - User's current rank and position
 * - XP, level, and streak display for each player
 */

// React hooks for state management
import { useState } from "react";

// UI components from shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Game state management
import { useGameStore } from "@/lib/gameStore";

// Icons from lucide-react
import { Trophy, Medal, Crown, Flame, TrendingUp, Users } from "lucide-react";

// Type definitions
import { LeaderboardEntry } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Mock leaderboard data
 * In production, this would come from a backend API
 */
const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "1", name: "Alex Chen", xp: 12450, level: 35, streak: 21 },
  {
    rank: 2,
    userId: "2",
    name: "Sarah Williams",
    xp: 11200,
    level: 33,
    streak: 14,
  },
  {
    rank: 3,
    userId: "3",
    name: "Michael Brown",
    xp: 10890,
    level: 32,
    streak: 28,
  },
  { rank: 4, userId: "4", name: "Emily Davis", xp: 9750, level: 30, streak: 7 },
  {
    rank: 5,
    userId: "5",
    name: "James Wilson",
    xp: 8900,
    level: 28,
    streak: 12,
  },
  {
    rank: 6,
    userId: "6",
    name: "Jessica Martinez",
    xp: 8200,
    level: 27,
    streak: 5,
  },
  {
    rank: 7,
    userId: "7",
    name: "David Taylor",
    xp: 7650,
    level: 26,
    streak: 9,
  },
  {
    rank: 8,
    userId: "8",
    name: "Amanda Johnson",
    xp: 7100,
    level: 25,
    streak: 3,
  },
  {
    rank: 9,
    userId: "9",
    name: "Ryan Anderson",
    xp: 6500,
    level: 24,
    streak: 15,
  },
  {
    rank: 10,
    userId: "10",
    name: "Nicole Thomas",
    xp: 5900,
    level: 23,
    streak: 4,
  },
];

/**
 * Leaderboard Component
 *
 * Shows competitive rankings with:
 * - Time period filtering
 * - Visual ranking indicators (crowns, medals)
 * - User's position in leaderboard
 * - Detailed player stats (XP, level, streak)
 */
export default function Leaderboard() {
  // Get current user
  const { user } = useGameStore();
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "alltime">(
    "weekly"
  );

  // Mock user's rank (in production, would be calculated from backend)
  const userRank = 42;

  /**
   * Get icon for rank position
   * Top 3 get special icons (crown, silver, bronze)
   *
   * @param rank - Player's ranking position
   * @returns Icon component for the rank
   */
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-amber-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-slate-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  /**
   * Get background styling for rank position
   * Top 3 have special gradient backgrounds
   *
   * @param rank - Player's ranking position
   * @returns Tailwind CSS class string for background
   */
  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30";
      case 2:
        return "bg-gradient-to-r from-slate-400/20 to-slate-300/20 border-slate-400/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30";
      default:
        return "bg-card border-border hover:bg-muted/50";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header with Timeframe Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Compete with learners worldwide
          </p>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex gap-2">
          <Button
            variant={timeframe === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("weekly")}
          >
            Weekly
          </Button>
          <Button
            variant={timeframe === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={timeframe === "alltime" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("alltime")}
          >
            All Time
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Leaderboard */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Top Learners
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockLeaderboard.map((entry) => (
              <div
                key={entry.userId}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all",
                  getRankBg(entry.rank)
                )}
              >
                <div className="w-8 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                  {entry.level}
                </div>

                <div className="flex-1">
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Level {entry.level}
                  </p>
                </div>

                {entry.streak > 0 && (
                  <div className="flex items-center gap-1 text-streak">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-bold">{entry.streak}</span>
                  </div>
                )}

                <div className="text-right">
                  <p className="font-bold text-primary">
                    {entry.xp.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Your Position */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Your Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  {user.level}
                </div>
                <h3 className="text-xl font-bold mb-1">{user.name}</h3>
                <p className="text-muted-foreground mb-4">Rank #{userRank}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-primary">
                      {user.xp.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex items-center justify-center gap-1">
                      <Flame className="w-5 h-5 text-streak" />
                      <span className="text-2xl font-bold text-streak">
                        {user.streak}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">XP Earned</span>
                <span className="font-bold text-success">
                  +{user.xp > 100 ? Math.floor(user.xp * 0.3) : user.xp}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Rank Change</span>
                <span className="font-bold text-success">↑ 5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Best Streak</span>
                <span className="font-bold">{user.streak} days</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
