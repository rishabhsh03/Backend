import { useState } from "react";

function SignIn() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({  
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", loginData);

    alert("Login Successful!");
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

      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        value={loginData.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Sign In</button>
    </form>
  );
}

export default SignIn;