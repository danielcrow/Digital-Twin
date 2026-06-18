import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MaximoDataGenerator } from './maximoDataGenerator.js';
import { getStationPhoto, getAllStationPhotos } from './stationPhotoMapper.js';
import { AlertSystem } from './alertSystem.js';
import { ScenarioSimulator } from './scenarioSimulator.js';
import { GISLayerManager } from './gisLayers.js';
import { BIMVisualization } from './bimVisualization.js';
import L from 'leaflet';

// Initialize Maximo Data Generator
const maximoData = new MaximoDataGenerator(50);

// Initialize Alert System
const alertSystem = new AlertSystem();

// Initialize Scenario Simulator
const scenarioSimulator = new ScenarioSimulator(maximoData, alertSystem);

// Initialize GIS Layer Manager
let gisLayerManager = null;

// Initialize BIM Visualization
let bimVisualization = null;

// Scene setup
let scene, camera, renderer, controls;
let assetMeshes = [];
let selectedAsset = null;
let isRotating = true;
let currentViewMode = '3D'; // '3D', 'map', 'station', or 'bim'
let currentStation = null;
let photoVisible = true;

// Map setup
let map = null;
let assetMarkers = [];
let weatherOverlay = null;

// Initialize Three.js scene
function initScene() {
    const canvas = document.getElementById('canvas3d');
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f4f8);
    scene.fog = new THREE.Fog(0xf0f4f8, 50, 100);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );
    camera.position.set(30, 25, 30);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x4a90e2, 0.5);
    pointLight.position.set(-20, 20, -20);
    scene.add(pointLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -10;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 50, 0x888888, 0xcccccc);
    gridHelper.position.y = -9.9;
    scene.add(gridHelper);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2;

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Create asset visualizations
    createAssetMeshes();
}

// Create 3D meshes for assets
function createAssetMeshes() {
    const assets = maximoData.getAssets();
    
    assets.forEach(asset => {
        const mesh = createAssetMesh(asset);
        assetMeshes.push({ mesh, asset });
        scene.add(mesh);
    });
}

