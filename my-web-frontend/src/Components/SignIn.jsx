import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
function SignIn() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login Successful!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Login Failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        value={loginData.email}
        onChange={handleChange}
        required
      />

      <div className="password-container">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Enter Password"
    value={loginData.password}
    onChange={handleChange}
    required
  />

  <button
    type="button"
    className="eye-btn"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>
    </form>
  );
}

export default SignIn;