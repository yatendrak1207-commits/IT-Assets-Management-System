import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRole }) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  if (loggedInUser.role !== allowedRole) {
    if (loggedInUser.role === "admin") {
      return <Navigate to="/" replace />;
    }

    if (loggedInUser.role === "user") {
      return <Navigate to="/user" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
