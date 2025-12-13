// Example implementation of QuizGenerator component using Gemini API

import { useState } from "react";
import { useQuizGenerator } from "@/hooks/useGemini";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function QuizGeneratorExample() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [questionCount, setQuestionCount] = useState(5);
  const [format, setFormat] = useState<"mcq" | "shortAnswer" | "mixed">("mcq");
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const { data, loading, error, generate } = useQuizGenerator();

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return;
    await generate(topic, difficulty, questionCount, format);
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const calculateScore = () => {
    if (!data?.questions) return 0;
    let correct = 0;
    data.questions.forEach((q: any) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / data.questions.length) * 100);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Generate Quiz</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Topic (e.g., Photosynthesis)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <Select
                value={difficulty}
                onValueChange={(v: any) => setDifficulty(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Format</label>
              <Select value={format} onValueChange={(v: any) => setFormat(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                  <SelectItem value="shortAnswer">Short Answer</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Number of Questions</label>
            <Input
              type="number"
              min={1}
              max={50}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            />
          </div>

          <Button
            onClick={handleGenerateQuiz}
            disabled={loading || !topic.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Quiz"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {data?.questions && (
        <div className="space-y-4">
          {Object.keys(selectedAnswers).length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <p className="text-green-800 font-semibold">
                  Score: {calculateScore()}%
                </p>
              </CardContent>
            </Card>
          )}

          {data.questions.map((question: any, idx: number) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  Question {idx + 1}: {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {question.type === "mcq" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option: string, optIdx: number) => (
                      <label
                        key={optIdx}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={selectedAnswers[question.id] === option}
                          onChange={() =>
                            handleAnswerSelect(question.id, option)
                          }
                          className="w-4 h-4"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {selectedAnswers[question.id] && (
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-sm font-semibold mb-1">Explanation:</p>
                    <p className="text-sm text-gray-700">
                      {question.explanation}
                    </p>
                  </div>
                )}

                {question.hints && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 font-medium">
                      💡 Hints
                    </summary>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {question.hints.map((hint: string, idx: number) => (
                        <li key={idx}>{hint}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
