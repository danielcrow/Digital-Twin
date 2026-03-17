# London Underground Digital Twin - Maximo Asset Management

A real-time 3D visualization of London Underground assets integrated with Maximo Asset Management system simulation, featuring live map view, photo-realistic station mapping, and interactive 3D visualization.

## Features

- **🗺️ Live Map View**: Interactive OpenStreetMap showing all assets across London Underground network
- **🎯 3D Interactive Visualization**: Explore London Underground assets in an immersive 3D environment
- **📸 Photo-Realistic Station Views**: View assets overlaid on actual London Underground station photos
- **Triple View Modes**: Switch between Map, 3D, and Station-specific photo views
- **Real-time Data Simulation**: Simulates live data streams from Maximo Asset Management
- **Asset Monitoring**: Track 50+ assets across multiple London Underground lines
- **Status Tracking**: Monitor operational, warning, and critical asset statuses
- **Geographic Positioning**: Assets mapped to real London coordinates
- **Location-Based Filtering**: View assets by specific station with photo context
- **Detailed Asset Information**: View comprehensive details including:
  - Asset number and type
  - Location (line and station)
  - Real-time sensor data (temperature, vibration, power consumption)
  - Maintenance schedules
  - Work orders and MTBF (Mean Time Between Failures)
  - Health scores

## Asset Types

The simulation includes various London Underground asset types:
- 🚇 Trains
- 🎢 Escalators
- 🛗 Lifts
- 🚦 Signals
- 🛤️ Tracks
- ⚡ Power Supply Units
- 💨 Ventilation Systems
- 📹 CCTV Cameras
- 🎫 Ticket Machines
- 🚪 Platform Doors

## London Underground Lines Covered

- Bakerloo
- Central
- Circle
- District
- Hammersmith & City
- Jubilee
- Metropolitan
- Northern
- Piccadilly
- Victoria
- Waterloo & City

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Usage

### View Modes

#### 🗺️ Map View Mode (NEW!)
- **Live Map**: Interactive OpenStreetMap of London
- **Station Markers**: Color-coded markers for each station (green=operational, orange=warning, red=critical)
- **Asset Clustering**: Assets grouped by station location
- **Click Markers**: Click station markers to see asset details in popup
- **Real-time Updates**: Markers update every 2 seconds with live data
- **Pan & Zoom**: Navigate the map to explore different areas
- **Legend**: Status legend in bottom-right corner

#### 🎯 3D View Mode
- **Overview**: See all assets across the London Underground network
- **Rotate View**: Click and drag with mouse
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag
- **Pause/Resume Rotation**: Click the pause button
- **Reset View**: Click the reset button

#### 📸 Station View Mode
- **Photo Overlay**: View assets overlaid on real station photographs
- **Station Selection**: Choose from 20 major London Underground stations
- **Location Context**: See assets in their actual physical locations
- **Toggle Photo**: Show/hide the background photo while keeping 3D assets visible
- **Filtered Assets**: Only displays assets located at the selected station

### Interacting with Assets
- **Select Asset**: Click on any 3D asset in the visualization
- **View Details**: Selected asset details appear in the right panel
- **Asset List**: Click on assets in the list to select them
- **Station Filtering**: In station view, only assets at that location are shown

### Real-time Updates
- Asset data updates every 2 seconds
- Status changes are reflected in real-time
- Sensor readings fluctuate to simulate live monitoring
- Photo overlays remain synchronized with asset positions

## Project Structure

```
london-underground-digital-twin/
├── index.html              # Main HTML structure
├── styles.css              # Styling and layout
├── main.js                 # 3D visualization and UI logic
├── maximoDataGenerator.js  # Maximo data simulation
├── stationPhotoMapper.js   # Station photo mapping and locations (NEW!)
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── README.md              # This file
```

## Photo Mapping System

The application includes a comprehensive photo mapping system that overlays 3D assets on real London Underground station photographs:

- **20 Major Stations**: Each with photo mapping support
- **Geographic Coordinates**: Actual latitude/longitude for each station
- **Asset Positioning**: Predefined positions for platform and concourse areas
- **Dynamic Filtering**: Shows only relevant assets per station
- **Dual Photo System**:
  - **Primary**: Local images from `public/images/` folder (your own photos)
  - **Fallback**: Unsplash placeholder images (works immediately)
- **Smart Loading**: Automatically falls back if local images aren't found
- **Error Handling**: Graceful degradation ensures app always works

### Adding Your Own Photos

1. Place station photos in `public/images/` folder
2. Use the naming convention: `kings-cross.jpg`, `oxford-circus.jpg`, etc.
3. See `public/images/README.md` for complete list
4. See `download-photos.md` for sourcing guide

**Photo Sources:**
- Wikimedia Commons (recommended - free, legal, high quality)
- Unsplash (free, no attribution required)
- Pexels (free, no attribution required)
- Your own photography (follow TfL guidelines)

The app works immediately with fallback images, but looks best with actual station photos!

## Technologies Used

- **Three.js**: 3D graphics and visualization
- **Leaflet**: Interactive map visualization with OpenStreetMap
- **Vite**: Fast development server and build tool
- **Vanilla JavaScript**: Core application logic
- **CSS3**: Modern styling with gradients and animations
- **OpenStreetMap**: Free, open-source map tiles

## Maximo Integration Simulation

This application simulates data that would typically come from IBM Maximo Asset Management:

- **Asset Registry**: Complete asset inventory with unique identifiers
- **Work Orders**: Maintenance work order tracking
- **Sensor Data**: Real-time IoT sensor readings
- **Maintenance Schedules**: Planned and completed maintenance
- **Asset Health Scores**: Calculated based on multiple factors
- **Status Monitoring**: Operational, warning, and critical states

## Future Enhancements

- Integration with actual Maximo REST API
- Historical data visualization and trends
- Predictive maintenance alerts
- Mobile responsive design
- Export reports functionality
- Multi-user collaboration features
- AR/VR support for immersive inspection

## License

MIT License

## Author

Created for London Underground asset management visualization