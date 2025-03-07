import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import Navbar from "./Navbar";
import Footer from "./Footer";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", ""], correctAnswer: "" },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:4000/checkAuth", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Please Log In to Create a Quiz.");
        }
      } catch (err) {
        if (!toast.isActive("auth-error")) {
          toast.error("Please Log In to Create a Quiz.", { toastId: "auth-error" });
        }
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    if (newQuestions[qIndex].options.length < 4) {
      newQuestions[qIndex].options.push("");
      setQuestions(newQuestions);
    }
  };

  const removeOption = (qIndex, optIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(optIndex, 1);
    setQuestions(newQuestions);
  };


  const addQuestion = () => {
    setQuestions([...questions, { questionText: "", options: ["", ""], correctAnswer: "" }]);
  };


  const removeQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/quizzes", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, questions }),
      });

      const data = await response.json();

      if (response.status === 401) {
        if (!toast.isActive("auth-error")) {
          toast.error("Please log in to create a quiz.", { toastId: "auth-error" });
        }
        return;
      }

      if (response.ok) {
        toast.success("Quiz created successfully!");
        setTitle("");
        setQuestions([{ questionText: "", options: ["", ""], correctAnswer: "" }]);
      } else {
        toast.error(data.message || "Failed to create quiz.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Create a Quiz</h2>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz Title"
            className="w-full p-2 border rounded mb-4"
          />

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-4 p-4 border rounded-lg bg-gray-100">
              <input
                type="text"
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "questionText", e.target.value)
                }
                placeholder={`Question ${qIndex + 1}`}
                className="w-full p-2 border rounded mb-2"
              />

              {q.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    placeholder={`Option ${optIndex + 1}`}
                    className="w-full p-2 border rounded"
                  />
                  {q.options.length > 2 && (
                    <button
                      onClick={() => removeOption(qIndex, optIndex)}
                      className="ml-2 text-red-500"
                    >
                      ✖
                    </button>
                  )}
                </div>
              ))}

              {q.options.length < 4 && (
                <button
                  onClick={() => addOption(qIndex)}
                  className="text-blue-500 text-sm"
                >
                  + Add Option
                </button>
              )}

              <input
                type="text"
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "correctAnswer", e.target.value)
                }
                placeholder="Correct Answer"
                className="w-full p-2 border rounded mt-2"
              />

              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 text-sm mt-2"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="w-full bg-blue-500 text-white p-2 rounded mt-4"
          >
            + Add Question
          </button>
          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white p-2 rounded mt-4"
          >
            Submit Quiz
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateQuiz;