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
  Bot,
  User,
} from "lucide-react";

// Gemini API function
import { solveDoubt } from "@/lib/gemini";

// Type definitions
import { DoubtMessage } from "@/types";
import { cn } from "@/lib/utils";

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
        "Welcome to the Doubt Solver! Ask me anything, or upload an image of a problem. You can also provide your own step-by-step solution for me to verify.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref for scrolling chat
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * Handle sending a message to the AI tutor
   */
  const handleSendMessage = async () => {
    if (!input.trim() && !solution.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a question or your solution.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: DoubtMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setInput("");
    setSolution("");

    try {
      // --- API CALL ---
      const aiResponse = await solveDoubt(input, solution);

      const assistantMessage: DoubtMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // --- GAMIFICATION ---
      const { xpGained } = addXP("correct_step", 20);
      incrementStat("doubtsAsked");
      if (solution.trim()) {
        incrementStat("stepsSubmitted");
      }
      updateMissionProgress("doubt", 1);

      toast({
        title: "XP Gained!",
        description: `You earned ${xpGained} XP for solving a doubt.`,
      });

      // Trigger confetti
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(
        `Failed to get response from AI. Please check your Gemini API key. Error: ${errorMessage}`
      );
      toast({
        title: "Error",
        description:
          "Could not connect to the AI. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle image upload for OCR
   * (This is a placeholder for now)
   */
  const handleImageUpload = () => {
    toast({
      title: "Coming Soon!",
      description: "Image upload and OCR support is under development.",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-4 pr-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 animate-fade-in",
                  message.role === "user" ? "justify-end" : ""
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
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
          </div>
        </CardContent>
        <div className="border-t p-4 bg-background">
          <div className="grid gap-4">
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Type your question or doubt here..."
                className="h-24 resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Textarea
                placeholder="Optional: Provide your step-by-step solution for verification..."
                className="h-32 resize-none"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lightbulb className="w-4 h-4" />
                <span>Shift + Enter for new line</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleImageUpload}
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || (!input.trim() && !solution.trim())}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Bot className="w-4 h-4 animate-spin" /> Thinking...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Ask Graspify
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
