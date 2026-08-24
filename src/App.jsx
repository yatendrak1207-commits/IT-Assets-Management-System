import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
import UserComplaints from "./pages/UserComplaints/UserComplaints";
import UserRepairs from "./pages/UserRepair/UserRepair";
import UserNotifications from "./pages/UserNotification/UserNotification";
import UserProfile from "./pages/UserProfile/UserProfile";
import Login from "./pages/LOGIN/Login";
import UserSettings from "./pages/UserSetting/UserSetting";

function ProtectedRoute({ children }) {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin */}

        <Route
          element={
            <ProtectedRoute>
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
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* User */}

        <Route
          element={
            <ProtectedRoute>
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
      </Routes>
    </div>
  );
}

export default App;
