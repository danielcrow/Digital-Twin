// GIS Layers Module - Geographic Information System layers for London Underground

export class GISLayerManager {
    constructor(map) {
        this.map = map;
        this.layers = new Map();
        this.activeLayerGroups = new Set();
    }

    // GIS Layer definitions
    static layerTypes = {
        INFRASTRUCTURE: {
            name: 'Infrastructure',
            icon: '🏗️',
            layers: [
                { id: 'tunnels', name: 'Tunnel Network', color: '#8B4513', visible: true },
                { id: 'tracks', name: 'Track Layout', color: '#696969', visible: true },
                { id: 'platforms', name: 'Platform Locations', color: '#4169E1', visible: true },
                { id: 'ventilation', name: 'Ventilation Shafts', color: '#87CEEB', visible: false },
                { id: 'power', name: 'Power Distribution', color: '#FFD700', visible: false }
            ]
        },
        UTILITIES: {
            name: 'Utilities',
            icon: '⚙️',
            layers: [
                { id: 'water', name: 'Water Mains', color: '#1E90FF', visible: false },
                { id: 'drainage', name: 'Drainage Systems', color: '#4682B4', visible: false },
                { id: 'electrical', name: 'Electrical Grid', color: '#FF4500', visible: false },
                { id: 'communications', name: 'Communications', color: '#9370DB', visible: false }
            ]
        },
        SAFETY: {
            name: 'Safety Systems',
            icon: '🛡️',
            layers: [
                { id: 'fire', name: 'Fire Suppression', color: '#DC143C', visible: false },
                { id: 'emergency_exits', name: 'Emergency Exits', color: '#32CD32', visible: true },
                { id: 'cctv_coverage', name: 'CCTV Coverage', color: '#FF69B4', visible: false },
                { id: 'evacuation_routes', name: 'Evacuation Routes', color: '#00FF00', visible: false }
            ]
        },
        ENVIRONMENTAL: {
            name: 'Environmental',
            icon: '🌍',
            layers: [
                { id: 'flood_risk', name: 'Flood Risk Zones', color: '#00CED1', visible: false },
                { id: 'air_quality', name: 'Air Quality Sensors', color: '#98FB98', visible: false },
                { id: 'noise_levels', name: 'Noise Monitoring', color: '#DDA0DD', visible: false },
                { id: 'temperature', name: 'Temperature Zones', color: '#FF6347', visible: false }
            ]
        },
        ACCESSIBILITY: {
            name: 'Accessibility',
            icon: '♿',
            layers: [
                { id: 'step_free', name: 'Step-Free Access', color: '#32CD32', visible: true },
                { id: 'lifts', name: 'Lift Locations', color: '#4169E1', visible: true },
                { id: 'tactile_paving', name: 'Tactile Paving', color: '#FFD700', visible: false },
                { id: 'assistance_points', name: 'Assistance Points', color: '#FF1493', visible: false }
            ]
        }
    };

    // Initialize GIS layers on map
    initializeLayers() {
        Object.entries(GISLayerManager.layerTypes).forEach(([groupKey, group]) => {
            group.layers.forEach(layer => {
                if (layer.visible) {
                    this.addLayer(groupKey, layer);
                }
            });
        });
    }

    // Add a GIS layer to the map
    addLayer(groupKey, layerConfig) {
        const layerId = `${groupKey}_${layerConfig.id}`;
        
        if (this.layers.has(layerId)) {
            return; // Layer already exists
        }

        // Create layer based on type
        const layerGroup = this.createLayerVisualization(layerConfig);
        
        if (layerGroup) {
            layerGroup.addTo(this.map);
            this.layers.set(layerId, {
                group: layerGroup,
                config: layerConfig,
                visible: true
            });
            this.activeLayerGroups.add(groupKey);
        }
    }

