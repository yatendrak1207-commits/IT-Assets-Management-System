import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Assets from "./pages/Assets/Assets";
import Layout from "./layouts/layout";
import Employees from "./pages/Employees/Employees";
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
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
