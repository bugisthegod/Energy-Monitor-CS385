import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./devices.css";

import { useState } from "react";

let nextId = 3; //starting id for new devices

// import {deviceList} from "./deviceList.js"

// lec 2-3 const myDevices = [
//
// ];

// original full device list

//map through deviceList to create JSX elements
//  const deviceListJSX = deviceList.map((d, index) => (
  //           < p key = { index}/>
  //           <b>{d.name}</b> {d.location},  { d.kwH + "kwH"}
  //           <button >
  //         Delete
  //         </button>
  
  //         ));
  
  function setdevices() {
    const removeSecondLast = () => {
      if (items.length < 2) return; // nothing to remove
      const indexToRemove = items.length - 2;
      const updatedList = items.filter((_, index) => index !== indexToRemove);
      setItems(updatedList);
  };
}

function handleAddDevice() {
  const newDevice = {
    id: nextId++,
    name: newDeviceName,
    type: newDeviceType,
    location: "Unknown",
    kwH: 0,
  };

  //add new device to deviceList
  // setDeviceList([...deviceList, newDevice]);

  //clear input fields
  setNewDeviceName("");
  setNewDeviceType("");
}

function Devices() {
  const deviceList = [
    { id: 1, name: "Fridge", location: "Kitchen", type: "Fridge", kwH: 0 },
    { id: 2, name: "Lamp", location: "Living Room", type: "Lamp", kwH: 0 },
  ];
  
  //to store user inputs for new device
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceType, setNewDeviceType] = useState("");
  return (
    <div className="devices">
      <div class="navbar">
        <h1> ⚡Energy Monitor </h1>
        {/* <div class="nav-title">Energy Monitor2</div> */}
        <div class="nav-tabs">
          {/* <button>Home</button>
        <button>Devices</button>
        <button>Stats</button> */}
          <div class="nav-tab"> Home </div>
          <div class=" nav-tab active"> Devices </div>
          <div class="nav-tab"> Stats </div>
        </div>
      </div>

      <div class="add-device">
        <h2>Add New Device</h2>
        <h2>Device Name</h2>
        <input
          type="text"
          placeholder="Device Name"
          value={newDeviceName}
          onChange={(e) => setNewDeviceName(e.target.value)}
        />

        <h2>Device Type</h2>
        <input
          type="text"
          placeholder="Device Type"
          value={newDeviceType}
          onChange={(e) => setNewDeviceType(e.target.value)}
        />

        <button onClick={() => handleAddDevice}> Add Device </button>

        <h2> </h2>
        <h2> My Devices</h2>
        {/* <>{deviceListJSX}</>; */}
      </div>
    </div>
  );
}

export default Devices;
