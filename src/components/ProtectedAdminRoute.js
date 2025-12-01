import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedAdminRoute({ children }) {
  const { userData } = useAuth(); 

  if (!userData) {
    return <Navigate to="/login" />;
  }

  if (userData.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
