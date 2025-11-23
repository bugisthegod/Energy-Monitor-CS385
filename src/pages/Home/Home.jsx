import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Home.css";

function Home() {
  const location = useLocation();

  // Sample data - will be replaced with database calls later
  const totalPower = 2547;
  const topDevices = [
    {
      id: 1,
      name: "Air Conditioner",
      type: "Cooling",
      power: 1250,
      icon: "🌡️",
      iconBgColor: "#ffe5e5",
    },
    {
      id: 2,
      name: "Refrigerator",
      type: "Kitchen",
      power: 680,
      icon: "🧊",
      iconBgColor: "#fff4e5",
    },
    {
      id: 3,
      name: "Desktop Computer",
      type: "Office",
      power: 420,
      icon: "💻",
      iconBgColor: "#e5f5ff",
    },
  ];

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
            Stats
          </Link>
        </div>
      </div>

      <div className="content">
        <div className="total-power">
          <div className="total-power-label">Total Power Consumption</div>
          <div className="total-power-value">{totalPower.toLocaleString()}</div>
          <div className="total-power-unit">kWh this month</div>
        </div>

        <div className="section-title">🔝 Top 3 Devices</div>

        {topDevices.map((device) => (
          <div key={device.id} className="device-card">
            <div
              className="device-icon"
              style={{ background: device.iconBgColor }}
            >
              {device.icon}
            </div>
            <div className="device-info">
              <div className="device-name">{device.name}</div>
              <div className="device-type">{device.type}</div>
            </div>
            <div className="device-power">{device.power} kWh</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
