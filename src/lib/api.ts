// Frontend API client for communicating with the Graspify backend

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Doubt Solver API
export const doubtSolverAPI = {
  solve: async (question: string, subject?: string, imageUrl?: string) => {
    return fetchAPI("/doubt-solver", {
      method: "POST",
      body: JSON.stringify({ question, subject, imageUrl }),
    });
  },
};

// Quiz Generator API
export const quizGeneratorAPI = {
  generate: async (
    topic: string,
    difficulty: "easy" | "medium" | "hard" = "medium",
    questionCount: number = 5,
    format: "mcq" | "shortAnswer" | "mixed" = "mcq"
  ) => {
    return fetchAPI("/quiz-generator", {
      method: "POST",
      body: JSON.stringify({ topic, difficulty, questionCount, format }),
    });
  },
};

// Notes Summarizer API
export const notesSummarizerAPI = {
  summarize: async (notes: string) => {
    return fetchAPI("/notes-summarizer", {
      method: "POST",
      body: JSON.stringify({ notes }),
    });
  },
};

// Flashcards Generator API
export const flashcardsGeneratorAPI = {
  generate: async (content: string, topicName: string, cardCount: number = 10) => {
    return fetchAPI("/flashcards-generator", {
      method: "POST",
      body: JSON.stringify({ content, topicName, cardCount }),
    });
  },
};

// Study Planner API
export const studyPlannerAPI = {
  generate: async (
    syllabus: string,
    examDate: string,
    hoursPerDay: number,
    currentLevel?: string
  ) => {
    return fetchAPI("/study-planner", {
      method: "POST",
      body: JSON.stringify({ syllabus, examDate, hoursPerDay, currentLevel }),
    });
  },
};

// Multimodal Analysis API
export const multimodalAPI = {
  analyze: async (text: string, imageBase64: string, mimeType: string = "image/jpeg") => {
    return fetchAPI("/multimodal-analysis", {
      method: "POST",
      body: JSON.stringify({ text, imageBase64, mimeType }),
    });
  },
};

// Health check
export const healthCheck = async () => {
  return fetchAPI("/health");
};

export default {
  doubtSolverAPI,
  quizGeneratorAPI,
  notesSummarizerAPI,
  flashcardsGeneratorAPI,
  studyPlannerAPI,
  multimodalAPI,
  healthCheck,
};
