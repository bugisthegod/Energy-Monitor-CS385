import React from "react";
import "./Devices.css";

// lec 2-3 const myDevices = [
//   { id: 1, name: "Fridge", location: "Kitchen", type: "Fridge", kwH },
// ];

export default function Devices() {
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
        <h2>Device Type</h2>

        <button> Add Device </button>
        <h2> </h2>
        <h2> My Devices </h2>
      </div>
    </div>
  );
}
