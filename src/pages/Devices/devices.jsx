import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate} from "react-router-dom";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp} from "firebase/firestore";
import { auth, db } from "../../fbconfig";
import { signOut } from "firebase/auth";
import "./devices.css";

// Power ranges for different device types
const DEVICE_POWER_RANGES = {
  air_conditioner: { min: 1000, max: 3000 },
  refrigerator: { min: 100, max: 400 },
  washing_machine: { min: 500, max: 2000 },
  tv: { min: 50, max: 300 },
  lighting: { min: 10, max: 100 },
  heater: { min: 1500, max: 2500 },
  microwave: { min: 800, max: 1500 },
  computer: { min: 200, max: 500 },
  dishwasher: { min: 1200, max: 2400 }
};

// Generate random power based on device type
function generateRandomPower(deviceType) {
  const range = DEVICE_POWER_RANGES[deviceType];
  if (!range) return 0;
  return Math.floor(Math.random() * (range.max - range.min + 1) + range.min);
}

function Devices() {
  // After you fetch data and store it in state:
  const [devices, setDevices] = useState([]);

  //to store user inputs for new device
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("");

  //to store total power and loading state
  const [totalPower, setTotalPower] = useState(0);
  const [loading, setLoading] = useState(true);

  //to filter and sort by device type
  const [filterType, setFilterType] = useState("");
  const [sortOption, setSortOption] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  // device types matching available icons
  const deviceTypes = [
    { value: "air_conditioner", label: "Air Conditioner", icon: "🌡️" },
    { value: "refrigerator", label: "Refrigerator", icon: "🧊" },
    { value: "tv", label: "TV", icon: "📺" },
    { value: "washing_machine", label: "Washing Machine", icon: "🧺" },
    { value: "lighting", label: "Lighting", icon: "💡" },
    { value: "heater", label: "Heater", icon: "🔥" },
    { value: "microwave", label: "Microwave", icon: "🍴" },
    { value: "computer", label: "Computer", icon: "💻" },
    { value: "dishwasher", label: "Dishwasher", icon: "🍽️" },
  ];
  
  // Fetch devices from Firebase
  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "devices"));
      const devicesData = [];

      querySnapshot.forEach((docSnap) => {
        devicesData.push({
          firestoreDocId: docSnap.id,
          ...docSnap.data()
        });
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
  
  


  //deletes device from Firebase and local state
  async function handleDeleteDevice(firestoreDocId) {
    try {
      await deleteDoc(doc(db, "devices", firestoreDocId));
      setDevices(devices.filter((device) => device.firestoreDocId !== firestoreDocId));
    } catch (error) {
      console.error("Error deleting device:", error);
      alert(`Failed to delete device: ${error.message}`);
    }
  }
  
  // add new device to Firebase and local state
  async function handleAddDevice() {
    if (!newDeviceName || !newDeviceType) {
      alert("Please enter both device name and type");
      return;
    }

    // Generate unique deviceId with 4 random digits
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const deviceId = `dev_${randomDigits}`;

    // Generate random power based on device type
    const randomPower = generateRandomPower(newDeviceType);

    const newDevice = {
      deviceId: deviceId,
      name: newDeviceName,
      type: newDeviceType,
      currentPower: randomPower,
      powerStatus: "on",
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "devices"), newDevice);
      // Add to local state with Firestore doc ID
      setDevices((prev) => [
        ...prev,
        { firestoreDocId: docRef.id, ...newDevice, createdAt: new Date(), lastUpdated: new Date() }
      ]);

      //clear input fields
      setNewDeviceName("");
      setNewDeviceType("");
    } catch (error) {
      console.error("Error adding device: ", error);
      alert(`Failed to add device: ${error.message}`);
    }
  }

 // Icon mapping
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

    function filterDevices(devicesArray) {
    if (!filterType) return devicesArray; // no filter, show all
    return devicesArray.filter(device =>
      device.type === filterType // returns devices matching filter
    );
  }

  function sortDevices(devicesArray) {
    if (!sortOption) return devicesArray; // no sort, return as is

    const sorted = [...devicesArray]; // make a copy to avoid mutating state

    //options to sort by name/power ascending/descending
    if (sortOption === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "power-asc") {
      sorted.sort((a, b) => (a.currentPower || 0) - (b.currentPower || 0));
    } else if (sortOption === "power-desc") {
      sorted.sort((a, b) => (b.currentPower || 0) - (a.currentPower || 0));
    }

    return sorted;
  }



  if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading devices...
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Navigation Bar */}
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
            className={`nav-tab${location.pathname === "/devices" ? " active" : ""}`}
          >
            Devices
          </Link>
          <Link
            to="/status"
            className={`nav-tab${location.pathname === "/status" ? " active" : ""}`}
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
        {/* Add Device Section */}
        <div style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: "30px"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "20px" }}>
            Add New Device
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>
              Device Name
            </label>
            <input
              type="text"
              placeholder="Enter device name"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#555" }}>
              Device Type
            </label>
            <select
              value={newDeviceType}
              onChange={(e) => setNewDeviceType(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "16px",
              }}
            >
              <option value="">Select a device type</option>
              {deviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddDevice}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              background: "#4caf50",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Add Device
          </button>
        </div>

        {/* Device List Section */}
        <div className="section-title">⚡ My Devices ({devices.length})</div>

        {/* Filter and Sort Controls */}
        <div style={{
          marginBottom: "20px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          <div>
            <label style={{ marginRight: "8px", fontWeight: "600", color: "#555" }}>
              Filter by type:
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="">All</option>
              {deviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ marginRight: "8px", fontWeight: "600", color: "#555" }}>
              Sort by:
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              <option value="">None</option>
              <option value="name-asc">Name A → Z</option>
              <option value="name-desc">Name Z → A</option>
              <option value="power-asc">Power Low → High</option>
              <option value="power-desc">Power High → Low</option>
            </select>
          </div>
        </div>

        {/* Device Cards */}
        {devices.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#7f8c8d" }}>
            No devices found. Add your first device above!
          </div>
        ) : (
          sortDevices(filterDevices(devices)).map((device) => (
            <div key={device.firestoreDocId} className="device-card">
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
                    color: device.powerStatus === "on" ? "#27ae60" : "#e74c3c",
                    fontWeight: "bold",
                    marginTop: "5px",
                  }}
                >
                  {device.powerStatus?.toUpperCase()}
                </div>
              </div>
              <div className="device-power">{device.currentPower || 0} W</div>
              <button
                onClick={() => handleDeleteDevice(device.firestoreDocId)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#e74c3c",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginLeft: "10px",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Devices;
