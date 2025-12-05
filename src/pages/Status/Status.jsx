import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Status.css";

// 转换 timestamp
function formatTimestamp(ts) {
  const d = new Date(ts);
  const pad = (n) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${String(
    d.getFullYear()
  ).slice(2)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
    d.getSeconds()
  )}`;
}

/* ---------------------------- 父组件 ---------------------------- */
function Status() {
  const [devices, setDevices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2025-01-01");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // 新增：选中设备 → 打开详情
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:3001/devices?date=${selectedDate}`
        );
        const data = await res.json();
        setDevices(data);
      } catch (error) {
        console.log("Server offline -> using fallback.");

        const fallback = {
          "2025-01-01": [
            {
              deviceId: "dev001",
              name: "Air Conditioner",
              type: "air_conditioner",
              powerStatus: "on",
              currentPower: 2450,
              lastUpdated: "2025-01-01T08:32:15Z",
            },
            {
              deviceId: "dev002",
              name: "Refrigerator",
              type: "refrigerator",
              powerStatus: "on",
              currentPower: 1450,
              lastUpdated: "2025-01-01T10:20:00Z",
            },
            {
              deviceId: "dev003",
              name: "Desktop",
              type: "desktop",
              powerStatus: "off",
              currentPower: 450,
              lastUpdated: "2025-01-01T18:54:11Z",
            },
          ],
          "2025-01-02": [
            {
              deviceId: "dev001",
              name: "Air Conditioner",
              type: "air_conditioner",
              powerStatus: "off",
              currentPower: 2450,
              lastUpdated: "2025-01-02T09:12:08Z",
            },
            {
              deviceId: "dev002",
              name: "Refrigerator",
              type: "refrigerator",
              powerStatus: "on",
              currentPower: 1450,
              lastUpdated: "2025-01-02T11:45:55Z",
            },
            {
              deviceId: "dev003",
              name: "Desktop",
              type: "desktop",
              powerStatus: "on",
              currentPower: 450,
              lastUpdated: "2025-01-02T14:18:20Z",
            },
          ],
        };

        setDevices(fallback[selectedDate] || []);
      }
      setLoading(false);
    }

    load();
  }, [selectedDate]);

  const filtered = devices
    .filter((device) => {
      const statusMatch =
        statusFilter === "all" ? true : device.powerStatus === statusFilter;
      const searchMatch = device.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return statusMatch && searchMatch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const dates = ["2025-01-01", "2025-01-02"];

  return (
    <div className="home-page">
      {/* 导航栏 */}
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

      {/* 内容 */}
      <div style={{ padding: "20px" }}>
        <h2
          style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px" }}
        >
          Device Status
        </h2>

        {/* 搜索框 */}
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

        {/* 状态筛选 */}
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

        {/* 日期选择 */}
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

        {/* 加载中 */}
        {loading && <p>Loading...</p>}

        {/* 设备列表 */}
        {!loading &&
          filtered.map((device) => (
            <DeviceCard
              key={device.deviceId}
              device={device}
              onClick={setSelectedDevice} // 子传父
            />
          ))}

        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
            No devices found.
          </p>
        )}
      </div>

      {/* -------------------- 设备详情面板 -------------------- */}
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

/* ----------------------- 子组件：DeviceCard ----------------------- */
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
