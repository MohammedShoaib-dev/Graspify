import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useGameStore } from '@/lib/gameStore';
import { Confetti } from '@/components/gamification/Confetti';
import {
  FileQuestion,
  Upload,
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { Question, Quiz } from '@/types';

const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'mcq',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', 'x²', '2'],
    correctAnswer: '2x',
    explanation: 'Using the power rule, d/dx(x²) = 2x¹ = 2x',
    difficulty: 'easy',
  },
  {
    id: '2',
    type: 'mcq',
    question: 'What is the integral of 2x?',
    options: ['x²', 'x² + C', '2x²', 'x² + 2'],
    correctAnswer: 'x² + C',
    explanation: 'The integral of 2x is x² plus a constant of integration C.',
    difficulty: 'medium',
  },
  {
    id: '3',
    type: 'mcq',
    question: 'What is sin(π/2)?',
    options: ['0', '1', '-1', '1/2'],
    correctAnswer: '1',
    explanation: 'sin(90°) or sin(π/2) equals 1.',
    difficulty: 'easy',
  },
  {
    id: '4',
    type: 'mcq',
    question: 'What is the limit of (1 + 1/n)^n as n approaches infinity?',
    options: ['1', 'e', '∞', '0'],
    correctAnswer: 'e',
    explanation: 'This is one of the definitions of Euler\'s number e ≈ 2.71828.',
    difficulty: 'hard',
  },
  {
    id: '5',
    type: 'mcq',
    question: 'If f(x) = ln(x), what is f\'(x)?',
    options: ['1/x', 'x', 'ln(x)/x', 'e^x'],
    correctAnswer: '1/x',
    explanation: 'The derivative of natural log is 1/x.',
    difficulty: 'medium',
  },
];

export default function QuizGenerator() {
  const { toast } = useToast();
  const { addXP, incrementStat, updateMissionProgress, unlockBadge } = useGameStore();
  
  const [sourceText, setSourceText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; answer: string; correct: boolean }[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const generateQuiz = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: 'Generated Quiz',
      source: sourceText.substring(0, 50) + '...',
      questions: mockQuestions,
      createdAt: new Date().toISOString(),
      attempts: [],
    };
    
    setQuiz(newQuiz);
    setIsGenerating(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setQuizCompleted(false);
    
    toast({
      title: "Quiz generated! 📝",
      description: `${newQuiz.questions.length} questions ready for you.`,
    });
  };

  const submitAnswer = () => {
    if (!selectedAnswer || !quiz) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    setAnswers([...answers, {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      correct: isCorrect,
    }]);
    
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    if (!quiz) return;
    
    const correctCount = answers.filter(a => a.correct).length + 
      (selectedAnswer === quiz.questions[currentQuestionIndex].correctAnswer ? 1 : 0);
    const totalQuestions = quiz.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const isPerfect = score === 100;
    
    setQuizCompleted(true);
    incrementStat('quizzesCompleted');
    updateMissionProgress('quiz');
    
    let totalXP = 0;
    const { xpGained } = addXP('complete_quiz');
    totalXP += xpGained;
    
    if (isPerfect) {
      const { xpGained: bonusXP } = addXP('perfect_quiz');
      totalXP += bonusXP;
      unlockBadge('perfect_score');
      setShowConfetti(true);
    }
    
    toast({
      title: isPerfect ? "Perfect Score! 🎉" : "Quiz Completed!",
      description: `You scored ${score}% and earned ${totalXP} XP!`,
    });
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setQuizCompleted(false);
  };

  const difficultyColors = {
    easy: 'bg-success/20 text-success',
    medium: 'bg-warning/20 text-warning',
    hard: 'bg-destructive/20 text-destructive',
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const progress = quiz ? ((currentQuestionIndex + (showResult ? 1 : 0)) / quiz.questions.length) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <Confetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <div>
        <h1 className="text-3xl font-display font-bold">Quiz Generator</h1>
        <p className="text-muted-foreground mt-1">
          Upload notes or paste text to generate AI-powered quizzes
        </p>
      </div>

      {!quiz ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-primary" />
              Create New Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium mb-1">Upload PDF or Image</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to browse
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">or paste text</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sourceText">Source Text</Label>
              <Textarea
                id="sourceText"
                placeholder="Paste your notes, textbook content, or any study material here..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            
            <Button
              onClick={generateQuiz}
              disabled={!sourceText.trim() || isGenerating}
              className="w-full gradient-primary text-primary-foreground"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Quiz
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : quizCompleted ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-6 flex items-center justify-center">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground mb-6">
              You answered {answers.filter(a => a.correct).length} out of {quiz.questions.length} questions correctly
            </p>
            
            <div className="flex justify-center gap-4 mb-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-gradient">
                  {Math.round((answers.filter(a => a.correct).length / quiz.questions.length) * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button onClick={restartQuiz} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry Quiz
              </Button>
              <Button onClick={() => setQuiz(null)} className="gradient-primary text-primary-foreground">
                New Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : currentQuestion ? (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <Badge className={difficultyColors[currentQuestion.difficulty]}>
              {currentQuestion.difficulty}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-6">{currentQuestion.question}</h2>
              
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const showCorrect = showResult && isCorrect;
                  const showIncorrect = showResult && isSelected && !isCorrect;
                  
                  return (
                    <button
                      key={option}
                      onClick={() => !showResult && setSelectedAnswer(option)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        showCorrect
                          ? 'border-success bg-success/10'
                          : showIncorrect
                          ? 'border-destructive bg-destructive/10'
                          : isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showCorrect && <CheckCircle2 className="w-5 h-5 text-success" />}
                        {showIncorrect && <XCircle className="w-5 h-5 text-destructive" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {showResult && (
                <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
                  <h4 className="font-medium mb-1">Explanation</h4>
                  <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                {!showResult ? (
                  <Button
                    onClick={submitAnswer}
                    disabled={!selectedAnswer}
                    className="gradient-primary text-primary-foreground"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={nextQuestion} className="gradient-primary text-primary-foreground">
                    {currentQuestionIndex < quiz.questions.length - 1 ? (
                      <>
                        Next Question
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        See Results
                        <Trophy className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
