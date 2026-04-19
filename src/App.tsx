import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Start from "./pages/Start";
import Consent from "./pages/Consent";
import TaskPage from "./pages/TaskPage";
import WordSearchTaskPage from "./pages/WordSearchTaskPage";
import ExerciseList from "./pages/ExerciseList";
import SyllableExercisePage from "./pages/SyllableExercisePage";
import MinimalPairExercisePage from "./pages/MinimalPairExercisePage";
import WordChainExercisePage from "./pages/WordChainExercisePage";
import ReadingCompExercisePage from "./pages/ReadingCompExercisePage";
import FinalResults from "./pages/FinalResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/excercises" element={<Navigate to="/exercises" replace />} />
          <Route path="/start" element={<Start />} />
          <Route path="/consent" element={<Consent />} />
          <Route path="/task/pseudowords" element={<TaskPage />} />
          <Route path="/task/word-search" element={<WordSearchTaskPage />} />
          <Route path="/exercises" element={<ExerciseList />} />
          <Route path="/exercise/syllables" element={<SyllableExercisePage />} />
          <Route path="/exercise/minimal-pairs" element={<MinimalPairExercisePage />} />
          <Route path="/exercise/word-chains" element={<WordChainExercisePage />} />
          <Route path="/exercise/reading-comp" element={<ReadingCompExercisePage />} />
          <Route path="/results" element={<FinalResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
