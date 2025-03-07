import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="text-center py-20 bg-gray-800 text-white ">
      <h2 className="text-5xl font-extrabold text-blue-400 mt-6">Challenge Your Knowledge!</h2>
      <p className="mt-4 text-lg text-gray-300">
        Engage in fun quizzes, test your skills, and compete with friends!
      </p>
      <div className="mt-6 space-x-4">
        <Link to="/create">
            <button className="px-6 py-3 bg-blue-600 rounded-md text-white hover:bg-blue-500">
              Create a Quiz
            </button>
        </Link>
        <Link to='/take'>
            <button className="px-6 py-3 bg-green-600 rounded-md text-white hover:bg-green-500">
              Take a Quiz
            </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;