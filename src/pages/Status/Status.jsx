import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Status.css";
import { db } from "../../fbconfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

// Convert timestamp to the DD/MM/YY HH:MM:SS string
function formatTimestamp(ts) {
  const d = ts instanceof Date ? ts : ts.toDate?.() ?? new Date(ts);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(
    d.getFullYear()
  ).slice(2)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds()
  )}`;
}

// Convert timestamp to the YYYY-MM-DD string
function formatDate(ts) {
  const d = ts instanceof Date ? ts : ts.toDate?.() ?? new Date(ts);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/* ---------------------------- Parent component ---------------------------- */
function Status() {
  const location = useLocation();
  const [devices, setDevices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]);

  const [selectedDevice, setSelectedDevice] = useState(null);

  // ------------------ Get the date list 获取日期列表 ------------------
  useEffect(() => {
    async function fetchDates() {
      setLoading(true);
      try {
        const devicesRef = collection(db, "devices");
        const snapshot = await getDocs(devicesRef);

        const data = snapshot.docs.map((doc) => doc.data());

        const dateSet = new Set(
          data.map((device) => formatDate(device.lastUpdated))
        );
        const sortedDates = Array.from(dateSet).sort();
        setDates(sortedDates);

        if (sortedDates.length > 0) setSelectedDate(sortedDates[0]);
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
      setLoading(false);
    }

    fetchDates();
  }, []);

  // ------------------Dropdown the device according to the selected date 根据选中日期拉取设备 ------------------
  useEffect(() => {
    if (!selectedDate) return;
    async function fetchDevicesByDate() {
      setLoading(true);
      try {
        const devicesRef = collection(db, "devices");
        // Firestore Query: Only obtain devices on the selected date; Firestore 查询：只获取选中日期的设备
        const snapshot = await getDocs(devicesRef);
        const data = snapshot.docs
          .map((doc) => ({ deviceId: doc.id, ...doc.data() }))
          .filter((device) => formatDate(device.lastUpdated) === selectedDate);
        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setDevices([]);
      }
      setLoading(false);
    }

    fetchDevicesByDate();
  }, [selectedDate]);

  // ------------------Status & Search Filters 状态 & 搜索过滤 ------------------
  const filtered = devices
    .filter((device) =>
      statusFilter === "all" ? true : device.powerStatus === statusFilter
    )
    .filter((device) =>
      device.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="home-page">
      {/* Navigation Bar 导航栏 */}
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
        </div>
      </div>

      {/* Content 内容 */}
      <div style={{ padding: "20px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px" }}
        >
          Device Status
        </h2>

        {/* Search Box 搜索框 */}
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

        {/* Status filter rule  状态筛选 */}
        <div style={{ marginBottom: "15px" }}>
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

        {/* Date selection 日期选择 */}
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
          {dates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>

        {/* Loading 加载中 */}
        {loading && <p>Loading...</p>}

        {/* Device List 设备列表 */}
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

      {/* Equipment/Device Details Panel设备详情面板 */}
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

/* ----------------------- 子组件 Child Component ：DeviceCard ----------------------- */
function DeviceCard({ device, onClick }) {
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
    </div>
  );
}

export default Status;
