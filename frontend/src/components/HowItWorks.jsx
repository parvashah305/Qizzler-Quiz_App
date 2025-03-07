
import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-800 text-white text-center">
      <h2 className="text-3xl font-bold text-blue-400">How It Works?</h2>
      <div className="mt-8 flex flex-wrap justify-center gap-8">
        <div className="w-64 p-6 bg-gray-900 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">📝 Create</h3>
          <p className="text-gray-400">Create a quiz with your own questions.</p>
        </div>
        <div className="w-64 p-6 bg-gray-900 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">🎯 Take</h3>
          <p className="text-gray-400">Answer quizzes from other users.</p>
        </div>
        <div className="w-64 p-6 bg-gray-900 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">🏆 Score</h3>
          <p className="text-gray-400">Get instant results and feedback.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
