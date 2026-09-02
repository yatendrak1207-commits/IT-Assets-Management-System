import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRole, children }) {
  const loggedInUser = sessionStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(loggedInUser);

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
