
import React, { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./fbconfig.js";
import { onAuthStateChanged } from "firebase/auth";
import "./App.css";
import Home from "./pages/Home/Home.jsx";
import Devices from "./pages/Devices/devices.jsx";
import Status from "./pages/Status/Status.jsx";
import Login from "./pages/Login/Login.jsx";


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route 
            path='/' 
            element={currentUser ? <Home /> : <Navigate to="/login" />} 
          />
          <Route 
            path='/home' 
            element={currentUser ? <Home /> : <Navigate to="/login" />} 
          />
          <Route 
            path='/devices' 
            element={currentUser ? <Devices /> : <Navigate to="/login" />} 
          />
              <Route 
            path='/status' 
            element={currentUser ? <Status /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