// Create individual asset mesh
function createAssetMesh(asset) {
    let geometry;
    
    // Different geometries for different asset types
    switch (asset.type) {
        case 'Train':
            geometry = new THREE.BoxGeometry(2, 1, 4);
            break;
        case 'Escalator':
            geometry = new THREE.BoxGeometry(1.5, 0.5, 3);
            break;
        case 'Lift':
            geometry = new THREE.BoxGeometry(1.5, 2, 1.5);
            break;
        case 'Signal':
            geometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
            break;
        case 'Track':
            geometry = new THREE.BoxGeometry(0.5, 0.3, 5);
            break;
        case 'Power Supply':
            geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            break;
        case 'Ventilation':
            geometry = new THREE.CylinderGeometry(1, 1, 1.5, 16);
            break;
        case 'CCTV':
            geometry = new THREE.SphereGeometry(0.5, 16, 16);
            break;
        case 'Ticket Machine':
            geometry = new THREE.BoxGeometry(1, 2, 0.8);
            break;
        case 'Platform Door':
            geometry = new THREE.BoxGeometry(2, 2.5, 0.3);
            break;
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    const material = new THREE.MeshStandardMaterial({
        color: asset.status.color,
        roughness: 0.5,
        metalness: 0.5,
        emissive: asset.status.color,
        emissiveIntensity: 0.2
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(asset.position.x, asset.position.y, asset.position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { assetId: asset.id };

    // Add a subtle animation
    mesh.userData.originalY = asset.position.y;
    mesh.userData.animationOffset = Math.random() * Math.PI * 2;

    return mesh;
}

// Update asset mesh colors based on status
function updateAssetMeshes() {
    assetMeshes.forEach(({ mesh, asset }) => {
        mesh.material.color.setHex(asset.status.color);
        mesh.material.emissive.setHex(asset.status.color);
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate scene if enabled
    if (isRotating) {
        scene.rotation.y += 0.002;
    }

    // Animate assets (floating effect)
    const time = Date.now() * 0.001;
    assetMeshes.forEach(({ mesh }) => {
        mesh.position.y = mesh.userData.originalY + Math.sin(time + mesh.userData.animationOffset) * 0.3;
    });

    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    const canvas = document.getElementById('canvas3d');
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

// Raycaster for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    const canvas = document.getElementById('canvas3d');
    const rect = canvas.getBoundingClientRect();
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(assetMeshes.map(am => am.mesh));

    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const assetId = clickedMesh.userData.assetId;
        selectAsset(assetId);
    }
}

// Select an asset
function selectAsset(assetId) {
    selectedAsset = maximoData.getAssetById(assetId);
    updateAssetDetails();
    highlightSelectedAsset();
}

// Highlight selected asset
function highlightSelectedAsset() {
    assetMeshes.forEach(({ mesh, asset }) => {
        if (asset.id === selectedAsset?.id) {
            mesh.scale.set(1.3, 1.3, 1.3);
            mesh.material.emissiveIntensity = 0.5;
        } else {
            mesh.scale.set(1, 1, 1);
            mesh.material.emissiveIntensity = 0.2;
        }
    });
}

// Update UI with asset details
function updateAssetDetails() {
    const assetInfo = document.getElementById('assetInfo');
    
    if (!selectedAsset) {
        assetInfo.innerHTML = '<p class="no-selection">Click on an asset to view details</p>';
        return;
    }

    const healthScore = maximoData.getAssetHealthScore(selectedAsset.id);
    const statusClass = selectedAsset.status.status.toLowerCase();

    assetInfo.innerHTML = `
        <div class="asset-detail-item">
            <span class="detail-label">Asset Number:</span>
            <span class="detail-value">${selectedAsset.assetNum}</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${selectedAsset.icon} ${selectedAsset.type}</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Line:</span>
            <span class="detail-value">${selectedAsset.line}</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Station:</span>
            <span class="detail-value">${selectedAsset.station}</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Status:</span>
            <span class="detail-value">
                <span class="status-badge status-${statusClass}">${selectedAsset.status.status}</span>
            </span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Health Score:</span>
            <span class="detail-value">${healthScore}%</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Temperature:</span>
            <span class="detail-value">${selectedAsset.temperature}°C</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Vibration:</span>
            <span class="detail-value">${selectedAsset.vibration} mm/s</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Power:</span>
            <span class="detail-value">${selectedAsset.powerConsumption} kW</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Utilization:</span>
            <span class="detail-value">${selectedAsset.utilizationRate}%</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Install Date:</span>
            <span class="detail-value">${selectedAsset.installDate}</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Last Maintenance:</span>
            <span class="detail-value">${selectedAsset.lastMaintenance}</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Next Maintenance:</span>
            <span class="detail-value">${selectedAsset.nextMaintenance}</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">Work Orders:</span>
            <span class="detail-value">${selectedAsset.workOrders}</span>
        </div>
        <div class="asset-detail-item">
            <span class="detail-label">MTBF:</span>
            <span class="detail-value">${selectedAsset.mtbf} hours</span>
        </div>
    `;
}

// Update statistics
function updateStatistics() {
    const stats = maximoData.getStatistics();
    
    document.getElementById('totalAssets').textContent = stats.total;
    document.getElementById('operationalAssets').textContent = stats.operational;
    document.getElementById('warningAssets').textContent = stats.warning;
    document.getElementById('criticalAssets').textContent = stats.critical;
}

// Update asset list
function updateAssetList() {
    const assetListContent = document.getElementById('assetListContent');
    const assets = maximoData.getAssets();
    
    assetListContent.innerHTML = assets.map(asset => {
        const statusClass = asset.status.status.toLowerCase();
        const isSelected = selectedAsset?.id === asset.id ? 'selected' : '';
        
        return `
            <div class="asset-item ${isSelected}" data-asset-id="${asset.id}">
                <div class="asset-item-header">
                    <span class="asset-name">${asset.icon} ${asset.assetNum}</span>
                    <span class="asset-status-mini ${statusClass}"></span>
                </div>
                <div class="asset-type">${asset.type} - ${asset.station}</div>
            </div>
        `;
    }).join('');

    // Add click handlers to asset items
    document.querySelectorAll('.asset-item').forEach(item => {
        item.addEventListener('click', () => {
            const assetId = parseInt(item.dataset.assetId);
            selectAsset(assetId);
        });
    });
}

// Real-time data update
function updateRealTimeData() {
    maximoData.updateAllAssets();
    updateAssetMeshes();
    updateStatistics();
    
    // Simulate random alerts
    alertSystem.simulateRandomAlert();
    
    // Update alerts display
    updateAlertsDisplay();
    
    if (selectedAsset) {
        selectedAsset = maximoData.getAssetById(selectedAsset.id);
        updateAssetDetails();
    }
    
    // Update based on current view mode
    if (currentViewMode === 'map' && map) {
        updateMapMarkers();
        addWeatherOverlay();
    } else if (currentViewMode === 'station' && currentStation) {
        updateAssetListForStation(currentStation.name);
    } else {
        updateAssetList();
    }
}

// Update alerts display
function updateAlertsDisplay() {
    const alertsList = document.getElementById('alertsList');
    const alerts = alertSystem.getActiveAlerts();
    
    if (alerts.length === 0) {
        alertsList.innerHTML = `
            <div class="no-alerts">
                <div class="no-alerts-icon">✅</div>
                <div>No active alerts</div>
            </div>
        `;
        return;
    }
    
    alertsList.innerHTML = alerts.map(alert => {
        const age = alert.getAge();
        const timeText = age < 1 ? 'Just now' : age === 1 ? '1 min ago' : `${age} mins ago`;
        
        return `
            <div class="alert-item ${alert.severity}" data-alert-id="${alert.id}">
                <div class="alert-header">
                    <span class="alert-icon">${alert.icon}</span>
                    <span class="alert-title">${alert.type.replace(/_/g, ' ')}</span>
                    <span class="alert-time">${timeText}</span>
                </div>
                <div class="alert-description">${alert.description}</div>
                ${alert.affectedStations.length > 0 ? `
                    <div class="alert-stations">
                        ${alert.affectedStations.map(station =>
                            `<span class="alert-station-tag">${station}</span>`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    // Add click handlers to alerts
    document.querySelectorAll('.alert-item').forEach(item => {
        item.addEventListener('click', () => {
            const alertId = item.dataset.alertId;
            const alert = alerts.find(a => a.id === alertId);
            if (alert && alert.affectedStations.length > 0) {
                // Switch to map view and highlight affected stations
                if (currentViewMode !== 'map') {
                    switchViewMode('map');
                }
                // Zoom to first affected station
                const stationInfo = getStationPhoto(alert.affectedStations[0]);
                if (map && stationInfo) {
                    map.setView([stationInfo.coordinates.lat, stationInfo.coordinates.lng], 14);
                }
            }
        });
    });
}

// Add weather overlay to map
function addWeatherOverlay() {
    if (!map) return;
    
    const weatherAlerts = alertSystem.getActiveAlerts().filter(a => a.category === 'WEATHER');
    
    if (weatherAlerts.length === 0) {
        if (weatherOverlay) {
            map.removeControl(weatherOverlay);
            weatherOverlay = null;
        }
        return;
    }
    
    // Remove existing overlay
    if (weatherOverlay) {
        map.removeControl(weatherOverlay);
    }
    
    // Create new overlay
    weatherOverlay = L.control({ position: 'topleft' });
    
    weatherOverlay.onAdd = function() {
        const div = L.DomUtil.create('div', 'weather-overlay');
        div.innerHTML = `
            <h4>⛈️ Weather Alerts</h4>
            ${weatherAlerts.map(alert => `
                <div class="weather-alert-item" style="background: ${alert.color}20; border-left: 3px solid ${alert.color};">
                    <span class="weather-alert-icon">${alert.icon}</span>
                    <div>
                        <strong>${alert.type.replace(/_/g, ' ')}</strong><br>
                        <small>${alert.location}</small>
                    </div>
                </div>
            `).join('')}
        `;
        return div;
    };
    
    weatherOverlay.addTo(map);
}

// Initialize map
function initMap() {
    const mapContainer = document.getElementById('mapContainer');
    
    // Create map centered on London
    map = L.map(mapContainer).setView([51.5074, -0.1278], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add London Underground line overlay (optional)
    // This would show the tube lines on the map
    
    // Add map legend
    addMapLegend();
    
    // Add asset markers
    updateMapMarkers();
}

// Add map legend
function addMapLegend() {
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-legend');
        div.innerHTML = `
            <h4>Asset Status</h4>
            <div class="map-legend-item">
                <div class="map-legend-color" style="background: #4caf50;"></div>
                <span>Operational</span>
            </div>
            <div class="map-legend-item">
                <div class="map-legend-color" style="background: #ff9800;"></div>
                <span>Warning</span>
            </div>
            <div class="map-legend-item">
                <div class="map-legend-color" style="background: #f44336;"></div>
                <span>Critical</span>
            </div>
        `;
        return div;
    };
    
    legend.addTo(map);
}

// Update map markers
function updateMapMarkers() {
    if (!map) return;
    
    // Clear existing markers
    assetMarkers.forEach(marker => map.removeLayer(marker));
    assetMarkers = [];
    
    // Get all assets
    const assets = maximoData.getAssets();
    
    // Group assets by station
    const assetsByStation = {};
    assets.forEach(asset => {
        if (!assetsByStation[asset.station]) {
            assetsByStation[asset.station] = [];
        }
        assetsByStation[asset.station].push(asset);
    });
    
    // Create markers for each station
    Object.keys(assetsByStation).forEach(stationName => {
        const stationAssets = assetsByStation[stationName];
        const stationInfo = getStationPhoto(stationName);
        
        // Count assets by status
        const operational = stationAssets.filter(a => a.status.status === 'Operational').length;
        const warning = stationAssets.filter(a => a.status.status === 'Warning').length;
        const critical = stationAssets.filter(a => a.status.status === 'Critical').length;
        
        // Determine marker color based on worst status
        let markerColor = '#4caf50'; // operational
        let statusClass = 'operational';
        if (critical > 0) {
            markerColor = '#f44336';
            statusClass = 'critical';
        } else if (warning > 0) {
            markerColor = '#ff9800';
            statusClass = 'warning';
        }
        
        // Check for alerts at this station
        const stationAlerts = alertSystem.getAlertsByStation(stationName);
        const hasAlerts = stationAlerts.length > 0;
        const alertBadge = hasAlerts ? `<div class="marker-alert-badge">${stationAlerts.length}</div>` : '';
        
        // Create custom icon
        const icon = L.divIcon({
            className: 'asset-marker',
            html: `<div class="asset-marker-icon ${statusClass}">🚇${alertBadge}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20]
        });
        
        // Create marker
        const marker = L.marker(
            [stationInfo.coordinates.lat, stationInfo.coordinates.lng],
            { icon: icon }
        );
        
        // Create popup content with alerts
        const alertsHtml = stationAlerts.length > 0 ? `
            <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e0e0e0;">
                <strong style="color: #e74c3c;">🚨 Active Alerts (${stationAlerts.length})</strong>
                ${stationAlerts.map(alert => `
                    <div style="margin-top: 0.5rem; padding: 0.5rem; background: ${alert.color}20; border-radius: 4px; font-size: 0.85rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <span>${alert.icon}</span>
                            <strong>${alert.type.replace(/_/g, ' ')}</strong>
                        </div>
                        <div style="margin-top: 0.25rem; color: #666;">${alert.description}</div>
                    </div>
                `).join('')}
            </div>
        ` : '';
        
        const popupContent = `
            <div class="map-popup">
                <div class="map-popup-header">
                    <span class="map-popup-icon">🚇</span>
                    <div class="map-popup-title">
                        <h3>${stationName}</h3>
                        <p>${stationAssets.length} assets</p>
                    </div>
                </div>
                <div class="map-popup-details">
                    <div class="map-popup-detail">
                        <span class="map-popup-label">✅ Operational:</span>
                        <span class="map-popup-value">${operational}</span>
                    </div>
                    <div class="map-popup-detail">
                        <span class="map-popup-label">⚠️ Warning:</span>
                        <span class="map-popup-value">${warning}</span>
                    </div>
                    <div class="map-popup-detail">
                        <span class="map-popup-label">🔴 Critical:</span>
                        <span class="map-popup-value">${critical}</span>
                    </div>
                </div>
                ${alertsHtml}
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Add click handler to show station details
        marker.on('click', () => {
            // Update asset list for this station
            updateAssetListForStation(stationName);
        });
        
        marker.addTo(map);
        assetMarkers.push(marker);
    });
}

// Update active scenarios display
function updateActiveScenariosDisplay() {
    const activeScenariosList = document.getElementById('activeScenariosList');
    const scenarios = scenarioSimulator.getActiveScenarios();
    
    if (scenarios.length === 0) {
        activeScenariosList.innerHTML = '<div class="no-active-scenarios">No active scenarios</div>';
        return;
    }
    
    activeScenariosList.innerHTML = scenarios.map(scenario => {
        const elapsed = Math.floor((Date.now() - scenario.startTime) / 1000);
        const remaining = Math.floor((scenario.duration - (Date.now() - scenario.startTime)) / 1000);
        
        return `
            <div class="active-scenario-item">
                <div class="scenario-item-header">
                    <div class="scenario-item-title">
                        <span class="scenario-item-icon">${scenario.icon}</span>
                        <span>${scenario.name}</span>
                    </div>
                    <button class="stop-scenario-btn" data-scenario-id="${scenario.id}">Stop</button>
                </div>
                <div class="scenario-item-details">
                    ${scenario.affectedAssets.length} assets affected
                </div>
                <div class="scenario-item-phase phase-${scenario.phase}">
                    Phase: ${scenario.phase}
                </div>
                <div class="scenario-item-details" style="margin-top: 0.5rem;">
                    Time remaining: ${Math.floor(remaining / 60)}m ${remaining % 60}s
                </div>
                <div class="scenario-item-stations">
                    ${scenario.stations.map(station =>
                        `<span class="scenario-station-tag">${station}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    // Add stop button handlers
    document.querySelectorAll('.stop-scenario-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const scenarioId = btn.dataset.scenarioId;
            scenarioSimulator.stopScenario(scenarioId);
            updateActiveScenariosDisplay();
        });
    });
}

// Initialize simulator controls
function initSimulatorControls() {
    const toggleSimulatorBtn = document.getElementById('toggleSimulator');
    const closeSimulatorBtn = document.getElementById('closeSimulator');
    const simulatorPanel = document.getElementById('simulatorPanel');
    const startScenarioBtn = document.getElementById('startScenario');
    const scenarioTypeSelect = document.getElementById('scenarioType');
    const affectedStationsSelect = document.getElementById('affectedStations');
    const scenarioDurationSelect = document.getElementById('scenarioDuration');
    
    // Populate stations list
    const stations = getAllStationPhotos();
    affectedStationsSelect.innerHTML = stations.map(station =>
        `<option value="${station.name}">${station.name}</option>`
    ).join('');
    
    // Toggle simulator panel
    toggleSimulatorBtn.addEventListener('click', () => {
        const isVisible = simulatorPanel.style.display !== 'none';
        simulatorPanel.style.display = isVisible ? 'none' : 'block';
        toggleSimulatorBtn.classList.toggle('active');
    });
    
    closeSimulatorBtn.addEventListener('click', () => {
        simulatorPanel.style.display = 'none';
        toggleSimulatorBtn.classList.remove('active');
    });
    
    // Start scenario
    startScenarioBtn.addEventListener('click', () => {
        const scenarioType = scenarioTypeSelect.value;
        const selectedStations = Array.from(affectedStationsSelect.selectedOptions).map(opt => opt.value);
        const duration = parseInt(scenarioDurationSelect.value);
        
        if (!scenarioType) {
            alert('Please select a scenario type');
            return;
        }
        
        if (selectedStations.length === 0) {
            alert('Please select at least one station');
            return;
        }
        
        // Start the scenario
        scenarioSimulator.simulateScenario(scenarioType, selectedStations, duration);
        
        // Update displays
        updateActiveScenariosDisplay();
        updateAlertsDisplay();
        
        // Reset form
        scenarioTypeSelect.value = '';
        affectedStationsSelect.selectedIndex = -1;
        
        // Show success message
        alert(`Scenario started! Watch the effects unfold over the next ${duration / 60000} minutes.`);
    });
}

// Initialize UI controls
function initControls() {
    const toggleRotationBtn = document.getElementById('toggleRotation');
    const resetViewBtn = document.getElementById('resetView');
    const view3DBtn = document.getElementById('view3D');
    const viewMapBtn = document.getElementById('viewMap');
    const viewStationBtn = document.getElementById('viewStation');
    const viewBIMBtn = document.getElementById('viewBIM');
    const stationSelect = document.getElementById('stationSelect');
    const togglePhotoBtn = document.getElementById('togglePhoto');

    toggleRotationBtn.addEventListener('click', () => {
        isRotating = !isRotating;
        toggleRotationBtn.textContent = isRotating ? '⏸️ Pause Rotation' : '▶️ Resume Rotation';
    });

    resetViewBtn.addEventListener('click', () => {
        camera.position.set(30, 25, 30);
        camera.lookAt(0, 0, 0);
        controls.reset();
    });

    // View mode switching
    view3DBtn.addEventListener('click', () => {
        switchViewMode('3D');
    });

    viewMapBtn.addEventListener('click', () => {
        switchViewMode('map');
    });

    viewStationBtn.addEventListener('click', () => {
        switchViewMode('station');
    });

    // BIM view mode
    if (viewBIMBtn) {
        viewBIMBtn.addEventListener('click', () => {
            switchViewMode('bim');
        });
    }

    // Station selection
    stationSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            loadStationView(e.target.value);
        }
    });

    // Toggle photo visibility
    togglePhotoBtn.addEventListener('click', () => {
        photoVisible = !photoVisible;
        const photoOverlay = document.getElementById('photoOverlay');
        photoOverlay.style.display = photoVisible ? 'block' : 'none';
        togglePhotoBtn.textContent = photoVisible ? '🖼️ Hide Photo' : '🖼️ Show Photo';
    });

    // Add mouse click handler
    document.getElementById('canvas3d').addEventListener('click', onMouseClick);

    // Populate station selector
    populateStationSelector();
}

// Populate station selector dropdown
function populateStationSelector() {
    const stationSelect = document.getElementById('stationSelect');
    const stations = getAllStationPhotos();
    
    stations.forEach(station => {
        const option = document.createElement('option');
        option.value = station.name;
        option.textContent = station.name;
        stationSelect.appendChild(option);
    });
}

// Switch between 3D, map, station, and BIM view modes
function switchViewMode(mode) {
    currentViewMode = mode;
    const view3DBtn = document.getElementById('view3D');
    const viewMapBtn = document.getElementById('viewMap');
    const viewStationBtn = document.getElementById('viewStation');
    const viewBIMBtn = document.getElementById('viewBIM');
    const stationSelector = document.getElementById('stationSelector');
    const togglePhotoBtn = document.getElementById('togglePhoto');
    const photoOverlay = document.getElementById('photoOverlay');
    const canvas3d = document.getElementById('canvas3d');
    const mapContainer = document.getElementById('mapContainer');

    // Reset all buttons
    view3DBtn.classList.remove('active');
    viewMapBtn.classList.remove('active');
    viewStationBtn.classList.remove('active');
    if (viewBIMBtn) viewBIMBtn.classList.remove('active');

    if (mode === '3D') {
        view3DBtn.classList.add('active');
        canvas3d.style.display = 'block';
        mapContainer.style.display = 'none';
        stationSelector.style.display = 'none';
        togglePhotoBtn.style.display = 'none';
        photoOverlay.style.display = 'none';
        isRotating = true;
        
        // Clear BIM visualization if active
        if (bimVisualization) {
            bimVisualization.clearBIMModel(scene);
        }
        
        // Reset camera to 3D view
        camera.position.set(30, 25, 30);
        camera.lookAt(0, 0, 0);
        controls.reset();
        
        // Show all assets
        assetMeshes.forEach(({ mesh }) => {
            mesh.visible = true;
        });
        
        // Update asset list to show all
        updateAssetList();
    } else if (mode === 'map') {
        viewMapBtn.classList.add('active');
        canvas3d.style.display = 'none';
        mapContainer.style.display = 'block';
        stationSelector.style.display = 'none';
        togglePhotoBtn.style.display = 'none';
        photoOverlay.style.display = 'none';
        isRotating = false;
        
        // Initialize map if not already done
        if (!map) {
            initMap();
        } else {
            // Refresh map markers
            updateMapMarkers();
            // Add weather overlay
            addWeatherOverlay();
            // Initialize GIS layers if not done
            if (!gisLayerManager) {
                initGISControls();
            }
            // Force map to resize
            setTimeout(() => map.invalidateSize(), 100);
        }
        
        // Update asset list to show all
        updateAssetList();
    } else if (mode === 'station') {
        viewStationBtn.classList.add('active');
        canvas3d.style.display = 'block';
        mapContainer.style.display = 'none';
        stationSelector.style.display = 'block';
        togglePhotoBtn.style.display = 'inline-block';
        isRotating = false;
        
        // Clear BIM visualization if active
        if (bimVisualization) {
            bimVisualization.clearBIMModel(scene);
        }
        
        // Prompt to select a station if none selected
        if (!currentStation) {
            const stationSelect = document.getElementById('stationSelect');
            if (stationSelect.options.length > 1) {
                stationSelect.selectedIndex = 1;
                loadStationView(stationSelect.value);
            }
        }
    } else if (mode === 'bim') {
        if (viewBIMBtn) viewBIMBtn.classList.add('active');
        canvas3d.style.display = 'block';
        mapContainer.style.display = 'none';
        stationSelector.style.display = 'none';
        togglePhotoBtn.style.display = 'none';
        photoOverlay.style.display = 'none';
        isRotating = false;
        
        // Initialize BIM visualization if not done
        if (!bimVisualization) {
            bimVisualization = new BIMVisualization();
        }
        
        // Hide regular assets
        assetMeshes.forEach(({ mesh }) => {
            mesh.visible = false;
        });
        
        // Load default station BIM (King's Cross)
        loadBIMView('King\'s Cross St. Pancras');
    }
}

// Load station view with photo overlay
function loadStationView(stationName) {
    currentStation = getStationPhoto(stationName);
    const photoOverlay = document.getElementById('photoOverlay');
    const stationPhoto = document.getElementById('stationPhoto');
    const photoStationName = document.getElementById('photoStationName');
    const photoStationDesc = document.getElementById('photoStationDesc');

    // Set photo and info with fallback handling
    const photoUrl = currentStation.photoUrl.primary || currentStation.photoUrl.fallback || currentStation.photoUrl;
    
    // Try to load the image with error handling
    const img = new Image();
    img.onload = () => {
        stationPhoto.src = photoUrl;
    };
    img.onerror = () => {
        // If primary fails, use fallback
        const fallbackUrl = currentStation.photoUrl.fallback || currentStation.photoUrl;
        stationPhoto.src = fallbackUrl;
    };
    img.src = photoUrl;
    
    photoStationName.textContent = currentStation.name;
    photoStationDesc.textContent = currentStation.description;
    
    if (photoVisible) {
        photoOverlay.style.display = 'block';
    }

    // Filter and position assets for this station
    const stationAssets = maximoData.getAssets().filter(
        asset => asset.station === stationName
    );

    // Hide assets not at this station
    assetMeshes.forEach(({ mesh, asset }) => {
        if (asset.station === stationName) {
            mesh.visible = true;
            // Position assets based on station layout
            const basePos = currentStation.assetPositions.platform;
            mesh.position.set(
                basePos.x + (Math.random() - 0.5) * 8,
                basePos.y + (Math.random() - 0.5) * 3,
                basePos.z + (Math.random() - 0.5) * 8
            );
        } else {
            mesh.visible = false;
        }
    });

    // Adjust camera for station view
    camera.position.set(15, 10, 15);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();

    // Update asset list to show only station assets
    updateAssetListForStation(stationName);
}

// Update asset list for specific station
function updateAssetListForStation(stationName) {
    const assetListContent = document.getElementById('assetListContent');
    const assets = maximoData.getAssets().filter(
        asset => asset.station === stationName
    );
    
    if (assets.length === 0) {
        assetListContent.innerHTML = '<p class="no-selection">No assets at this station</p>';
        return;
    }

    assetListContent.innerHTML = assets.map(asset => {
        const statusClass = asset.status.status.toLowerCase();
        const isSelected = selectedAsset?.id === asset.id ? 'selected' : '';
        
        return `
            <div class="asset-item ${isSelected}" data-asset-id="${asset.id}">
                <div class="asset-item-header">
                    <span class="asset-name">${asset.icon} ${asset.assetNum}</span>
                    <span class="asset-status-mini ${statusClass}"></span>
                </div>
                <div class="asset-type">${asset.type} - ${asset.line} Line</div>
            </div>
        `;
    }).join('');

    // Add click handlers to asset items
    document.querySelectorAll('.asset-item').forEach(item => {
        item.addEventListener('click', () => {
            const assetId = parseInt(item.dataset.assetId);
            selectAsset(assetId);
        });
    });
}

// Initialize GIS controls
function initGISControls() {
    if (!map) return;
    
    gisLayerManager = new GISLayerManager(map);
    const gisLayerGroups = document.getElementById('gisLayerGroups');
    
    if (!gisLayerGroups) return;
    
    // Clear existing content
    gisLayerGroups.innerHTML = '';
    
    // Get all layer groups
    const layerGroups = gisLayerManager.getLayerGroups();
    
    // Create UI for each layer group
    Object.entries(layerGroups).forEach(([groupKey, group]) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'gis-layer-group';
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'gis-group-header';
        headerDiv.innerHTML = `
            <span class="gis-group-icon">${group.icon}</span>
            <span>${group.name}</span>
        `;
        
        const layersDiv = document.createElement('div');
        layersDiv.className = 'gis-layers-list';
        
        // Add each layer in the group
        group.layers.forEach(layer => {
            const layerDiv = document.createElement('div');
            layerDiv.className = 'gis-layer-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'gis-layer-checkbox';
            checkbox.id = `gis-layer-${layer.id}`;
            checkbox.checked = layer.visible;
            
            const colorDiv = document.createElement('div');
            colorDiv.className = 'gis-layer-color';
            colorDiv.style.backgroundColor = layer.color;
            
            const label = document.createElement('label');
            label.className = 'gis-layer-name';
            label.htmlFor = checkbox.id;
            label.textContent = layer.name;
            
            // Add toggle handler
            checkbox.addEventListener('change', (e) => {
                gisLayerManager.toggleLayer(layer.id, e.target.checked);
            });
            
            layerDiv.appendChild(checkbox);
            layerDiv.appendChild(colorDiv);
            layerDiv.appendChild(label);
            layersDiv.appendChild(layerDiv);
        });
        
        groupDiv.appendChild(headerDiv);
        groupDiv.appendChild(layersDiv);
        gisLayerGroups.appendChild(groupDiv);
    });
    
    // Add toggle button handler
    const gisBtn = document.getElementById('toggleGIS');
    const gisPanel = document.getElementById('gisPanel');
    
    if (gisBtn && gisPanel) {
        gisBtn.addEventListener('click', () => {
            const isVisible = gisPanel.style.display !== 'none';
            gisPanel.style.display = isVisible ? 'none' : 'block';
            gisBtn.classList.toggle('active');
        });
        
        // Close button
        const closeBtn = gisPanel.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                gisPanel.style.display = 'none';
                gisBtn.classList.remove('active');
            });
        }
    }
}

// Load BIM view for a station
function loadBIMView(stationName) {
    if (!bimVisualization) {
        bimVisualization = new BIMVisualization(scene);
    }
    
    // Clear existing BIM models
    bimVisualization.clearAllBIMModels();
    
    // Create new BIM model at origin
    const bimModel = bimVisualization.createStationBIM(stationName, { x: 0, y: 0, z: 0 });
    
    if (!bimModel) {
        console.warn(`No BIM data available for ${stationName}`);
        return;
    }
    
    // Add the model to the scene
    scene.add(bimModel);
    
    // Position camera to view the BIM model
    const box = new THREE.Box3().setFromObject(bimModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 1.5;
    
    camera.position.set(
        center.x + distance,
        center.y + distance * 0.7,
        center.z + distance
    );
    camera.lookAt(center);
    controls.target.copy(center);
    controls.update();
    
    // Create BIM info panel
    createBIMInfoPanel(bimModel);
}

// Create BIM information panel
function createBIMInfoPanel(bimModel) {
    // Remove existing panel if any
    const existingPanel = document.getElementById('bimInfoPanel');
    if (existingPanel) {
        existingPanel.remove();
    }
    
    const panel = document.createElement('div');
    panel.id = 'bimInfoPanel';
    panel.className = 'bim-info-panel';
    
    panel.innerHTML = `
        <h4>🏗️ ${bimModel.stationName}</h4>
        <div class="bim-stat">
            <span class="bim-stat-label">Total Floors:</span>
            <span class="bim-stat-value">${bimModel.floors.length}</span>
        </div>
        <div class="bim-stat">
            <span class="bim-stat-label">Building Systems:</span>
            <span class="bim-stat-value">${Object.keys(bimModel.systems).length}</span>
        </div>
        <div class="bim-stat">
            <span class="bim-stat-label">Total Spaces:</span>
            <span class="bim-stat-value">${bimModel.floors.reduce((sum, f) => sum + f.spaces.length, 0)}</span>
        </div>
        <div class="bim-floor-selector">
            <label for="bimFloorSelect">Select Floor:</label>
            <select id="bimFloorSelect" class="bim-floor-select">
                ${bimModel.floors.map(floor => 
                    `<option value="${floor.level}">${floor.name}</option>`
                ).join('')}
            </select>
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Add floor selector handler
    const floorSelect = document.getElementById('bimFloorSelect');
    if (floorSelect) {
        floorSelect.addEventListener('change', (e) => {
            const level = parseInt(e.target.value);
            bimVisualization.highlightFloor(scene, level);
        });
    }
}

// Initialize application
function init() {
    initScene();
    initControls();
    initSimulatorControls();
    updateStatistics();
    updateAssetList();
    updateAlertsDisplay();
    updateActiveScenariosDisplay();
    animate();

    // Update data every 2 seconds
    setInterval(updateRealTimeData, 2000);
    
    // Update scenarios display every second
    setInterval(updateActiveScenariosDisplay, 1000);
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Made with Bob
