/**
 * Study Planner Page Component
 *
 * AI-powered study schedule generation for exam preparation:
 * - Define subjects and chapters with difficulty levels
 * - Set exam date and daily study hours
 * - Generate optimized study schedules
 * - Track chapter completion
 * - Earn XP for creating plans
 * - Visual calendar view of planned study sessions
 */

// React hooks
import { useState } from "react";

// UI components from shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Hooks and state
import { useToast } from "@/hooks/use-toast";
import { useGameStore } from "@/lib/gameStore";

// Icons from lucide-react
import {
  Calendar,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
} from "lucide-react";

// Type definitions
import { StudyPlan, ScheduleDay } from "@/types";

// AI integration
import { generateStudyPlan } from "@/lib/gemini";

/**
 * Interface for chapter input during plan creation
 */
interface ChapterInput {
  name: string;
  difficulty: "easy" | "medium" | "hard";
}

/**
 * StudyPlanner Component
 *
 * Provides study schedule generation with:
 * - Subject and chapter management
 * - Difficulty-based time allocation
 * - Exam date-based schedule generation
 * - Visual study calendar
 * - Progress tracking
 */
export default function StudyPlanner() {
  // Hooks
  const { toast } = useToast();
  const { addXP, incrementStat, updateMissionProgress } = useGameStore();

  // State for plan creation
  const [subject, setSubject] = useState("");
  const [chapters, setChapters] = useState<ChapterInput[]>([
    { name: "", difficulty: "medium" },
  ]);
  const [examDate, setExamDate] = useState("");
  const [dailyHours, setDailyHours] = useState("2");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);

  /**
   * Add a new chapter input field
   */
  const addChapter = () => {
    setChapters([...chapters, { name: "", difficulty: "medium" }]);
  };

  /**
   * Remove a chapter from the list
   *
   * @param index - Index of chapter to remove
   */
  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  /**
   * Update a chapter's properties
   *
   * @param index - Chapter index
   * @param field - Field to update (name or difficulty)
   * @param value - New value
   */
  const updateChapter = (
    index: number,
    field: keyof ChapterInput,
    value: string
  ) => {
    const updated = [...chapters];
    updated[index] = { ...updated[index], [field]: value };
    setChapters(updated);
  };

  /**
   * Generate study plan from provided information
   * Uses Gemini AI to create optimized study schedule
   */
  const generatePlan = async () => {
    if (!subject || !examDate || chapters.some((c) => !c.name)) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields before generating a plan.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Call Gemini API to generate optimized schedule
      const schedule = await generateStudyPlan(
        subject,
        chapters,
        examDate,
        parseFloat(dailyHours)
      );

      // Create study plan with AI-generated schedule
      const plan: StudyPlan = {
        id: `plan-${Date.now()}`,
        subject,
        chapters: chapters.map((c, i) => ({
          id: `ch-${i}`,
          name: c.name,
          difficulty: c.difficulty,
          estimatedHours:
            c.difficulty === "hard" ? 6 : c.difficulty === "medium" ? 4 : 2,
          completed: false,
        })),
        examDate,
        dailyHours: parseFloat(dailyHours),
        schedule,
        createdAt: new Date().toISOString(),
      };

      setGeneratedPlan(plan);

      const today = new Date();
      const exam = new Date(examDate);
      const daysUntilExam = Math.ceil(
        (exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      incrementStat("studyPlansCreated");
      updateMissionProgress("study");
      const { xpGained } = addXP("complete_quiz", 30);

      toast({
        title: "Study plan generated! 📚",
        description: `You earned ${xpGained} XP. ${daysUntilExam} days until your exam.`,
      });
    } catch (error) {
      console.error("Error generating study plan:", error);
      toast({
        title: "Error generating plan",
        description: "Failed to generate study plan. Please check your input and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTaskComplete = (dayIndex: number, taskIndex: number) => {
    if (!generatedPlan) return;

    const updated = { ...generatedPlan };
    updated.schedule[dayIndex].tasks[taskIndex].completed =
      !updated.schedule[dayIndex].tasks[taskIndex].completed;
    setGeneratedPlan(updated);
  };

  const difficultyColors = {
    easy: "bg-success/20 text-success border-success/30",
    medium: "bg-warning/20 text-warning border-warning/30",
    hard: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold">Study Planner</h1>
        <p className="text-muted-foreground mt-1">
          Create a personalized study schedule powered by AI
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Plan Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics, Physics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Chapters / Topics</Label>
              <div className="space-y-2">
                {chapters.map((chapter, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Chapter ${index + 1}`}
                      value={chapter.name}
                      onChange={(e) =>
                        updateChapter(index, "name", e.target.value)
                      }
                      className="flex-1"
                    />
                    <select
                      value={chapter.difficulty}
                      onChange={(e) =>
                        updateChapter(index, "difficulty", e.target.value)
                      }
                      className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    {chapters.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeChapter(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addChapter}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Chapter
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="examDate">Exam Date</Label>
                <Input
                  id="examDate"
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyHours">Daily Study Hours</Label>
                <Input
                  id="dailyHours"
                  type="number"
                  min="1"
                  max="12"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={generatePlan}
              disabled={isGenerating}
              className="w-full gradient-primary text-primary-foreground"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Study Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Your Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {generatedPlan ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {generatedPlan.schedule.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className="p-3 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {day.tasks.reduce((acc, t) => acc + t.hours, 0)}h
                      </div>
                    </div>
                    {day.tasks.map((task, taskIndex) => (
                      <div
                        key={task.chapterId}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                          task.completed
                            ? "bg-success/10 border border-success/30"
                            : "bg-background hover:bg-muted/50"
                        }`}
                        onClick={() => toggleTaskComplete(dayIndex, taskIndex)}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.completed
                              ? "bg-success border-success text-success-foreground"
                              : "border-muted-foreground"
                          }`}
                        >
                          {task.completed && (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm ${
                              task.completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {task.chapterName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {task.subject}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No plan yet</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the details and generate your personalized study plan
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
