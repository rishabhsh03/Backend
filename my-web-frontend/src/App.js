import { useState } from "react";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import "./App.css";

function App() {
  const [isLogin, setIsLogin,] = useState(true);

  return (
    <div className="container">
      <div className="card">
        <h1>{isLogin ? "Sign In" : "Sign Up"  }</h1>

        {isLogin ? <SignIn /> : <SignUp /> }

        <p>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            className="toggle-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;