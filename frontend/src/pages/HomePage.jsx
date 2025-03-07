import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";


const App = () => {
  return (
    <div className="bg-gray-950 min-h-screen">
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <HowItWorks />
   
      <Footer />
    </div>
  );
};

export default App;