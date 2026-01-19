import './App.css'
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

import { useState, useCallback } from "react";
import GoalDetails from "./components/GoalDetails";
import { AuthProvider } from './AuthContext';

function App() {
  const [auth, setAuth] = useState({});

  const handleAuth = useCallback((x) => {
    setAuth(x);
  }, []);

  console.log(auth);

  return (
    <>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login handleAuth={handleAuth} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home authorId={auth} />} />
        <Route path="/home/:goalId" element={<GoalDetails />}/>
      </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
