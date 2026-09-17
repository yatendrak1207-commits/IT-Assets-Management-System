import { Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";

import "./App.css";

import Layout from "./layouts/layout";
import UserLayout from "./layouts/userLayout/UserLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Assets from "./pages/Assets/Assets";
import Employees from "./pages/Employees/Employees";
import Suppiler from "./pages/Suppiler/Suppiler";
import Repair from "./pages/Repair/Repair";
import Report from "./pages/Report/Report";
import Settings from "./pages/Settings/settings";
import Profile from "./pages/Profile/Profile";

import UserDashboard from "./pages/UserDashboard/Userdashboard";
import MyAssets from "./pages/UserAsset/UserAssets";
import UserComplaints from "./pages/UserComplaints/Usercomplaints";
import UserRepairs from "./pages/UserRepair/UserRepair";
import UserNotifications from "./pages/UserNotification/UserNotification";
import UserProfile from "./pages/UserProfile/UserProfile";
import Login from "./pages/LOGIN/Login";
import UserSettings from "./pages/UserSetting/UserSetting";
import ProtectedRoute from "./pages/LOGIN/ProtectedRoutes";
import Signup from "./pages/LOGIN/Signup";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "day");

  /* User ka apna independent theme - admin ke theme se alag rehta hai. */
  const [userTheme, setUserTheme] = useState(
    localStorage.getItem("userTheme") || "day",
  );

  return (
    <>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route
          element={
            <ProtectedRoute allowedRole="admin">
              <Layout className={`app-shell ${theme}`} />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/suppiler" element={<Suppiler />} />
          <Route path="/repair" element={<Repair />} />
          <Route path="/report" element={<Report />} />
          <Route
            path="/settings"
            element={<Settings theme={theme} setTheme={setTheme} />}
          />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* User */}
        <Route
          element={
            <ProtectedRoute allowedRole="user">
              <UserLayout theme={userTheme} />
            </ProtectedRoute>
          }
        >
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/assets" element={<MyAssets />} />
          <Route path="/user/complaints" element={<UserComplaints />} />
          <Route path="/user/repairs" element={<UserRepairs />} />
          <Route path="/user/notifications" element={<UserNotifications />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route
            path="/user/settings"
            element={<UserSettings theme={userTheme} setTheme={setUserTheme} />}
          />
        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
