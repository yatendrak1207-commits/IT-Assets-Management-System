import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "day");

  const location = useLocation();

  /* Admin route par hi admin ka theme class lagao.
     User routes par abhi ke liye "day" (default) rahega,
     taaki admin ka theme user side par leak na ho.
     User ka apna independent theme baad me isi condition me add karenge. */
  const isAdminRoute = !location.pathname.startsWith("/user");
  const activeTheme = isAdminRoute ? theme : "day";

  return (
    <div className={`app-shell ${activeTheme}`}>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route
          element={
            <ProtectedRoute allowedRole="admin">
              <Layout />
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
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/user/assets" element={<MyAssets />} />
          <Route path="/user/complaints" element={<UserComplaints />} />
          <Route path="/user/repairs" element={<UserRepairs />} />
          <Route path="/user/notifications" element={<UserNotifications />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/user/settings" element={<UserSettings />} />
        </Route>

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
