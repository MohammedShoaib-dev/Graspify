import { useGameStore } from '@/lib/gameStore';
import { MissionCard } from '@/components/gamification/MissionCard';
import { BadgeGrid } from '@/components/gamification/BadgeGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Calendar,
  FileQuestion,
  Layers,
  MessageCircleQuestion,
  TrendingUp,
  Zap,
  BookOpen,
  Target,
} from 'lucide-react';

const quickActions = [
  { to: '/study-planner', icon: Calendar, label: 'Create Study Plan', color: 'from-blue-500 to-cyan-500' },
  { to: '/quiz', icon: FileQuestion, label: 'Generate Quiz', color: 'from-purple-500 to-pink-500' },
  { to: '/flashcards', icon: Layers, label: 'Review Flashcards', color: 'from-orange-500 to-amber-500' },
  { to: '/doubt-solver', icon: MessageCircleQuestion, label: 'Ask AI Tutor', color: 'from-green-500 to-emerald-500' },
];

export default function Dashboard() {
  const { user, missions, badges, stats, getLevelTitle } = useGameStore();

  const recentBadges = badges.filter(b => b.unlocked).slice(-3);
  const activeMissions = missions.filter(m => !m.completed);
  const completedMissionsCount = missions.filter(m => m.completed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">
            Welcome back, <span className="text-gradient">{user.name}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            You're a <span className="font-medium text-primary">{getLevelTitle()}</span>. Keep learning!
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-medium">+{stats.correctSteps * 10 + stats.quizzesCompleted * 50} XP this week</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.to} to={action.to}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-border/50 overflow-hidden">
              <CardContent className="p-6 relative">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium">{action.label}</h3>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Daily Missions */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Daily Missions
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {completedMissionsCount}/{missions.length} complete
            </span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-5 h-5 text-primary" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Quizzes</span>
                </div>
                <span className="font-bold">{stats.quizzesCompleted}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Flashcards</span>
                </div>
                <span className="font-bold">{stats.flashcardsReviewed}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageCircleQuestion className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Doubts Solved</span>
                </div>
                <span className="font-bold">{stats.doubtsAsked}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Correct Steps</span>
                </div>
                <span className="font-bold text-success">{stats.correctSteps}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Badges */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span>Recent Badges</span>
                <Link to="/profile" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBadges.length > 0 ? (
                <div className="flex gap-3">
                  {recentBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30 flex items-center justify-center text-2xl"
                    >
                      {badge.icon}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Complete missions to earn badges! 🏆
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
