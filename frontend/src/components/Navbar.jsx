import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import AuthModals from "../components/AuthModal";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:4000/checkAuth", {
          method: "GET",
          credentials: "include",
        });

        const result = await res.json();
        setIsLoggedIn(res.ok);
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);


  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });

      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Qizzler</h1>

          <ul className="hidden md:flex gap-6">
          <li><Link to='/' className="hover:text-gray-400 text-white">Home</Link></li>
              <li><Link to='/create' className="hover:text-gray-400 text-white">Create a Quiz</Link></li>
              <li><Link to='/take' className="hover:text-gray-400 text-white">Take a Quiz</Link></li>
          </ul>

          {isLoggedIn ? (
            <button
              className="hidden md:block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
              onClick={() => setIsLoginOpen(true)}
            >
              Get Started
            </button>
          )}

          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-gray-900 text-white p-4 md:hidden">
            <ul className="flex flex-col items-center gap-4">
              <li><Link to='/' className="hover:text-gray-400 text-white">Home</Link></li>
              <li><Link to='/create' className="hover:text-gray-400 text-white">Create a Quiz</Link></li>
              <li><Link to='/take' className="hover:text-gray-400 text-white">Take a Quiz</Link></li>
              <li>
                {isLoggedIn ? (
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500"
                    onClick={() => {
                      setIsLoginOpen(true);
                      setMenuOpen(false);
                    }}
                  >
                    Get Started
                  </button>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>

      <AuthModals
        isLoginOpen={isLoginOpen}
        isSignupOpen={isSignupOpen}
        onCloseLogin={() => setIsLoginOpen(false)}
        onCloseSignup={() => setIsSignupOpen(false)}
        openSignup={() => { setIsSignupOpen(true); setIsLoginOpen(false); }}
        openLogin={() => { setIsLoginOpen(true); setIsSignupOpen(false); }}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setIsLoginOpen(false);
        }}
      />
    </>
  );
};

export default Navbar;