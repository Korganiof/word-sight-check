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
import SpellingErrorsExercisePage from "./pages/SpellingErrorsExercisePage";
import FinalResults from "./pages/FinalResults";
import NotFound from "./pages/NotFound";

// The sentence-chain, true/false and syllable-boundary scaffolds in
// src/features/exercises are intentionally NOT routed: their passages need a
// provenance check before anything ships them. Re-add a <Route> here to
// bring one back.
const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
      <Route path="/exercise/spelling-errors" element={<SpellingErrorsExercisePage />} />
      <Route path="/results" element={<FinalResults />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
