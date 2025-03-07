
import React from "react";

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-400">Why Choose Qizzler?</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <div className="p-6 bg-gray-800 rounded-lg shadow-md w-64">
            <h3 className="text-xl font-semibold">🚀 Fun & Engaging</h3>
            <p className="text-gray-400">Interactive quizzes designed to keep you engaged.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-md w-64">
            <h3 className="text-xl font-semibold">💡 Knowledge Boost</h3>
            <p className="text-gray-400">Expand your knowledge while having fun.</p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-md w-64">
            <h3 className="text-xl font-semibold">📊 Track Progress</h3>
            <p className="text-gray-400">See how you improve over time.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;