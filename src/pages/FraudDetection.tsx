import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface QuizData {
  questions: Question[];
}

const FraudQuiz = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const fetchQuiz = async () => {
    setIsLoading(true);
    setQuizData(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setIsFinished(false);

    try {
      if (!GEMINI_API_KEY) {
        throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `
You are a fraud detection expert for fintech.
Generate 5 multiple-choice questions about financial fraud detection, scam prevention, and fintech security.
Each question must:
- Be realistic and educational
- Have exactly 4 options
- Include only one correct answer
Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0
    }
  ]
}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Gemini API quota/rate limit exceeded (429). Please try again later or use a key with available quota."
          );
        }

        let apiError = `HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          apiError = errJson?.error?.message || apiError;
        } catch {
          // Ignore JSON parsing errors and keep the HTTP status message.
        }

        throw new Error(`Gemini API request failed: ${apiError}`);
      }

      const data = await response.json();
      const textContent =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!textContent) throw new Error("Empty response from Gemini API");

      const cleaned = textContent.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.questions || parsed.questions.length === 0) {
        throw new Error("Invalid quiz format received");
      }

      setQuizData(parsed);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      toast({
        title: "Failed to load quiz",
        description:
          error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleAnswer = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(optionIndex);
    setShowFeedback(true);

    if (
      quizData &&
      optionIndex === quizData.questions[currentQuestion].answer
    ) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (!quizData) return;

    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  };

  // --- Shared Background Style ---
  const backgroundStyle = {
    background: "linear-gradient(to bottom right, #0A0F2D, #1F2A6C)",
    color: "white",
    fontFamily: "'Inter', 'SF Pro Display', sans-serif",
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={backgroundStyle}
      >
        <Card
          className="w-full max-w-2xl p-12 shadow-2xl animate-fade-in"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <Loader2
              className="w-12 h-12 animate-spin"
              style={{ color: "#00FFC6" }}
            />
            <p className="text-lg text-gray-300">Generating your quiz...</p>
          </div>
        </Card>
      </div>
    );
  }

  // --- No Quiz Data ---
  if (!quizData || quizData.questions.length === 0) {
    return (
      <div
        className="flex min-h-screen items-center justify-center p-4"
        style={backgroundStyle}
      >
        <Card
          className="w-full max-w-2xl p-12 shadow-2xl animate-fade-in text-center"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Unable to load quiz
          </h2>
          <Button
            onClick={fetchQuiz}
            className="px-6 py-3 text-lg rounded-full"
            style={{
              backgroundColor: "#00FFC6",
              color: "#0A0F2D",
              boxShadow: "0 0 12px #00FFC6",
            }}
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  // --- Quiz Finished ---
  if (isFinished) {
    const percentage = Math.round((score / quizData.questions.length) * 100);
    return (
      <div
        className="flex min-h-screen items-center justify-center p-4"
        style={backgroundStyle}
      >
        <Card
          className="w-full max-w-2xl p-12 shadow-2xl animate-fade-in text-center"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <h2 className="text-4xl font-bold mb-6">Quiz Complete!</h2>
          <p className="text-6xl font-bold" style={{ color: "#00FFC6" }}>
            {percentage}%
          </p>
          <p className="text-xl text-gray-300 mb-8">
            You scored {score} out of {quizData.questions.length}
          </p>
          <Button
            onClick={fetchQuiz}
            className="px-8 py-6 text-lg rounded-full"
            style={{
              backgroundColor: "#00FFC6",
              color: "#0A0F2D",
              boxShadow: "0 0 12px #00FFC6",
            }}
          >
            Try Another Quiz
          </Button>
        </Card>
      </div>
    );
  }

  // --- Active Quiz Question ---
  const question = quizData.questions[currentQuestion];

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={backgroundStyle}
    >
      <Card
        className="w-full max-w-2xl p-8 md:p-12 shadow-2xl animate-fade-in"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div className="space-y-8">
          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Question {currentQuestion + 1} of {quizData.questions.length}
            </span>
            <span>Score: {score}</span>
          </div>

          {/* Question */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed text-white">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.answer;
                const showAsCorrect = showFeedback && isCorrect;
                const showAsWrong = showFeedback && isSelected && !isCorrect;

                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={showFeedback}
                    className="w-full p-6 text-left text-base md:text-lg justify-start h-auto rounded-xl transition-all border"
                    style={{
                      backgroundColor: showAsCorrect
                        ? "rgba(0, 255, 198, 0.15)"
                        : showAsWrong
                        ? "rgba(255, 75, 75, 0.15)"
                        : isSelected
                        ? "rgba(0, 255, 198, 0.08)"
                        : "rgba(255,255,255,0.05)",
                      borderColor: showAsCorrect
                        ? "#00FFC6"
                        : showAsWrong
                        ? "#FF4B4B"
                        : "rgba(255,255,255,0.2)",
                      color: "white",
                    }}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Next Button */}
          {showFeedback && (
            <div className="space-y-4 animate-fade-in">
              <div
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor:
                    selectedAnswer === question.answer
                      ? "rgba(0,255,198,0.15)"
                      : "rgba(255,75,75,0.15)",
                  borderColor:
                    selectedAnswer === question.answer ? "#00FFC6" : "#FF4B4B",
                }}
              >
                <p className="text-lg font-semibold text-white">
                  {selectedAnswer === question.answer
                    ? "Correct! ✓"
                    : "Wrong ✗"}
                </p>
              </div>

              <Button
                onClick={handleNext}
                className="w-full py-6 text-lg rounded-full"
                style={{
                  backgroundColor: "#00FFC6",
                  color: "#0A0F2D",
                  boxShadow: "0 0 12px #00FFC6",
                }}
              >
                {currentQuestion < quizData.questions.length - 1
                  ? "Next Question"
                  : "See Results"}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FraudQuiz;
