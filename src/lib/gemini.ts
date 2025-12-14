/**
 * Gemini API Client
 *
 * This module initializes the Google Generative AI client and provides a function
 * to interact with the Gemini API for solving doubts and answering questions.
 */

import {
  GoogleGenerativeAI,
  GenerationConfig,
  Content,
  Part,
} from "@google/generative-ai";

// Get the Gemini API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Throw an error if the API key is missing
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set. Please add it to your .env file.");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// --- PROMPT ENGINEERING ---

// Default system prompt for the AI doubt solver
const systemPrompt = `
You are an expert AI tutor for students. Your name is Graspify.
- When a user asks a question, provide a clear, concise, and accurate answer.
- If the user provides their own step-by-step solution, you must verify it.
- For each step in the user's solution:
  - State whether the step is CORRECT or INCORRECT.
  - Provide a detailed explanation for why the step is correct or incorrect.
  - If a step is incorrect, provide the correct step and continue verifying the subsequent steps based on the corrected logic.
- Always be encouraging and maintain a positive tone.
`;

/**
 * Solves a user's doubt using the Gemini API.
 *
 * @param question - The user's question or problem.
 * @param userSolution - Optional. The user's own solution to be verified.
 * @returns The AI-generated response.
 */
export const solveDoubt = async (
  question: string,
  userSolution?: string
): Promise<string> => {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Set generation config
    const generationConfig: GenerationConfig = {
      temperature: 0.7,
      topP: 1,
      topK: 1,
      maxOutputTokens: 2048,
    };

    // Construct the chat history with the system prompt
    const history: Content[] = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I am Graspify, your expert AI tutor. I will help you with your doubts and verify your solutions." }],
      },
    ];

    // Create the user's prompt
    let userPrompt = `Question: ${question}`;
    if (userSolution) {
      userPrompt += `\n\nHere is my solution. Please verify it step-by-step:\n${userSolution}`;
    }

    const parts: Part[] = [{ text: userPrompt }];

    // Start a chat session and send the message
    const chat = model.startChat({
      generationConfig,
      history,
    });

    const result = await chat.sendMessage(parts);
    const response = result.response;

    // Check if the response is empty or blocked
    if (!response || !response.text) {
      throw new Error("No response from Gemini API. It might have been blocked.");
    }

    return response.text();
  } catch (error) {
    console.error("Error solving doubt with Gemini:", error);
    // Provide a user-friendly error message
    return "Sorry, I encountered an error while trying to solve your doubt. Please check your API key and try again.";
  }
};

/**
 * Generates flashcards from source material using the Gemini API.
 *
 * @param sourceText - The text/notes to generate flashcards from
 * @returns Array of generated flashcards
 */
export const generateFlashcards = async (sourceText: string): Promise<Array<{
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
}>> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const generationConfig: GenerationConfig = {
      temperature: 0.7,
      topP: 1,
      topK: 1,
      maxOutputTokens: 2048,
    };

    const prompt = `You are an expert educator. Generate 5-7 high-quality flashcards from the provided source material.
    
Source Material:
${sourceText}

Generate flashcards in the following JSON format ONLY (no markdown, no extra text):
[
  {
    "front": "question or term",
    "back": "answer or definition",
    "difficulty": "easy|medium|hard"
  }
]

Guidelines:
- Front side should be a clear, concise question or term
- Back side should be a comprehensive but concise answer
- Assign difficulty based on complexity (easy = basic concept, medium = intermediate, hard = advanced)
- Cover the main concepts and key details from the material
- Make sure each card is self-contained and clear`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig,
    });

    const responseText = result.response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse flashcards from response");
    }

    const flashcards = JSON.parse(jsonMatch[0]);
    
    // Validate the response
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      throw new Error("No flashcards generated");
    }

    return flashcards;
  } catch (error) {
    console.error("Error generating flashcards with Gemini:", error);
    throw error;
  }
};

/**
 * Generates quiz questions from source material using the Gemini API.
 *
 * @param sourceText - The text/notes to generate quiz questions from
 * @returns Array of generated quiz questions
 */
