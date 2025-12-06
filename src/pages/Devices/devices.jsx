import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate} from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../fbconfig";
import "./devices.css";

let nextId = 3; //starting id for new devices

// import {deviceList} from "./deviceList.js"

  // const deviceList = [
  //   { id: 1, name: "Fridge", location: "Kitchen", type: "Fridge", kwH: 0 },
  //   { id: 2, name: "Lamp", location: "Living Room", type: "Lamp", kwH: 0 },
  // ];

function Devices() {
  // After you fetch data and store it in state:
  const [devices, setDevices] = useState([]);

  //to store user inputs for new device
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("");

  //to store total power and loading state
  const [totalPower, setTotalPower] = useState(0);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();


  
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
  
  


  //filters out device to be deleted
function handleDeleteDevice(id) {
    const newList = devices.filter((device) => device.id !== id);
    setDevices(newList);
  }
  
  // add new device to deviceList
function handleAddDevice() {
  const newDevice = {
    id: nextId++,
    name: newDeviceName,
    type: newDeviceType,
    location: "Unknown",
    kwH: 0,
  };
 
  //add new device to current devices array
  setDevices((previousDevices) => [...previousDevices, newDevice]);

  //clear input fields
  setNewDeviceName("");
  setNewDeviceType("");
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

if (loading) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading devices...
      </div>
    );
  }

  
  return (
    <div className="devices">
      <div className="navbar">
        <h1> ⚡Energy Monitor </h1>
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
      </div>
    </div>

      

      <div className="add-device">
        <h2>Add New Device</h2>
        
        <h3>Device Name</h3>
        <input
          type="text"
          placeholder="Device Name"
          value={newDeviceName}
          onChange={(e) => setNewDeviceName(e.target.value)}
        />

        <h3>Device Type</h3>
        <input
          type="text"
          placeholder="Device Type"
          value={newDeviceType}
          onChange={(e) => setNewDeviceType(e.target.value)}
        />

        <button onClick={() => handleAddDevice()}> Add Device </button>

      
        <div style={{marginBottom: "20px"}}> </div>
        <h2> My Devices </h2>
        {devices.length === 0 && <p>No devices added yet.</p>}
        
       {devices.map((device) => (
        <div key={device.id} className="device-card"  >
          <div className="device-icon">{getDeviceIcon(device.type)}</div>
          <div className="device-info">
            <div className="device-name">{device.name}</div>
            <div className="device-type">{device.type}</div>
          </div>
          <div className="device-power">{device.kwH} kWh</div>
          <button onClick={() => handleDeleteDevice(device.id)}>Delete</button>
        </div>
        ))}
        
      </div>
    </div> 
  );
}

export default Devices;
