import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRole, children }) {
  const token = sessionStorage.getItem("token");
  const loggedInUser = sessionStorage.getItem("loggedInUser");

  // Token ya user data nahi hai
  if (!token || !loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(loggedInUser);
  } catch (error) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("loggedInUser");

    return <Navigate to="/login" replace />;
  }

  // Role check
  if (user.role !== allowedRole) {
    if (user.role === "admin") {
      return <Navigate to="/" replace />;
    }

    if (user.role === "user") {
      return <Navigate to="/user" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
