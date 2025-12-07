import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate} from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
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
  const [filteredTypes, setFilteredTypes] = useState([]);

  //to store total power and loading state
  const [totalPower, setTotalPower] = useState(0);
  const [loading, setLoading] = useState(true);

  //to filter and sort by device type
  const [filterType, setFilterType] = useState("");
  const [sortOption, setSortOption] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // device types for dropdown filter
  const deviceTypes = [
    "air conditioner",
    "refrigerator",
    "tv",
    "washing machine",
    "lighting",
    "heater",
    "microwave",
    "computer",
    "dishwasher",
  ];
  
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
async function handleAddDevice() {
   if (!newDeviceName || !newDeviceType) return;
    const newDevice = {
      id: nextId++,
      name: newDeviceName,
      type: newDeviceType,
      location: "Unknown",
      kwH: 0,
  };
 
  try {
    // save to Firebase
    const docRef = await addDoc(collection(db, "devices"), newDevice);
    // add the new device to local state using the Firestore ID
    setDevices((prev) => [...prev, { id: docRef.id, ...newDevice }]);


  // //add new device to current devices array
  // setDevices((previousDevices) => [...previousDevices, newDevice]);

  //clear input fields
  setNewDeviceName("");
  setNewDeviceType("");
  setFilteredTypes([]);
   } 
   
    catch (error) 
    {
    console.error("Error adding device: ", error);
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

  // for dropdown: filter device types as user writes an input for device type
   function handleTypeInputChange(e) {
    const value = e.target.value;
    setNewDeviceType(value);

    if (value) {
      setFilteredTypes(
        deviceTypes.filter((type) =>
          type.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredTypes([]);
    }
  }

  
  function handleSelectType(type) {
    setNewDeviceType(type);
    setFilteredTypes([]);
    
  }

  function filterDevices(devicesArray) {
  if (!filterType) return devicesArray; // no filter, show all
  return devicesArray.filter(device =>
    device.type.toLowerCase() === filterType.toLowerCase() // returns devices matching filter
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
    sorted.sort((a, b) => a.kwH - b.kwH);
  } else if (sortOption === "power-desc") {
    sorted.sort((a, b) => b.kwH - a.kwH);
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
          onChange={handleTypeInputChange}
        />

        {filteredTypes.length > 0 && (
          <div className="type-dropdown">
            {filteredTypes.map((type) => (
              <div
                key={type}
                className="type-option"
                onClick={() => {
                  setNewDeviceType(type);
                  setFilteredTypes([]);
                }}
              >
                {type}
              </div>
            ))}
          </div>
        )}
        <button onClick={() => handleAddDevice()}> Add Device </button>

      
        <div style={{marginBottom: "20px"}}> </div>
        <h2> My Devices </h2>
        {devices.length === 0 && <p>No devices added yet.</p>}


        {/* dropdowns to filter/sort devices.. filters by device type */}
        <div style={{ marginBottom: "15px" }}>
        <label>Filter by type: </label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {/* loops through array and creates an option for each device type */}
          <option value="">All</option>
          {deviceTypes.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>

          {/* dropdown to sort devices by name or power */}
        <label style={{ marginLeft: "20px" }}>Sort by: </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">None</option>
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
          <option value="power-asc">Power Low → High</option>
          <option value="power-desc">Power High → Low</option>
        </select>
      </div>


        {/* Display filtered and sorted devices */}
       {sortDevices(filterDevices(devices)).map((device) => (
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
