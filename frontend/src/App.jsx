// import './App.css'
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

import { useState, useCallback } from "react";
import GoalDetails from "./components/GoalDetails";

function App() {
  const [user, setUser] = useState(null);

  const handleUser = useCallback((x) => {
    setUser(x);
  }, []);

  console.log(user);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login handleUser={handleUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home authorId={user} />} />
        <Route path="/home/:goalId" element={<GoalDetails />}/>
      </Routes>
    </>
  );
}

export default App;
