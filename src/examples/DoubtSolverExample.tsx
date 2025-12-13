// Example implementation of DoubtSolver component using Gemini API

import { useState } from "react";
import { useDoubtSolver } from "@/hooks/useGemini";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export function DoubtSolverExample() {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState("");
  const { data, loading, error, solve } = useDoubtSolver();

  const handleSolveDoubt = async () => {
    if (!question.trim()) return;
    await solve(question, subject || undefined);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ask Your Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Subject (optional)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Textarea
            placeholder="Enter your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[120px]"
          />
          <Button
            onClick={handleSolveDoubt}
            disabled={loading || !question.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Solving...
              </>
            ) : (
              "Solve Doubt"
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

      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.explanation && (
              <div>
                <h3 className="font-semibold mb-2">Explanation</h3>
                <p className="text-gray-700">{data.explanation}</p>
              </div>
            )}

            {data.steps && (
              <div>
                <h3 className="font-semibold mb-2">Step-by-Step Solution</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {data.steps.map((step: string, idx: number) => (
                    <li key={idx} className="text-gray-700">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {data.insights && (
              <div>
                <h3 className="font-semibold mb-2">Key Insights</h3>
                <ul className="list-disc list-inside space-y-1">
                  {data.insights.map((insight: string, idx: number) => (
                    <li key={idx} className="text-gray-700">
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.relatedConcepts && (
              <div>
                <h3 className="font-semibold mb-2">Related Concepts</h3>
                <ul className="list-disc list-inside space-y-1">
                  {data.relatedConcepts.map((concept: string, idx: number) => (
                    <li key={idx} className="text-gray-700">
                      {concept}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
