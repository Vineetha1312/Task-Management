import React, { useEffect, useState } from "react";
import taskIcon from "../../assets/images/task.svg";
import googleIcon from "../../assets/images/googleIcon.svg";
import taskView from "../../assets/images/TaskView.png";
import { auth, provider } from "./config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom"; 

interface IProps {}

const LoginPage: React.FC<IProps> = () => {
  const [user, setUser] = useState<string | null>(localStorage.getItem("userEmail"));
  const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        navigate("/"); 
      }
    }, [user, navigate]);
  
    const handleLogin = () => {
      signInWithPopup(auth, provider)
        .then((data) => {
          if (data.user.email) {
            localStorage.setItem("userEmail", data.user.email); 
            setUser(data.user.email);
            navigate("/"); 
          }
        })
        .catch((error) => console.error("Login Error:", error));
    };
  

  return (
    <>
      {!user && (
        <div className="min-h-screen bg-bg_light flex flex-col md:flex-row items-center justify-center font-urbanist relative overflow-hidden">
          <div className="absolute inset-0 flex justify-center items-center z-0">
  <div className="rounded-full border-4 border-todo_purple w-96 h-96 opacity-30 md:block hidden relative">
    <div className="rounded-full border-4 border-todo_purple w-72 h-72 opacity-30 absolute top-0 left-0 md:hidden"></div>
    <div className="rounded-full border-4 border-table_heading w-64 h-64 opacity-30 absolute top-0 left-0 md:hidden"></div>
    <div className="rounded-full border-4 border-todo_purple w-56 h-56 opacity-30 absolute top-0 left-0 md:hidden"></div>
  </div>

  <div className="md:hidden rounded-full border-4 border-todo_purple w-80 h-80 opacity-30 absolute top-[-40px] left-[-40px]"></div>
  <div className="md:hidden rounded-full border-4 border-table_heading w-60 h-60 opacity-30 absolute top-0 left-0"></div>
  <div className="md:hidden rounded-full border-4 border-todo_purple w-40 h-40 opacity-30 absolute top-10 left-10"></div>

  <div className="md:hidden rounded-full border-4 border-todo_purple w-80 h-80 opacity-30 absolute bottom-[-40px] right-[-40px]"></div>
  <div className="md:hidden rounded-full border-4 border-table_heading w-60 h-60 opacity-20 absolute bottom-0 right-0"></div>
  <div className="md:hidden rounded-full border-4 border-todo_purple w-40 h-40 opacity-30 absolute bottom-10 right-10"></div>
  
</div>

<div className=" flex items-center gap-6">
          {/* Left Section: Left Aligned Content */}
          <div className="text-left z-10 mt-20 md:mt-0 md:w-1/2 pl-6 max-sm:justify-center">
            <div className="flex justify-start space-x-2  items-center ">
              <img src={taskIcon} alt="Logo" className="h-7 w-7" />
              <h1 className="text-3xl text-text_heading font-bold">TaskBuddy</h1>
            </div>
            <p className="text-text_secondary text-sm mt-4 mb-6 max-w-[500px] w-full max-sm:max-w-full ">
              Streamline your workflow and track progress effortlessly with our all-in-one task management app.
            </p>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="bg-text_secondary text-btn_primary_text w-fit py-3 px-12 text-lg font-bold rounded-lg flex items-center justify-center whitespace-nowrap space-x-2 mt-6 w-[360px] "
            >
              <img src={googleIcon} alt="Google Icon" className="h-6 w-6 mr-2 " />
              Continue with Google
            </button>
          </div>

          {/* Right Section (Image with Border Radius and Box Shadow) */}
          <div className="hidden md:block w-full md:w-1/2 flex justify-center items-center mt-6 md:mt-0 relative z-10 max-lg:hidden">
            <img
              src={taskView}
              alt="Task View"
              className="h-full w-full md:w-auto md:h-auto rounded-xl shadow-lg"
            />
          </div>
        </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
