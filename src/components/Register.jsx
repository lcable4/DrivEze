import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api-adapter/login&register";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const result = await registerUser(username, password, email);
    console.log(result, "RESULT LOG");
    if (result.token) {
      alert("Account created successfully!");
      navigate("/login");
    } else {
      alert("Error: " + result.message);
    }
  };
  return (
    <form onSubmit={handleSubmit} id="register-form">
      <div id="text-field">
        <label className="username"></label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Username"
          id="text-box"
        />
      </div>
      <div id="text-field">
        <label className="password"></label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          id="text-box"
        />
      </div>
      <div id="text-field">
        <label className="confirmPassword"></label>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm Password"
          id="text-box"
        />
      </div>
      <div id="text-field">
        <label className="email"></label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          id="text-box"
        />
      </div>
      <button type="submit" id="submitBtn">
        Create Account
      </button>
      <div>
        <Link to="/login" id="link">
          Already have an account? Login here!
        </Link>
      </div>
    </form>
  );
};

export default Register;
