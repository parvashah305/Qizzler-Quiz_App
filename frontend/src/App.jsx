import React from "react";
import HomePage from './pages/HomePage'
import './App.css'
import { Route,BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CreateQuizPage from "./CreateQuizPage";
import TakeQuizpage from "./TakeQuizpage";
import SingleQuiz from "./components/SingleQuiz";

const App = () => {
  return (
    <div className="bg-gray-950 min-h-screen">
      <Router>
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
        <Routes>
          <Route path='/' element= {<HomePage/>} />
          <Route path='/create' element= {<CreateQuizPage/>} />
          <Route path='/take' element= {<TakeQuizpage/>} />
          <Route path="/quiz/:id" element={<SingleQuiz />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;