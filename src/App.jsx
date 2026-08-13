import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Assets from "./pages/Assets/Assets";
import Layout from "./layouts/layout";
import Employees from "./pages/Employees/Employees";
import Suppiler from "./pages/Suppiler/Suppiler";
import Repair from "./pages/Repair/Repair";
import Report from "./pages/Report/Report";
import Settings from "./pages/Settings/settings";

function App() {
  return (
    <>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/suppiler" element={<Suppiler />} />
            <Route path="/repair" element={<Repair />} />
            <Route path="/report" element={<Report />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
