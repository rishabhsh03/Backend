import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import ForgotPassword from "./Components/ForgotPassword";
import Welcome from "./Components/Welcome";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <div className="card">
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/welcome" element={<Welcome />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;