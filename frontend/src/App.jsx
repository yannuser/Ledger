import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/pages/Home/Home";

import GoalDetails from "./components/GoalDetails";
import { AuthProvider } from "./AuthContext";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<Home />} />
            <Route path="/home/:goalId" element={<GoalDetails />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
