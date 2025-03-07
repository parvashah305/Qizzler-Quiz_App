import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SingleQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({}); 
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`https://qizzler-backend.vercel.app/quizzes/${id}`);
        const data = await response.json();

        if (response.ok) {
          setQuiz(data.quiz);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleOptionSelect = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`https://qizzler-backend.vercel.app/quizzes/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
            questionId,
            selectedOption,
          })),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setScore(data.score);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to submit quiz");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen ">
      <div className="p-6 max-w-2xl mx-auto bg-gray-800 text-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">{quiz.title}</h2>
        <p className="text-gray-300 mb-6">Created by: {quiz.creatorName}</p>
        <h3 className="text-xl font-semibold mb-4">Questions:</h3>
        <div className="space-y-6">
          {quiz.questions.map((q, index) => (
            <div key={q._id} className="p-4 bg-gray-700 rounded-lg shadow-md">
              <p className="text-lg font-medium mb-3">{index + 1}. {q.questionText}</p>
              <div className="grid grid-cols-2 gap-4">
                {q.options.map((option, optIndex) => (
                  <button
                    key={optIndex}
                    className={`px-4 py-2 rounded-md border border-gray-400 hover:bg-blue-500 transition-all ${
                      answers[q._id] === option ? "bg-blue-600" : "bg-gray-600"
                    }`}
                    onClick={() => handleOptionSelect(q._id, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md w-full"
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>
        {score !== null && (
          <p className="mt-4 text-xl font-bold text-center">Your Score: {score}%</p>
        )}
      </div>
    </div>
  );
};

export default SingleQuiz;