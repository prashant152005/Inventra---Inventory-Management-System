import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterAdmin() {
  const [user, setUser] = useState({
    username: "",
    password: ""
  });

  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const register = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/auth/register-admin",
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Admin registered successfully");
      nav("/inventory"); // 🔁 BACK TO DASHBOARD

    } catch (err) {
      alert("Failed to register admin");
    }
  };

  return (
    <div className="form-box">
      <h2>Register New Admin</h2>

      <input
        placeholder="Username"
        onChange={e => setUser({ ...user, username: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setUser({ ...user, password: e.target.value })}
      />

      <button className="btn btn-primary" onClick={register}>
        Register Admin
      </button>
    </div>
  );
}
