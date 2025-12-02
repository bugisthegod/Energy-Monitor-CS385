import React, { useState, useEffect } from "react";

// transfer timestamp into dd/mm/yy HH:MM:SS
function formatTimestamp(ts) {
  const d = new Date(ts);

  // Zero-padding function
  const pad = (n) => n.toString().padStart(2, "0");

  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = pad(d.getFullYear() % 100); // Take the last two places of the year
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function Status() {
  const [devices, setDevices] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("2025-01-01");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

        // ========= fallback 数据：新增 timestamp =========
        const fallback = {
          "2025-01-01": [
            {
              name: "Air Conditioner",
              status: "on",
              icon: "❄️",
              timestamp: "2025-01-01T08:32:15",
            },
            {
              name: "Refrigerator",
              status: "on",
              icon: "🧊",
              timestamp: "2025-01-01T10:20:05",
            },
            {
              name: "Desktop",
              status: "off",
              icon: "💻",
              timestamp: "2025-01-01T18:54:11",
            },
          ],
          "2025-01-02": [
            {
              name: "Air Conditioner",
              status: "off",
              icon: "❄️",
              timestamp: "2025-01-02T09:12:08",
            },
            {
              name: "Refrigerator",
              status: "on",
              icon: "🧊",
              timestamp: "2025-01-02T11:45:55",
            },
            {
              name: "Desktop",
              status: "on",
              icon: "💻",
              timestamp: "2025-01-02T14:18:20",
            },
          ],
        };

        setDevices(fallback[selectedDate] || []);
      }
      setLoading(false);
    }

    load();
  }, [selectedDate]);

  // 搜索 + 状态过滤
  const filtered = devices.filter((device) => {
    const statusMatch =
      statusFilter === "all" ? true : device.status === statusFilter;

    const searchMatch = device.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return statusMatch && searchMatch;
  });

  const dates = ["2025-01-01", "2025-01-02"];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px" }}>
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
              backgroundColor: statusFilter === option ? "#4caf50" : "#e0e0e0",
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
        filtered.map((d, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              marginBottom: "15px",
              padding: "18px",
              borderRadius: "15px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* 图标 */}
            <div style={{ fontSize: "32px", marginRight: "15px" }}>
              {d.icon}
            </div>

            {/* 内容 */}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>
                {d.name}
              </h3>

              <div
                style={{ marginTop: "6px", fontSize: "14px", color: "#666" }}
              >
                {formatTimestamp(d.timestamp)}
                <span
                  style={{
                    marginLeft: "10px", // 多一点间距
                    color: d.status === "on" ? "#2ecc71" : "#e74c3c",
                    fontWeight: "900", // 更粗
                    fontSize: "20px", // 更大
                    //textTransform: "uppercase", // 转大写，更醒目
                  }}
                >
                  {d.status}
                </span>
              </div>
            </div>
          </div>
        ))}

      {/* 无结果 */}
      {!loading && filtered.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px", color: "#777" }}>
          No devices found.
        </p>
      )}
    </div>
  );
}

export default Status;
