import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import StudyPlanner from "@/pages/StudyPlanner";
import QuizGenerator from "@/pages/QuizGenerator";
import Flashcards from "@/pages/Flashcards";
import DoubtSolver from "@/pages/DoubtSolver";
import Leaderboard from "@/pages/Leaderboard";
import Profile from "@/pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/study-planner" element={<StudyPlanner />} />
            <Route path="/quiz" element={<QuizGenerator />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/doubt-solver" element={<DoubtSolver />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
