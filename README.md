# London Underground Digital Twin - Maximo Asset Management

A comprehensive digital twin visualization system for London Underground assets, simulating data from Maximo Asset Management with real-time monitoring, interactive maps, weather alerts, scenario simulation, GIS layers, and BIM visualization capabilities.

## 🌟 Features Overview

### 🎯 Core Visualization
- **3D Asset Visualization**: Interactive 3D representation of 50+ London Underground assets
- **Real-time Data Updates**: Live sensor data simulation (temperature, vibration, power consumption)
- **Asset Health Monitoring**: Color-coded health status indicators
- **Interactive Selection**: Click assets to view detailed information

### 🗺️ Multi-View Modes
1. **3D View**: Traditional 3D scene with rotating asset display
2. **Live Map View**: Interactive Leaflet map with OpenStreetMap tiles and GIS layers
3. **Station View**: Photo-realistic station backgrounds with asset overlays
4. **BIM View**: Building Information Modeling with 3D floor plans and systems

### 📍 Live Map Integration
- Real-time asset markers on London Underground map
- Station-based clustering and filtering
- Weather overlay visualization
- Alert badges on affected stations
- Interactive marker popups with asset details
- **NEW**: GIS layer overlays with infrastructure data

### 🌍 GIS Layer System
Five comprehensive layer categories with 20+ sub-layers:

#### 1. Infrastructure Layers 🏗️
- **Tunnels**: Underground tunnel network visualization
- **Platforms**: Platform locations and dimensions
- **Tracks**: Railway track layout
- **Stations**: Station buildings and structures
- **Ventilation Shafts**: Air circulation infrastructure

#### 2. Utilities Layers ⚡
- **Power Lines**: Electrical distribution network
- **Water Pipes**: Water supply infrastructure
- **Drainage**: Drainage and sewage systems
- **Communication Cables**: Data and communication lines

#### 3. Safety & Security Layers 🚨
- **Emergency Exits**: Emergency evacuation routes
- **Fire Suppression**: Fire safety equipment locations
- **CCTV Coverage**: Security camera coverage zones
- **Alarm Systems**: Fire and security alarm points

#### 4. Environmental Layers 🌊
- **Flood Zones**: Flood risk areas
- **Air Quality Sensors**: Environmental monitoring points
- **Noise Monitoring**: Noise level measurement locations
- **Temperature Zones**: Climate control zones

#### 5. Accessibility Layers ♿
- **Step-Free Routes**: Accessible pathways
- **Lifts**: Elevator locations
- **Ramps**: Wheelchair ramps
- **Accessible Toilets**: Accessible facilities

### 🏗️ BIM Visualization
Building Information Modeling for detailed station infrastructure:

#### Station BIM Data
- **King's Cross St. Pancras**: 5-floor model with complete systems
- **Oxford Circus**: 4-floor model with retail and platforms

#### Floor-by-Floor Modeling
- **Concourse Level**: Main passenger areas
- **Platform Levels**: Multiple platform configurations
- **Plant Rooms**: Mechanical and electrical systems
- **Retail Spaces**: Commercial areas
- **Office Spaces**: Administrative areas

#### Building Systems
- **HVAC Systems**: Heating, ventilation, and air conditioning
- **Electrical Systems**: Power distribution and lighting
- **Plumbing Systems**: Water supply and drainage
- **Fire Suppression**: Fire safety systems

#### BIM Features
- 3D floor plan visualization
- System-by-system breakdown
- Space type categorization
- Interactive floor selection
- Real-time system status
- Integration with asset data

### 🌦️ Alert System
Three categories of alerts with severity levels:
- **Weather Alerts**: Severe weather, rain, snow, heat waves, wind, fog
- **Emergency Alerts**: Fire, flood, power outage, security, medical, evacuation
- **Operational Alerts**: Signal failures, track faults, delays, overcrowding, maintenance

### 🎮 Scenario Simulator
Interactive simulation of real-world incidents:
- **Power Outage**: Simulates electrical failures with cascading effects
- **Flooding**: Water ingress affecting multiple systems
- **Fire Emergency**: Fire detection and suppression system activation
- **Signal Failure**: Railway signaling system malfunctions
- **Track Fault**: Track infrastructure issues
- **Overcrowding**: Passenger capacity management
- **Equipment Failure**: Random asset breakdowns
- **Severe Weather**: Weather-related operational impacts

Each scenario features:
- Three-phase effects (immediate → delayed → cascading)
- Multi-station impact simulation
- Configurable duration (1-60 minutes)
- Real-time asset status updates
- Automatic alert generation

### 📊 Asset Types
- 🚇 Trains
- 🔼 Escalators
- 🛗 Lifts
- 🚦 Signals
- 🛤️ Tracks
- ⚡ Power Supplies
- 💨 Ventilation Systems
- 📹 CCTV Cameras
- 🎫 Ticket Machines
- 🚪 Platform Doors

### 🚇 Tube Lines Coverage
All 11 London Underground lines:
- Bakerloo, Central, Circle, District, Hammersmith & City
- Jubilee, Metropolitan, Northern, Piccadilly, Victoria, Waterloo & City

