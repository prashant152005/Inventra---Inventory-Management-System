import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email
      });
      alert("OTP sent to email");
    } catch {
      alert("Failed to send OTP");
    }
  };

  return (
    <div className="form-box">
      <h2>Forgot Password</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button className="btn btn-primary" onClick={sendOtp}>
        Send OTP
      </button>
    </div>
  );
}
