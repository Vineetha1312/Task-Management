import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../pages/Login/config"; 
import { signOut, onAuthStateChanged, User } from "firebase/auth"; 
import taskIcon from "../assets/images/task_icon.png";
import logoutIcon from "../assets/images/logout_icon.png";
import defaultUserImage from "../assets/images/userImage.png";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); 
      } else {
        setUser(null); 
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("userEmail"); 
        navigate("/login"); 
      })
      .catch((error) => console.error("Logout Error:", error));
  };

  return (
    <React.Fragment>
      {/* Desktop View */}
      <nav className="font-urbanist py-4 bg-white px-2 hidden sm:block">
        <div className="flex items-center justify-between">
          <a href="/" className="flex space-x-1 items-center">
            <img src={taskIcon} alt="Task Management" className="h-5 w-5" />
            <span className="text-heading font-bold text-secondary">TaskBuddy</span>
          </a>
          {user ? (
            <div className="relative">
              {/* User icon and name */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 p-2 rounded-2xl"
              >
                <img
                  src={user.photoURL || defaultUserImage} 
                  className="h-7 w-7 rounded-full"
                  alt="User Profile"
                />
                <span className="text-gray-700 text-xs">{user.displayName || user.email}</span>
              </button>

              {/* Dropdown menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-20 bg-background rounded-xl shadow-lg border border-gray-200">
                  <button
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 w-full text-gray-700"
                    onClick={handleLogout} 
                  >
                    <img src={logoutIcon} className="h-3 w-3" />
                    <span className="text-xs">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-primary"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Mobile View */}
      <nav className="font-urbanist flex items-center justify-between bg-background p-2 shadow-secondary-xl sm:hidden">
        <a href="/" className="text-secondary text-md">TaskBuddy</a>
        {user ? (
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 p-2 rounded-2xl">
            <img
              src={user.photoURL || defaultUserImage} 
              className="h-7 w-7 rounded-full"
              alt="User Profile"
            />
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-primary"
          >
            Login
          </button>
        )}

        {/* Dropdown menu */}
        {isOpen && user && (
          <div className="absolute right-0 top-10 mt-2 w-20 bg-background rounded-xl shadow-lg border border-gray-200">
            <button
              className="flex items-center space-x-2 p-2 hover:bg-gray-100 w-full text-gray-700"
              onClick={handleLogout} 
            >
              <img src={logoutIcon} className="h-3 w-3" />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        )}
      </nav>
    </React.Fragment>
  );
};

export default Header;

