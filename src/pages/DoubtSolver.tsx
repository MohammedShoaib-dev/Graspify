/**
 * Doubt Solver Page Component
 *
 * AI-powered Q&A system for learning support:
 * - Chat interface with AI tutor
 * - Image upload for problem solving (OCR)
 * - Step-by-step solution verification
 * - Confidence scoring for explanations
 * - Solution tracking and history
 * - XP rewards for solving doubts
 */

// React hooks
import { useState, useRef, useEffect } from "react";

// UI components from shadcn
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Hooks and state
import { useToast } from "@/hooks/use-toast";
import { useGameStore } from "@/lib/gameStore";

// Gamification components
import { Confetti } from "@/components/gamification/Confetti";

// Icons from lucide-react
import {
  Send,
  Upload,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Sparkles,
  MessageCircleQuestion,
  Bot,
  User,
  Zap,
  HelpCircle,
} from "lucide-react";

// Type definitions
import { DoubtMessage, StepCheck } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Mock AI tutor responses
 * In production, these would come from an AI API
 */
const mockResponses = [
  {
    content:
      "I see you're working on this calculus problem! Let me help you break it down step by step. What's your first approach to solving ∫(x² + 3x)dx?",
    type: "question",
  },
  {
    content:
      "Great start! You've correctly identified that we need to apply the power rule. For x², the integral would be x³/3. Now, what would be the integral of 3x?",
    step: {
      correct: true,
      explanation: "Using the power rule correctly",
      confidence: 0.95,
    },
  },
  {
    content:
      "Almost there! Remember that when integrating 3x, you need to increase the exponent by 1 and divide by the new exponent. So 3x becomes 3x²/2. Don't forget to add the constant of integration C!",
    step: {
      correct: false,
      explanation: "Minor calculation error in the coefficient",
      hint: "Remember: ∫ax^n dx = ax^(n+1)/(n+1)",
      confidence: 0.88,
    },
  },
];

/**
 * DoubtSolver Component
 *
 * Provides AI tutoring with:
 * - Natural conversation interface
 * - Step verification and feedback
 * - Image upload and OCR support
 * - Detailed explanations with hints
 * - Session history and tracking
 * - XP rewards for engagement
 */
export default function DoubtSolver() {
  // Hooks
  const { toast } = useToast();
  const { addXP, incrementStat, updateMissionProgress } = useGameStore();

  // State for chat
  const [messages, setMessages] = useState<DoubtMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! 👋 I'm your AI tutor. Upload a problem image or type your question, and I'll help you solve it step by step. I'll verify each step you take!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: DoubtMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    setInput("");
    setIsLoading(true);

    incrementStat("stepsSubmitted");
    addXP("submit_step");

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const responseIndex = Math.min(
      messages.filter((m) => m.role === "assistant").length,
      mockResponses.length - 1
    );
    const mockResponse = mockResponses[responseIndex];

    const assistantMessage: DoubtMessage = {
      id: `msg-${Date.now()}-ai`,
      role: "assistant",
      content: mockResponse.content,
      step: mockResponse.step
        ? {
            userStep: input,
            correct: mockResponse.step.correct,
            explanation: mockResponse.step.explanation,
            hint: mockResponse.step.hint,
            confidence: mockResponse.step.confidence,
          }
        : undefined,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);

    if (mockResponse.step?.correct) {
      incrementStat("correctSteps");
      const { xpGained } = addXP("correct_step");
      setShowConfetti(true);
      toast({
        title: "Correct step! ✅",
        description: `Great work! +${xpGained} XP`,
      });
    }

    incrementStat("doubtsAsked");
    updateMissionProgress("doubt");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const requestHint = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const hintMessage: DoubtMessage = {
      id: `msg-${Date.now()}-hint`,
      role: "assistant",
      content:
        "💡 **Hint:** Try breaking down the problem into smaller parts. For integrals, identify each term separately and apply the power rule to each one.",
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, hintMessage]);
    setIsLoading(false);
  };

  const requestFullSolution = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const solutionMessage: DoubtMessage = {
      id: `msg-${Date.now()}-solution`,
      role: "assistant",
      content: `📚 **Full Solution:**

Given: ∫(x² + 3x)dx

**Step 1:** Apply the sum rule
∫(x² + 3x)dx = ∫x²dx + ∫3xdx

**Step 2:** Apply the power rule to each term
∫x²dx = x³/3
∫3xdx = 3x²/2

**Step 3:** Combine and add constant
= x³/3 + 3x²/2 + C

**Final Answer:** x³/3 + 3x²/2 + C

✅ Verified by math engine`,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, solutionMessage]);
    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col animate-fade-in">
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="mb-4">
        <h1 className="text-3xl font-display font-bold">Doubt Solver</h1>
        <p className="text-muted-foreground mt-1">
          Get step-by-step help with AI-verified solutions
        </p>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 overflow-hidden">
        <CardContent className="h-full flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.role === "user" ? "gradient-primary" : "bg-muted"
                  )}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.step && (
                    <div
                      className={cn(
                        "flex items-center gap-2 mb-2 pb-2 border-b",
                        message.step.correct
                          ? "border-success/30 text-success"
                          : "border-destructive/30 text-destructive"
                      )}
                    >
                      {message.step.correct ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {message.step.correct ? "Correct!" : "Needs adjustment"}
                      </span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {Math.round(message.step.confidence * 100)}% confidence
                      </Badge>
                    </div>
                  )}

                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>

                  {message.step?.hint && (
                    <div className="mt-3 p-2 rounded-lg bg-warning/10 border border-warning/30">
                      <div className="flex items-center gap-2 text-warning text-xs font-medium mb-1">
                        <Lightbulb className="w-3 h-3" />
                        Hint
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {message.step.hint}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 bg-background">
            <div className="flex gap-2 mb-3">
              <Button variant="outline" size="sm" className="text-xs">
                <Upload className="w-3 h-3 mr-1" />
                Upload Problem
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={requestHint}
                disabled={isLoading}
              >
                <Lightbulb className="w-3 h-3 mr-1" />
                Get Hint
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={requestFullSolution}
                disabled={isLoading}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Full Solution
              </Button>
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Type your step or question... (Shift+Enter for new line)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] max-h-[120px] resize-none"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="gradient-primary text-primary-foreground"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
              <Zap className="w-3 h-3" />
              <span>+2 XP per step submitted</span>
              <span className="mx-2">•</span>
              <CheckCircle2 className="w-3 h-3 text-success" />
              <span>+10 XP for correct steps</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
