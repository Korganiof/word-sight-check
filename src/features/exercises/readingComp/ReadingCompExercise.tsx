import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle, RotateCcw } from "lucide-react";
import { readingCompPassages } from "./readingCompItems.fi";
import { saveReadingCompResult } from "@/lib/exerciseResults";

type Phase = "reading" | "questions" | "done";

export function ReadingCompExercise() {
  const navigate = useNavigate();

  const [passageIndex, setPassageIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("reading");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const currentPassage = readingCompPassages[passageIndex];
  const currentQuestion = currentPassage.questions[questionIndex];
  const totalPassages = readingCompPassages.length;
  const totalQuestionsAllPassages = readingCompPassages.reduce(
    (sum, p) => sum + p.questions.length,
    0,
  );
  const answeredCountBeforeCurrent =
    readingCompPassages
      .slice(0, passageIndex)
      .reduce((sum, p) => sum + p.questions.length, 0) + questionIndex;

  const progressPct =
    phase === "done"
      ? 100
      : Math.round(
          ((answeredCountBeforeCurrent + (selectedAnswer !== null ? 1 : 0)) /
            totalQuestionsAllPassages) *
            100,
        );

  const startQuestions = useCallback(() => {
    setPhase("questions");
    setQuestionIndex(0);
    setSelectedAnswer(null);
  }, []);

  const advanceToNext = useCallback(() => {
    setSelectedAnswer(null);
    if (questionIndex < currentPassage.questions.length - 1) {
      setQuestionIndex((i) => i + 1);
      return;
    }
    if (passageIndex < totalPassages - 1) {
      setPassageIndex((i) => i + 1);
      setQuestionIndex(0);
      setPhase("reading");
      return;
    }
    setPhase("done");
  }, [questionIndex, passageIndex, currentPassage.questions.length, totalPassages]);

  const handleSelect = useCallback(
    (option: string) => {
      if (selectedAnswer !== null) return;
      const isCorrect = option === currentQuestion.correctAnswer;
      setSelectedAnswer(option);
      if (isCorrect) setCorrectCount((n) => n + 1);
      setTimeout(() => advanceToNext(), 900);
    },
    [selectedAnswer, currentQuestion, advanceToNext],
  );

  useEffect(() => {
    if (phase === "done") {
      saveReadingCompResult({ correct: correctCount, total: totalQuestionsAllPassages });
    }
  }, [phase, correctCount, totalQuestionsAllPassages]);

  if (phase === "done") {
    return (
      <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">
        <nav className="px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
        </nav>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl text-center">
            <div className="w-14 h-14 rounded-full bg-[#f9e4d6] flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-7 h-7 text-[#785a00]" />
            </div>

            <h1 className="text-3xl font-bold text-[#241a11] tracking-tight mb-3">
              Harjoitus valmis
            </h1>
            <p className="text-[#755e4d] mb-8 leading-relaxed">
              Kiitos, vastauksesi on tallennettu. Yksittäisen harjoituksen tuloksia ei
              näytetä — kokonaiskuva muodostuu yhteenvedossa, kun olet tehnyt useamman
              osan.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/exercises")}
                className="bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Takaisin harjoituksiin
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#755e4d] bg-[#f9e4d6] hover:bg-[#f3dfd1] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Tee uudestaan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
      </nav>

      {/* Progress */}
      <div className="px-6 pb-2 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
            Luetun ymmärtäminen — Teksti {passageIndex + 1} / {totalPassages}
          </p>
          <p className="text-xs text-[#d2c5b0]">
            {phase === "questions"
              ? `Kysymys ${questionIndex + 1} / ${currentPassage.questions.length}`
              : "Lue teksti"}
          </p>
        </div>
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div
            className="h-1 bg-[#C69A2B] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          {phase === "reading" && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-[#785a00]" />
                <span className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
                  Teksti
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#241a11] tracking-tight mb-6">
                {currentPassage.title}
              </h1>

              <div
                className="bg-white rounded-xl p-7 mb-6 space-y-4"
                style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
              >
                {currentPassage.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-[17px] text-[#241a11] leading-[1.7]"
                  >
                    {p}
                  </p>
                ))}
              </div>

              <p className="text-sm text-[#755e4d] mb-5 leading-relaxed">
                Lue teksti rauhassa. Kun olet valmis, siirry vastaamaan kysymyksiin.
                Et voi palata takaisin tekstiin kysymysten aikana.
              </p>

              <button
                onClick={startQuestions}
                className="flex items-center justify-center gap-2 bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Aloita kysymykset
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {phase === "questions" && (
            <div
              className="bg-white rounded-xl p-8"
              style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
            >
              <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-3">
                Kysymys tekstistä: {currentPassage.title}
              </p>

              <p className="text-xl font-semibold text-[#241a11] leading-relaxed mb-8">
                {currentQuestion.question}
              </p>

              <div className="flex flex-col gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;

                  let buttonClass =
                    "text-left px-5 py-4 rounded-xl text-base font-medium transition-colors ";

                  if (selectedAnswer !== null) {
                    if (isSelected) {
                      buttonClass += "bg-[#C69A2B] text-white";
                    } else {
                      buttonClass += "bg-[#f9ede4] text-[#d2c5b0]";
                    }
                  } else {
                    buttonClass +=
                      "bg-[#f9e4d6] text-[#241a11] hover:bg-[#C69A2B] hover:text-white cursor-pointer";
                  }

                  return (
                    <button
                      key={option}
                      className={buttonClass}
                      onClick={() => handleSelect(option)}
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
