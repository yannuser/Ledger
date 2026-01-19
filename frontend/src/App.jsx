import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

import GoalDetails from "./components/GoalDetails";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/:goalId" element={<GoalDetails />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
