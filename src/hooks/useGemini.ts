import { useState, useCallback } from "react";
import {
  doubtSolverAPI,
  quizGeneratorAPI,
  notesSummarizerAPI,
  flashcardsGeneratorAPI,
  studyPlannerAPI,
  multimodalAPI,
} from "@/lib/api";

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for solving doubts
 */
export function useDoubtSolver() {
  const [state, setState] = useState<UseAsyncState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const solve = useCallback(async (question: string, subject?: string, imageUrl?: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await doubtSolverAPI.solve(question, subject, imageUrl);
      if (result.success) {
        setState({ data: result.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: result.error || "Failed to solve doubt" });
      }
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setState({ data: null, loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  }, []);

  return { ...state, solve };
}

/**
 * Hook for generating quizzes
 */
export function useQuizGenerator() {
  const [state, setState] = useState<UseAsyncState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const generate = useCallback(
    async (
      topic: string,
      difficulty: "easy" | "medium" | "hard" = "medium",
      questionCount: number = 5,
      format: "mcq" | "shortAnswer" | "mixed" = "mcq"
    ) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await quizGeneratorAPI.generate(
          topic,
          difficulty,
          questionCount,
          format
        );
        if (result.success) {
          setState({ data: result.data, loading: false, error: null });
        } else {
          setState({
            data: null,
            loading: false,
            error: result.error || "Failed to generate quiz",
          });
        }
        return result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        setState({ data: null, loading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  return { ...state, generate };
}

/**
 * Hook for summarizing notes
 */
export function useNotesSummarizer() {
  const [state, setState] = useState<UseAsyncState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const summarize = useCallback(async (notes: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await notesSummarizerAPI.summarize(notes);
      if (result.success) {
        setState({ data: result.data, loading: false, error: null });
      } else {
        setState({
          data: null,
          loading: false,
          error: result.error || "Failed to summarize notes",
        });
      }
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setState({ data: null, loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  }, []);

  return { ...state, summarize };
}

/**
 * Hook for generating flashcards
 */
export function useFlashcardsGenerator() {
  const [state, setState] = useState<UseAsyncState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const generate = useCallback(async (content: string, topicName: string, cardCount?: number) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await flashcardsGeneratorAPI.generate(content, topicName, cardCount);
      if (result.success) {
        setState({ data: result.data, loading: false, error: null });
      } else {
        setState({
          data: null,
          loading: false,
          error: result.error || "Failed to generate flashcards",
        });
      }
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setState({ data: null, loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  }, []);

  return { ...state, generate };
}

/**
 * Hook for generating study plans
 */
export function useStudyPlanner() {
  const [state, setState] = useState<UseAsyncState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const generate = useCallback(
    async (syllabus: string, examDate: string, hoursPerDay: number, currentLevel?: string) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await studyPlannerAPI.generate(syllabus, examDate, hoursPerDay, currentLevel);
        if (result.success) {
          setState({ data: result.data, loading: false, error: null });
        } else {
          setState({
            data: null,
            loading: false,
            error: result.error || "Failed to generate study plan",
          });
        }
        return result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        setState({ data: null, loading: false, error: errorMsg });
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  return { ...state, generate };
}

/**
 * Hook for multimodal analysis (text + image)
 */
export function useMultimodalAnalysis() {
  const [state, setState] = useState<UseAsyncState<any>>({
    data: null,
    loading: false,
    error: null,
  });

  const analyze = useCallback(async (text: string, imageBase64: string, mimeType?: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await multimodalAPI.analyze(text, imageBase64, mimeType);
      if (result.success) {
        setState({ data: result.data, loading: false, error: null });
      } else {
        setState({
          data: null,
          loading: false,
          error: result.error || "Failed to analyze content",
        });
      }
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setState({ data: null, loading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  }, []);

  return { ...state, analyze };
}
