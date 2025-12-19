# Energy Monitor - CS385

A React-based energy monitoring application that helps users track and manage household device power consumption in real-time.

## Features

- **Dashboard Home** - View total power consumption and all connected devices
- **Device Management** - Add, delete, filter, and sort devices
- **Status Control** - Monitor device status, toggle power on/off, search and filter by date
- **Firebase Authentication** - Secure login system
- **Real-time Data** - Firestore database for live device data

## Tech Stack

- **Frontend**: React 19, React Router DOM 7
- **Backend**: Firebase (Authentication + Firestore)
- **Build Tool**: Vite 5
- **Testing**: React Testing Library, Jest

## Project Structure

```
energy-monitoring-app/
├── public/                 # Static assets
├── src/
│   ├── pages/
│   │   ├── Home/          # Dashboard with total power & device list
│   │   ├── Devices/       # Add/delete devices, filter & sort
│   │   ├── Status/        # Device status control & power toggle
│   │   └── Login/         # User authentication
│   ├── App.jsx            # Main app with routing & auth state
│   ├── fbconfig.js        # Firebase configuration
│   └── index.jsx          # Entry point
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js v20.x or higher
- npm v10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/bugisthegod/Energy-Monitor-CS385.git
cd Energy-Monitor-CS385

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:5173`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |


## Test Account

For testing purposes, use the following credentials:

| Email | Password |
|-------|----------|
| jieping.zhou@mumail.ie | 123456 |

## Device Types Supported

- 🌡️ Air Conditioner
- 🧊 Refrigerator
- 📺 TV
- 🧺 Washing Machine
- 💡 Lighting
- 🔥 Heater
- 🍴 Microwave
- 💻 Computer
- 🍽️ Dishwasher

## Pages Overview

### Home (`/`)
- Displays total power consumption in watts
- Lists all devices sorted by power usage
- Shows device name, type, status, and current power

### Devices (`/devices`)
- Add new devices with name and type selection
- Delete existing devices
- Filter devices by type
- Sort by name (A-Z, Z-A) or power (Low-High, High-Low)

### Status (`/status`)
- Search devices by name
- Filter by date and power status (on/off)
- Toggle device power on/off
- View detailed device information

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Repository

https://github.com/bugisthegod/Energy-Monitor-CS385
