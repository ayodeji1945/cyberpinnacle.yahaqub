// src/pages/auth/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { Link, useNavigate } from "react-router-dom";
import { createUserRecord } from "../../services/scoreService";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // refresh details
      await user.reload();

      // email verification check
      if (!user.emailVerified) {
        setError("⚠ Email not verified. Check your inbox.");
        return;
      }

      // check role & status
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().status === "restricted") {
        setError("🚫 Your account has been restricted by admin.");
        return;
      }

      // create record if new
      await createUserRecord(user.uid, user.email);

      // SUCCESS → redirect to home
      navigate("/", { replace: true });

    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("📩 Password reset email sent!");
    } catch (err) {
      console.error(err);
      setError("Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 flex flex-col items-center justify-center px-8 py-16">
      <h1 className="text-4xl font-bold mb-10">Welcome Back</h1>

      <form onSubmit={handleLogin} className="w-full max-w-md bg-gray-900 p-8 rounded-xl border border-green-500 space-y-4">

        {error && <p className="text-red-400 text-center">{error}</p>}
        {info && <p className="text-green-400 text-center">{info}</p>}

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-transparent border border-green-500 rounded-lg text-green-300"
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-transparent border border-green-500 rounded-lg text-green-300"
          required
        />

        <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-lg transition-transform transform hover:scale-105">
          Login
        </button>

        <p onClick={handlePasswordReset} className="text-sm text-center text-green-300 hover:text-green-100 cursor-pointer">
          Forgot password?
        </p>

        <p className="text-center text-green-300 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-400 underline hover:text-green-300">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