export const generateQuizQuestions = async (sourceText: string): Promise<Array<{
  id: string;
  type: 'mcq';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}>> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const generationConfig: GenerationConfig = {
      temperature: 0.7,
      topP: 1,
      topK: 1,
      maxOutputTokens: 2048,
    };

    const prompt = `You are an expert educator. Generate 5-7 multiple-choice quiz questions from the provided source material.
    
Source Material:
${sourceText}

Generate quiz questions in the following JSON format ONLY (no markdown, no extra text):
[
  {
    "question": "What is...",
    "options": ["option1", "option2", "option3", "option4"],
    "correctAnswer": "option1",
    "explanation": "Detailed explanation of why this is correct",
    "difficulty": "easy|medium|hard"
  }
]

Guidelines:
- Each question should be clear and test understanding of key concepts
- Provide exactly 4 options (A, B, C, D alternatives)
- The correctAnswer should be one of the options exactly as written
- Explanation should clearly explain why the answer is correct
- Assign difficulty based on the concept's complexity
- Cover different topics and aspects from the material
- Make sure questions are distinct and don't overlap`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig,
    });

    const responseText = result.response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse questions from response");
    }

    const questions = JSON.parse(jsonMatch[0]);
    
    // Validate and transform the response
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions generated");
    }

    // Add IDs to questions
    return questions.map((q: any, index: number) => ({
      id: `q-${Date.now()}-${index}`,
      type: 'mcq' as const,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
    }));
  } catch (error) {
    console.error("Error generating quiz questions with Gemini:", error);
    throw error;
  }
};

/**
 * Generates an optimized study plan using the Gemini API.
 *
 * @param subject - The subject being studied
 * @param chapters - Array of chapters with names and difficulty levels
 * @param examDate - Target exam date (YYYY-MM-DD format)
 * @param dailyHours - Hours available for studying per day
 * @returns Optimized schedule with daily study tasks
 */
export const generateStudyPlan = async (
  subject: string,
  chapters: Array<{ name: string; difficulty: 'easy' | 'medium' | 'hard' }>,
  examDate: string,
  dailyHours: number
): Promise<any[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const generationConfig: GenerationConfig = {
      temperature: 0.7,
      topP: 1,
      topK: 1,
      maxOutputTokens: 2048,
    };

    const today = new Date().toISOString().split('T')[0];
    
    const prompt = `You are an expert study planner. Create an optimized study schedule for exam preparation.

Subject: ${subject}
Chapters to study:
${chapters.map((c, i) => `${i + 1}. ${c.name} (${c.difficulty} difficulty)`).join('\n')}

Today's date: ${today}
Target exam date: ${examDate}
Daily study hours available: ${dailyHours}

Generate a realistic, optimized study schedule in the following JSON format ONLY (no markdown, no extra text):
[
  {
    "date": "2025-12-15",
    "chapterIndex": 0,
    "hoursAllocated": 2,
    "topic": "specific topic to focus on"
  }
]

Guidelines:
- Create a schedule from today to 2-3 days before the exam
- Allocate more time to harder chapters
- Distribute chapters evenly but weight by difficulty
- Include revision sessions near the exam date
- Ensure total hours per day matches dailyHours (or less)
- Each entry represents one study session that day
- For chapters with multiple days, split topics
- Include breaks and revision sessions
- Return dates in YYYY-MM-DD format`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig,
    });

    const responseText = result.response.text();
    
    // Extract JSON from response - try multiple patterns
    let jsonMatch = responseText.match(/\[[\s\S]*\]/);
    
    // If first pattern fails, try JSON code block
    if (!jsonMatch) {
      jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonMatch[0] = jsonMatch[1]; // Extract just the JSON part
      }
    }
    
    if (!jsonMatch) {
      console.error("Response text:", responseText);
      throw new Error("Failed to parse study plan from response. Invalid format received.");
    }

    const schedulePlan = JSON.parse(jsonMatch[0]);
    
    // Validate and transform the response
    if (!Array.isArray(schedulePlan) || schedulePlan.length === 0) {
      throw new Error("No study plan generated");
    }

    // Transform API response into ScheduleDay format
    const scheduleMap = new Map<string, any[]>();
    
    schedulePlan.forEach((item: any, index: number) => {
      const date = item.date;
      if (!scheduleMap.has(date)) {
        scheduleMap.set(date, []);
      }
      
      const chapter = chapters[item.chapterIndex];
      if (chapter) {
        scheduleMap.get(date)!.push({
          chapterId: `ch-${item.chapterIndex}`,
          chapterName: chapter.name,
          subject,
          hours: item.hoursAllocated,
          completed: false,
        });
      }
    });

    // Convert map to array format
    const schedule = Array.from(scheduleMap).map(([date, tasks]) => ({
      date,
      tasks,
    })).sort((a, b) => a.date.localeCompare(b.date));

    return schedule;
  } catch (error) {
    console.error("Error generating study plan with Gemini:", error);
    throw error;
  }
};
