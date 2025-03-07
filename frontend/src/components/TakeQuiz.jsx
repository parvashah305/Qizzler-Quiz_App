import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("http://localhost:4000/getallquizzes", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (response.ok) {
          setQuizzes(data.quizzes);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Failed to fetch quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div>
        <Navbar/>
        <div className="min-h-screen bg-gray-800 p-6 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Available Quizzes</h2>
          {loading ? (
            <p className="text-white">Loading quizzes...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : quizzes.length === 0 ? (
            <p className="text-gray-500">No quizzes available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-white p-4 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold">{quiz.title}</h3>
                  <p className="text-gray-600">Created by: {quiz.creatorName}</p>
                  <p className="text-gray-600">Questions: {quiz.questionsCount}</p>
                  <Link to={`/quiz/${quiz._id}`}>
                      <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => alert(`Starting Quiz: ${quiz.title}`)}
                      >
                        Start Quiz
                      </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer/>
    </div>
  );
};

export default TakeQuiz;