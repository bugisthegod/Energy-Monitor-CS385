import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home.jsx";
import Devices from "./pages/Devices/devices.jsx";
import Status from "./pages/Status/Status.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/status" element={<Status />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
