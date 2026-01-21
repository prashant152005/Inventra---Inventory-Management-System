import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STAFF"
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // SEND OTP
  const sendOtp = async () => {
    if (!user.email) {
      alert("Enter email first");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/auth/send-otp",
        { email: user.email }  
      );

      alert("OTP sent (check backend console)");
      setOtpSent(true);

    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  // ================= REGISTER =================
  const register = async () => {
  if (user.password !== user.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (!otp) {
    alert("Enter OTP");
    return;
  }

  try {
    const payload = {
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      otp: otp  
    };

    await axios.post(
      "http://localhost:8080/api/auth/register",
      payload
    );

    alert("User registered successfully");
    nav("/inventory");

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Registration failed");
  }
};



  return (
    <div className="form-box">
      <h2>Register User</h2>

      <input
        placeholder="Full Name"
        onChange={e => setUser({ ...user, name: e.target.value })}
      />

      <input
        placeholder="Username"
        autoComplete="username"
        onChange={e => setUser({ ...user, username: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        autoComplete="email"
        onChange={e => setUser({ ...user, email: e.target.value })}
      />

      <select
        value={user.role}
        onChange={e => setUser({ ...user, role: e.target.value })}
      >
        <option value="STAFF">Staff</option>
        <option value="ADMIN">Admin</option>
      </select>

      <input
        type="password"
        placeholder="Password"
        autoComplete="new-password"
        onChange={e => setUser({ ...user, password: e.target.value })}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        autoComplete="new-password"
        onChange={e =>
          setUser({ ...user, confirmPassword: e.target.value })
        }
      />

      {!otpSent && (
        <button className="btn btn-secondary" onClick={sendOtp}>
          Send OTP
        </button>
      )}

      {otpSent && (
        <>
          <input
            placeholder="Enter OTP"
            onChange={e => setOtp(e.target.value)}
          />

          <button className="btn btn-primary" onClick={register}>
            Register
          </button>
        </>
      )}

      <button className="btn" onClick={() => nav("/inventory")}>
        Back to Dashboard
      </button>
    </div>
  );
}
