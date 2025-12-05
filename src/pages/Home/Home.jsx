import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../../fbconfig";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import "./Home.css";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [totalPower, setTotalPower] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch devices from Firebase
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "devices"));
      const devicesData = [];

      querySnapshot.forEach((doc) => {
        devicesData.push({ id: doc.id, ...doc.data() });
      });

      setDevices(devicesData);

      // Calculate total power from all devices
      const total = devicesData.reduce(
        (sum, device) => sum + (device.currentPower || 0),
        0
      );
      setTotalPower(total);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching devices: ", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  // Icon mapping for device types
  const getDeviceIcon = (type) => {
    const icons = {
      air_conditioner: "🌡️",
      refrigerator: "🧊",
      tv: "📺",
      washing_machine: "🧺",
      lighting: "💡",
      heater: "🔥",
      microwave: "🍴",
      computer: "💻",
      dishwasher: "🍽️",
    };
    return icons[type] || "⚡";
  };

  const getIconBgColor = (type) => {
    const colors = {
      air_conditioner: "#ffe5e5",
      refrigerator: "#fff4e5",
      tv: "#e5f0ff",
      washing_machine: "#e5f5ff",
      lighting: "#fffde5",
      heater: "#ffe5e5",
      microwave: "#fff4e5",
      computer: "#e5f5ff",
      dishwasher: "#e5fff4",
    };
    return colors[type] || "#f0f0f0";
  };

  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading devices...
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="navbar">
        <div className="nav-title">⚡ Energy Monitor</div>
        <div className="nav-tabs">
          <Link
            to="/"
            className={`nav-tab${location.pathname === "/" ? " active" : ""}`}
          >
            Home
          </Link>
          <Link
            to="/devices"
            className={`nav-tab ${
              location.pathname === "/devices" ? "active" : ""
            }`}
          >
            Devices
          </Link>
          <Link
            to="/status"
            className={`nav-tab ${
              location.pathname === "/status" ? "active" : ""
            }`}
          >
            Status
          </Link>
          <button onClick={handleLogout} className="nav-tab logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="content">
        <div className="total-power">
          <div className="total-power-label">Total Power Consumption</div>
          <div className="total-power-value">{totalPower.toLocaleString()}</div>
          <div className="total-power-unit">Watts (W)</div>
        </div>

        <div className="section-title">⚡ All Devices ({devices.length})</div>

        {devices.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "20px", color: "#7f8c8d" }}
          >
            No devices found. Add some devices to Firebase first!
          </div>
        ) : (
          devices
            .sort((a, b) => b.currentPower - a.currentPower)
            .map((device) => (
              <div key={device.id} className="device-card">
                <div
                  className="device-icon"
                  style={{ background: getIconBgColor(device.type) }}
                >
                  {getDeviceIcon(device.type)}
                </div>
                <div className="device-info">
                  <div className="device-name">{device.name}</div>
                  <div className="device-type">
                    {device.type.replace(/_/g, " ")}
                  </div>
                  <div
                    className="device-status"
                    style={{
                      fontSize: "12px",
                      color:
                        device.powerStatus === "on" ? "#27ae60" : "#e74c3c",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    {device.powerStatus?.toUpperCase()}
                  </div>
                </div>
                <div className="device-power">{device.currentPower} W</div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Home;