    // Create visualization for a layer
    createLayerVisualization(layerConfig) {
        const L = window.L;
        const layerGroup = L.layerGroup();

        // Generate sample data points for the layer
        const dataPoints = this.generateLayerData(layerConfig.id);

        dataPoints.forEach(point => {
            let marker;

            switch (layerConfig.id) {
                case 'tunnels':
                    // Draw tunnel lines
                    const tunnelLine = L.polyline(point.coordinates, {
                        color: layerConfig.color,
                        weight: 4,
                        opacity: 0.6,
                        dashArray: '10, 5'
                    });
                    tunnelLine.bindPopup(`<b>Tunnel Section</b><br>Depth: ${point.depth}m<br>Length: ${point.length}m`);
                    layerGroup.addLayer(tunnelLine);
                    break;

                case 'platforms':
                    // Platform rectangles
                    const platform = L.rectangle(point.bounds, {
                        color: layerConfig.color,
                        weight: 2,
                        fillOpacity: 0.3
                    });
                    platform.bindPopup(`<b>Platform ${point.number}</b><br>Length: ${point.length}m<br>Capacity: ${point.capacity}`);
                    layerGroup.addLayer(platform);
                    break;

                case 'emergency_exits':
                    // Emergency exit markers
                    marker = L.circleMarker(point.location, {
                        radius: 8,
                        fillColor: layerConfig.color,
                        color: '#fff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                    marker.bindPopup(`<b>Emergency Exit</b><br>Type: ${point.type}<br>Capacity: ${point.capacity} people/min`);
                    layerGroup.addLayer(marker);
                    break;

                case 'flood_risk':
                    // Flood risk zones
                    const floodZone = L.circle(point.location, {
                        radius: point.radius,
                        color: layerConfig.color,
                        fillColor: layerConfig.color,
                        fillOpacity: 0.2,
                        weight: 1
                    });
                    floodZone.bindPopup(`<b>Flood Risk Zone</b><br>Risk Level: ${point.riskLevel}<br>Elevation: ${point.elevation}m`);
                    layerGroup.addLayer(floodZone);
                    break;

                case 'step_free':
                    // Step-free access routes
                    const accessRoute = L.polyline(point.coordinates, {
                        color: layerConfig.color,
                        weight: 3,
                        opacity: 0.7
                    });
                    accessRoute.bindPopup(`<b>Step-Free Route</b><br>From: ${point.from}<br>To: ${point.to}`);
                    layerGroup.addLayer(accessRoute);
                    break;

                default:
                    // Generic point markers
                    marker = L.circleMarker(point.location, {
                        radius: 6,
                        fillColor: layerConfig.color,
                        color: '#fff',
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.7
                    });
                    marker.bindPopup(`<b>${layerConfig.name}</b><br>${point.description || 'Infrastructure point'}`);
                    layerGroup.addLayer(marker);
            }
        });

        return layerGroup;
    }

    // Generate sample data for layers
    generateLayerData(layerId) {
        const baseStations = [
            { name: "King's Cross", lat: 51.5308, lng: -0.1238 },
            { name: "Oxford Circus", lat: 51.5152, lng: -0.1419 },
            { name: "Victoria", lat: 51.4965, lng: -0.1447 },
            { name: "Waterloo", lat: 51.5031, lng: -0.1132 },
            { name: "Bank", lat: 51.5133, lng: -0.0886 }
        ];

        const data = [];

        switch (layerId) {
            case 'tunnels':
                // Generate tunnel connections between stations
                for (let i = 0; i < baseStations.length - 1; i++) {
                    data.push({
                        coordinates: [
                            [baseStations[i].lat, baseStations[i].lng],
                            [baseStations[i + 1].lat, baseStations[i + 1].lng]
                        ],
                        depth: Math.floor(Math.random() * 30) + 10,
                        length: Math.floor(Math.random() * 2000) + 500
                    });
                }
                break;

            case 'platforms':
                baseStations.forEach(station => {
                    const offset = 0.001;
                    data.push({
                        bounds: [
                            [station.lat - offset, station.lng - offset],
                            [station.lat + offset, station.lng + offset]
                        ],
                        number: Math.floor(Math.random() * 4) + 1,
                        length: Math.floor(Math.random() * 100) + 100,
                        capacity: Math.floor(Math.random() * 500) + 200
                    });
                });
                break;

            case 'emergency_exits':
                baseStations.forEach(station => {
                    // Multiple exits per station
                    for (let i = 0; i < 3; i++) {
                        data.push({
                            location: [
                                station.lat + (Math.random() - 0.5) * 0.002,
                                station.lng + (Math.random() - 0.5) * 0.002
                            ],
                            type: ['Stairwell', 'Emergency Door', 'Escalator'][i],
                            capacity: Math.floor(Math.random() * 100) + 50
                        });
                    }
                });
                break;

            case 'flood_risk':
                baseStations.forEach(station => {
                    data.push({
                        location: [station.lat, station.lng],
                        radius: Math.random() * 300 + 200,
                        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
                        elevation: Math.floor(Math.random() * 20) - 10
                    });
                });
                break;

            case 'step_free':
                for (let i = 0; i < baseStations.length - 1; i++) {
                    data.push({
                        coordinates: [
                            [baseStations[i].lat, baseStations[i].lng],
                            [baseStations[i + 1].lat, baseStations[i + 1].lng]
                        ],
                        from: baseStations[i].name,
                        to: baseStations[i + 1].name
                    });
                }
                break;

            default:
                // Generic points around stations
                baseStations.forEach(station => {
                    data.push({
                        location: [
                            station.lat + (Math.random() - 0.5) * 0.003,
                            station.lng + (Math.random() - 0.5) * 0.003
                        ],
                        description: `${layerId} point at ${station.name}`
                    });
                });
        }

        return data;
    }

    // Toggle layer visibility
    toggleLayer(groupKey, layerId) {
        const fullLayerId = `${groupKey}_${layerId}`;
        const layer = this.layers.get(fullLayerId);

        if (layer) {
            if (layer.visible) {
                this.map.removeLayer(layer.group);
                layer.visible = false;
            } else {
                layer.group.addTo(this.map);
                layer.visible = true;
            }
        } else {
            // Layer doesn't exist, create it
            const group = GISLayerManager.layerTypes[groupKey];
            const layerConfig = group.layers.find(l => l.id === layerId);
            if (layerConfig) {
                this.addLayer(groupKey, layerConfig);
            }
        }
    }

    // Remove all layers
    clearAllLayers() {
        this.layers.forEach(layer => {
            this.map.removeLayer(layer.group);
        });
        this.layers.clear();
        this.activeLayerGroups.clear();
    }

    // Get active layers
    getActiveLayers() {
        return Array.from(this.layers.entries())
            .filter(([_, layer]) => layer.visible)
            .map(([id, layer]) => ({ id, config: layer.config }));
    }
}

export default GISLayerManager;

// Made with Bob
