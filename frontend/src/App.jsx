// import './App.css'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {

  return (
    <>
     
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App
