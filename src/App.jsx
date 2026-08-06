import React from "react";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
function App() {
  return (
    <>
      <Navbar />
      <div className="app">
        <Sidebar />
        <div className="main-Contaient">
          <Dashboard />
        </div>
      </div>
    </>
  );
}

export default App;
