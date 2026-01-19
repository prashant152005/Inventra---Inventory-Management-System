import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {

  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "USER"
  });

  const nav = useNavigate();

  const reg = async (e) => {
    e.preventDefault();

    if (!user.username || !user.password) {
      alert("Username and password required");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/auth/register",
        user
      );

      alert("Registration successful");
      nav("/");

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data || "Registration failed"
      );
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={reg}>
        <h2>Create Account</h2>

        <input
          placeholder="Username"
          value={user.username}
          onChange={e =>
            setUser({ ...user, username: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={e =>
            setUser({ ...user, password: e.target.value })
          }
          required
        />

        <button type="submit">Register</button>

        <p className="link" onClick={() => nav("/")}>
          Back to Login
        </p>
      </form>
    </div>
  );
}
