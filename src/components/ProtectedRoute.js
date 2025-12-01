import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // Enforce email verification
  if (!user.emailVerified) {
    return <Navigate to="/login" state={{ message: "Verify email first" }} />;
  }

  return children;
}
