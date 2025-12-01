import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes countdown

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setError("⏳ OTP expired. Request a new one.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();

    const storedOtp = localStorage.getItem("verification_code");

    if (!storedOtp || storedOtp !== otp) {
      setError("❌ Invalid or expired OTP");
      return;
    }

    // Success — unlocked
    localStorage.removeItem("verification_code");
    navigate("/login");
  };

  const handleResend = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    localStorage.setItem("verification_code", newOtp);

    setTimer(120);
    setError("");

    alert(`New verification code: ${newOtp}`);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center px-8 py-16">
      <h1 className="text-3xl font-bold mb-6">Email Verification - OTP</h1>
      <p className="mb-4">Enter the 6-digit code sent to your inbox</p>

      <form
        onSubmit={handleVerify}
        className="w-full max-w-md bg-gray-900 p-8 rounded-xl border border-green-500 space-y-4"
      >
        {error && <p className="text-red-400 text-center">{error}</p>}

        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border border-green-500 bg-transparent rounded-lg text-green-300 text-center tracking-widest text-2xl"
          placeholder="------"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-lg transition"
        >
          Verify
        </button>

        <p className="text-center text-sm text-green-300">
          Time remaining: <span className="font-bold">{timer}s</span>
        </p>

        <button
          type="button"
          disabled={timer > 0}
          onClick={handleResend}
          className={`w-full py-2 rounded-lg font-bold border border-green-500 ${
            timer > 0
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-green-500 hover:text-black transition"
          }`}
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
}
