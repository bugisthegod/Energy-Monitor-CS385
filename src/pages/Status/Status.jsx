import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Status.css";
import { auth, db } from "../../fbconfig";
import { signOut } from "firebase/auth";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

// Convert timestamp to DD/MM/YY HH:MM:SS
function formatTimestamp(ts) {
  const d = ts instanceof Date ? ts : ts.toDate?.() ?? new Date(ts);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(
    d.getFullYear()
  ).slice(2)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds()
  )}`;
}

// Convert timestamp to YYYY-MM-DD
function formatDate(ts) {
  const d = ts instanceof Date ? ts : ts.toDate?.() ?? new Date(ts);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function Status() {
  const location = useLocation();
  const navigate = useNavigate();

  const [allDevices, setAllDevices] = useState([]);
  const [devices, setDevices] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  // ------------------ Load ALL devices on first load ------------------
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const ref = collection(db, "devices");
        const snapshot = await getDocs(ref);
        const data = snapshot.docs.map((doc) => ({
          firestoreDocId: doc.id,
          ...doc.data(),
        }));

        setAllDevices(data);

        // Prepare unique available dates
        const dateSet = new Set(data.map((d) => formatDate(d.lastUpdated)));
        setDates(Array.from(dateSet).sort());
      } catch (e) {
        console.error("Error loading devices:", e);
      }
      setLoading(false);
    }

    fetchAll();
  }, []);

  // ------------------ Apply date filtering ------------------
  useEffect(() => {
    if (selectedDate === "") {
      // No date selected → show ALL devices
      setDevices(allDevices);
    } else {
      // Filter by selected date
      const filtered = allDevices.filter(
        (d) => formatDate(d.lastUpdated) === selectedDate
      );
      setDevices(filtered);
    }
  }, [selectedDate, allDevices]);

  // ------------------ Status & Search Filtering ------------------
  const filtered = devices
    .filter((d) =>
      statusFilter === "all" ? true : d.powerStatus === statusFilter
    )
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  // ------------------ Count devices per status ------------------
  const countStatus = {
    all: devices.length,
    on: devices.filter((d) => d.powerStatus === "on").length,
    off: devices.filter((d) => d.powerStatus === "off").length,
  };

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <div className="navbar">
        <div className="nav-title">⚡ Energy Monitor</div>
        <div className="nav-tabs">
          <Link
            to="/"
            className={`nav-tab ${location.pathname === "/" ? "active" : ""}`}
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

      {/* Content */}
      <div className="content">
        <h2 className="section-title">Device Status</h2>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        />

        {/* Date Selection */}
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            marginBottom: "25px",
            fontSize: "16px",
          }}
        >
          <option value="">Please select a date</option>
          {dates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Status Counts */}
        <div
          style={{
            marginBottom: "15px",
            fontWeight: "600",
            color: "#555",
          }}
        >
          Device Count: All ({countStatus.all}) | On ({countStatus.on}) | Off (
          {countStatus.off})
        </div>

        {/* Filter Buttons */}
        <div style={{ marginBottom: "20px" }}>
          {["all", "on", "off"].map((option) => (
            <button
              key={option}
              onClick={() => setStatusFilter(option)}
              style={{
                marginRight: "10px",
                padding: "8px 16px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  statusFilter === option ? "#4caf50" : "#e0e0e0",
                color: statusFilter === option ? "#fff" : "#000",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && <p>Loading...</p>}

        {/* Device List */}
        {!loading &&
          filtered.map((device) => (
            <DeviceCard
              key={device.deviceId}
              device={device}
              onClick={setSelectedDevice}
            />
          ))}

        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
            No devices found.
          </p>
        )}
      </div>

      {/* Device Details Panel */}
      {selectedDevice && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "#fff",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
            borderTopLeftRadius: "18px",
            borderTopRightRadius: "18px",
            padding: "20px",
            animation: "slideUp 0.25s ease",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "20px" }}>{selectedDevice.name}</h3>
          <p style={{ marginTop: "10px", color: "#555" }}>
            <strong>Type:</strong> {selectedDevice.type}
          </p>
          <p style={{ color: "#555" }}>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color:
                  selectedDevice.powerStatus === "on" ? "#2ecc71" : "#e74c3c",
                fontWeight: "bold",
              }}
            >
              {selectedDevice.powerStatus}
            </span>
          </p>
          <p style={{ color: "#555" }}>
            <strong>Current Power:</strong> {selectedDevice.currentPower} W
          </p>
          <p style={{ color: "#555" }}>
            <strong>Last Updated:</strong>{" "}
            {formatTimestamp(selectedDevice.lastUpdated)}
          </p>

          <button
            onClick={() => setSelectedDevice(null)}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

/* ----------------------- Device Card Component ----------------------- */
function DeviceCard({ device, onClick }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const togglePowerStatus = async (e) => {
    e.stopPropagation();
    setIsUpdating(true);
    try {
      const deviceRef = doc(db, "devices", device.firestoreDocId);
      const newStatus = device.powerStatus === "on" ? "off" : "on";
      await updateDoc(deviceRef, {
        powerStatus: newStatus,
      });
      // Update local state
      device.powerStatus = newStatus;
    } catch (error) {
      console.error("Error updating power status:", error);
      alert(`Failed to update device: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      onClick={() => onClick(device)}
      style={{
        background: "#fff",
        marginBottom: "15px",
        padding: "18px",
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
          {device.name}
        </h3>
        <div style={{ marginTop: "6px", fontSize: "14px", color: "#666" }}>
          {formatTimestamp(device.lastUpdated)}
          <span
            style={{
              marginLeft: "10px",
              color: device.powerStatus === "on" ? "#2ecc71" : "#e74c3c",
              fontWeight: "900",
              fontSize: "20px",
            }}
          >
            {device.powerStatus}
          </span>
        </div>
      </div>
      <button
        onClick={togglePowerStatus}
        disabled={isUpdating}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: isUpdating ? "not-allowed" : "pointer",
          backgroundColor: device.powerStatus === "on" ? "#e74c3c" : "#2ecc71",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
          opacity: isUpdating ? 0.6 : 1,
        }}
      >
        {isUpdating ? "..." : device.powerStatus === "on" ? "Turn Off" : "Turn On"}
      </button>
    </div>
  );
}

export default Status;