### 📍 Station Coverage
20 major stations including:
- King's Cross St. Pancras, Oxford Circus, Waterloo, Liverpool Street
- Victoria, London Bridge, Paddington, Bank, Leicester Square
- And 11 more key interchange stations

## 🚀 Technology Stack

- **Three.js**: 3D graphics rendering and BIM visualization
- **Leaflet.js**: Interactive mapping with GIS layers
- **Vite**: Development server and build tool
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with gradients and animations

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:3000`

## 📖 Usage Guide

### View Modes
- Click **🎨 3D View** for traditional 3D visualization
- Click **🗺️ Map View** for live map with asset markers and GIS layers
- Click **📸 Station View** to see photo-realistic station backgrounds
- Click **🏗️ BIM View** for Building Information Modeling

### Using GIS Layers (Map View)
1. Switch to **Map View**
2. Click **🌍 GIS Layers** button to open the layer panel
3. Browse five layer categories:
   - Infrastructure, Utilities, Safety, Environmental, Accessibility
4. Toggle individual layers on/off using checkboxes
5. Layers are color-coded for easy identification
6. Zoom in to see detailed layer information

### Using BIM View
1. Click **🏗️ BIM View** to enter BIM mode
2. View 3D building model with floor plans
3. Use the floor selector to navigate between levels
4. See building systems breakdown (HVAC, electrical, plumbing, fire)
5. View space types and dimensions
6. Rotate and zoom to explore the 3D model

### Interacting with Assets
- Click on any asset in 3D or map view to see detailed information
- View real-time sensor data, health scores, and status
- Monitor temperature, vibration, and power consumption

### Using the Scenario Simulator
1. Open the **Scenario Simulator** panel
2. Select a scenario type (e.g., Power Outage, Flooding)
3. Choose affected stations
4. Set duration (1-60 minutes)
5. Click **Start Scenario** to begin simulation
6. Watch as assets are affected and alerts are generated
7. Use **Stop Scenario** to end simulation early

### Monitoring Alerts
- View active alerts in the **Active Alerts** section
- Alerts are color-coded by severity (Critical, High, Medium, Low)
- Map markers show alert count badges
- Alerts auto-expire after 60 minutes

### Map Features
- Zoom and pan to explore London Underground network
- Click station markers to see assets at that location
- Weather overlay shows current conditions
- Alert badges indicate active incidents
- Toggle GIS layers for infrastructure visualization

## 📁 Project Structure

```
london-underground-digital-twin/
├── index.html              # Main HTML structure
├── main.js                 # Core application logic
├── maximoDataGenerator.js  # Asset data simulation
├── stationPhotoMapper.js   # Station photo management
├── alertSystem.js          # Alert management system
├── scenarioSimulator.js    # Scenario simulation engine
├── gisLayers.js            # GIS layer management (NEW!)
├── bimVisualization.js     # BIM visualization engine (NEW!)
├── styles.css              # Application styling
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── public/
    └── images/             # Station photos
```

## 🔧 Simulated Maximo Data

The application generates realistic Maximo-style asset data including:
- Asset numbers (e.g., TRAIN-001, ESC-042)
- Work order history
- Maintenance schedules
- Failure predictions
- Real-time sensor readings
- Health scores and status indicators

## ✅ Key Features Summary

### Completed Features
- ✅ 3D asset visualization with Three.js
- ✅ Real-time data simulation from Maximo
- ✅ Interactive live map with Leaflet
- ✅ Photo-realistic station views
- ✅ Weather and emergency alert system
- ✅ Scenario simulation with cascading effects
- ✅ Multi-station impact modeling
- ✅ GIS layer system (20+ infrastructure layers)
- ✅ BIM visualization with floor plans
- ✅ Building systems modeling
- ✅ Interactive layer toggling
- ✅ Real-time asset health monitoring

### 🎯 Use Cases
1. **Asset Management**: Monitor 50+ assets across London Underground
2. **Emergency Response**: Simulate incidents and plan responses
3. **Infrastructure Planning**: Visualize GIS layers for planning
4. **Facility Management**: Use BIM for building system management
5. **Maintenance Planning**: Track asset health and predict failures
6. **Training**: Simulate scenarios for staff training
7. **Stakeholder Communication**: Visual representation for presentations

## 🔮 Future Enhancements

- [ ] Historical data playback
- [ ] Predictive maintenance algorithms
- [ ] Integration with real Maximo API
- [ ] Mobile responsive design
- [ ] Export reports and analytics
- [ ] User authentication and roles
- [ ] Custom alert rules
- [ ] Performance metrics dashboard
- [ ] Additional BIM stations
- [ ] Real-time GIS data integration
- [ ] AR/VR visualization modes

## 📄 License

MIT License - feel free to use and modify for your projects.

## 🙏 Credits

- Station photos from Unsplash (fallback)
- Map tiles from OpenStreetMap
- Icons from Unicode emoji set
- Three.js for 3D rendering
- Leaflet.js for mapping

---

**Built with ❤️ for London Underground asset management visualization**