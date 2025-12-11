import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useGameStore } from '@/lib/gameStore';
import { BadgeGrid } from '@/components/gamification/BadgeGrid';
import {
  User,
  Trophy,
  Flame,
  BookOpen,
  Layers,
  MessageCircleQuestion,
  Target,
  Calendar,
  Edit2,
  Save,
} from 'lucide-react';

export default function Profile() {
  const { toast } = useToast();
  const { user, badges, stats, getLevelTitle, getLevelProgress } = useGameStore();
  const levelProgress = getLevelProgress();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);

  const handleSave = () => {
    // In real app, would save to backend
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your changes have been saved.",
    });
  };

  const statItems = [
    { label: 'Quizzes Completed', value: stats.quizzesCompleted, icon: BookOpen },
    { label: 'Flashcards Reviewed', value: stats.flashcardsReviewed, icon: Layers },
    { label: 'Doubts Solved', value: stats.doubtsAsked, icon: MessageCircleQuestion },
    { label: 'Correct Steps', value: stats.correctSteps, icon: Target },
    { label: 'Study Plans Created', value: stats.studyPlansCreated, icon: Calendar },
    { label: 'Steps Submitted', value: stats.stepsSubmitted, icon: Edit2 },
  ];

  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">
          View your progress and achievements
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-4xl font-bold text-primary-foreground">
                  {user.level}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background border-2 border-primary px-2 py-0.5 rounded-full">
                  <span className="text-xs font-medium text-primary">Lvl {user.level}</span>
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-2 mb-4">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-center"
                  />
                  <Button onClick={handleSave} size="sm" className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-1">{user.name}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-muted-foreground"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit name
                  </Button>
                </>
              )}
              
              <p className="text-primary font-medium mb-4">{getLevelTitle()}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{Math.round(levelProgress.progress)}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-primary transition-all duration-500 rounded-full"
                    style={{ width: `${levelProgress.progress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {levelProgress.current.toLocaleString()} / {levelProgress.next.toLocaleString()} XP to Level {user.level + 1}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-2xl font-bold text-primary">{user.xp.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-streak/20">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5 text-streak" />
                    <span className="text-2xl font-bold text-streak">{user.streak}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{stat.label}</span>
                </div>
                <span className="font-bold">{stat.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Badges
              </div>
              <Badge variant="secondary">
                {unlockedBadgesCount}/{badges.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BadgeGrid badges={badges} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {badges.filter(b => b.unlocked).slice(-5).reverse().map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">Unlocked: {badge.name}</p>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
                <Badge variant="secondary" className="text-success">
                  +{badge.xpReward} XP
                </Badge>
              </div>
            ))}
            {badges.filter(b => b.unlocked).length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Complete challenges to unlock badges and see activity here!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
