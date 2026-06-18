// BIM (Building Information Modeling) Visualization Module

export class BIMVisualization {
    constructor(scene) {
        this.scene = scene;
        this.bimModels = new Map();
        this.activeBIMView = null;
        this.floorPlans = new Map();
    }

    // Station BIM data structure
    static stationBIMData = {
        "King's Cross St. Pancras": {
            name: "King's Cross St. Pancras",
            floors: [
                { level: -3, name: "Deep Level Platforms", elevation: -30 },
                { level: -2, name: "Subsurface Platforms", elevation: -20 },
                { level: -1, name: "Ticket Hall", elevation: -10 },
                { level: 0, name: "Ground Level", elevation: 0 },
                { level: 1, name: "Mezzanine", elevation: 5 }
            ],
            dimensions: { length: 200, width: 150, height: 35 },
            systems: {
                hvac: { zones: 12, capacity: '500,000 CFM' },
                electrical: { substations: 4, capacity: '15 MVA' },
                plumbing: { zones: 8, capacity: '2000 GPM' },
                fire: { zones: 15, sprinklers: 450 }
            },
            spaces: [
                { type: 'Platform', count: 6, area: 12000 },
                { type: 'Concourse', count: 2, area: 8000 },
                { type: 'Retail', count: 25, area: 3500 },
                { type: 'Office', count: 10, area: 2000 },
                { type: 'Plant Room', count: 8, area: 1500 }
            ]
        },
        "Oxford Circus": {
            name: "Oxford Circus",
            floors: [
                { level: -2, name: "Platform Level", elevation: -25 },
                { level: -1, name: "Interchange Level", elevation: -12 },
                { level: 0, name: "Ticket Hall", elevation: 0 }
            ],
            dimensions: { length: 120, width: 80, height: 25 },
            systems: {
                hvac: { zones: 8, capacity: '300,000 CFM' },
                electrical: { substations: 2, capacity: '8 MVA' },
                plumbing: { zones: 4, capacity: '1000 GPM' },
                fire: { zones: 10, sprinklers: 280 }
            },
            spaces: [
                { type: 'Platform', count: 4, area: 6000 },
                { type: 'Concourse', count: 1, area: 3000 },
                { type: 'Retail', count: 8, area: 800 },
                { type: 'Plant Room', count: 4, area: 600 }
            ]
        }
    };

    // Create 3D BIM model for a station
    createStationBIM(stationName, position = { x: 0, y: 0, z: 0 }) {
        const THREE = window.THREE;
        if (!THREE) return null;

        const bimData = BIMVisualization.stationBIMData[stationName];
        if (!bimData) return null;

        const bimGroup = new THREE.Group();
        bimGroup.name = `BIM_${stationName}`;

        // Create building envelope
        const buildingGeometry = new THREE.BoxGeometry(
            bimData.dimensions.length / 10,
            bimData.dimensions.height / 10,
            bimData.dimensions.width / 10
        );
        
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            transparent: true,
            opacity: 0.3,
            wireframe: false
        });

        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(position.x, position.y, position.z);
        bimGroup.add(building);

        // Create floor plates
        bimData.floors.forEach((floor, index) => {
            const floorGeometry = new THREE.BoxGeometry(
                bimData.dimensions.length / 10,
                0.2,
                bimData.dimensions.width / 10
            );
            
            const floorMaterial = new THREE.MeshStandardMaterial({
                color: this.getFloorColor(floor.level),
                transparent: true,
                opacity: 0.6
            });

            const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
            floorMesh.position.set(
                position.x,
                position.y + (floor.elevation / 10),
                position.z
            );
            floorMesh.userData = {
                type: 'floor',
                level: floor.level,
                name: floor.name,
                elevation: floor.elevation
            };
            bimGroup.add(floorMesh);

            // Add floor label
            this.addFloorLabel(bimGroup, floor, position);
        });

        // Add system visualizations
        this.addSystemVisualizations(bimGroup, bimData, position);

        // Add space divisions
        this.addSpaceVisualizations(bimGroup, bimData, position);

        bimGroup.position.set(position.x, position.y, position.z);
        this.bimModels.set(stationName, bimGroup);

        return bimGroup;
    }

    getFloorColor(level) {
        const colors = {
            '-3': 0x8B0000, // Deep red
            '-2': 0xFF4500, // Orange red
            '-1': 0xFFA500, // Orange
            '0': 0x32CD32,  // Green
            '1': 0x4169E1   // Blue
        };
        return colors[level.toString()] || 0x808080;
    }

    addFloorLabel(group, floor, position) {
        // In a real implementation, this would use TextGeometry or sprites
        // For now, we'll add a small marker
        const THREE = window.THREE;
        const markerGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(
            position.x + 10,
            position.y + (floor.elevation / 10),
            position.z
        );
        marker.userData = {
            type: 'label',
            text: floor.name
        };
        group.add(marker);
    }

    addSystemVisualizations(group, bimData, position) {
        const THREE = window.THREE;
        
        // HVAC ducts (blue lines)
        for (let i = 0; i < bimData.systems.hvac.zones; i++) {
            const ductGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
            const ductMaterial = new THREE.MeshStandardMaterial({
                color: 0x4169E1,
                transparent: true,
                opacity: 0.7
            });
            const duct = new THREE.Mesh(ductGeometry, ductMaterial);
            duct.position.set(
                position.x + (Math.random() - 0.5) * 15,
                position.y + Math.random() * 3,
                position.z + (Math.random() - 0.5) * 10
            );
            duct.userData = { type: 'hvac', zone: i + 1 };
            group.add(duct);
        }

        // Electrical conduits (yellow lines)
        for (let i = 0; i < bimData.systems.electrical.substations; i++) {
            const conduitGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.3);
            const conduitMaterial = new THREE.MeshStandardMaterial({
                color: 0xFFD700,
                emissive: 0xFFD700,
                emissiveIntensity: 0.3
            });
            const conduit = new THREE.Mesh(conduitGeometry, conduitMaterial);
            conduit.position.set(
                position.x + (Math.random() - 0.5) * 15,
                position.y - 1,
                position.z + (Math.random() - 0.5) * 10
            );
            conduit.userData = { type: 'electrical', substation: i + 1 };
            group.add(conduit);
        }
    }

    addSpaceVisualizations(group, bimData, position) {
        const THREE = window.THREE;
        
        bimData.spaces.forEach((space, index) => {
            const spaceSize = Math.sqrt(space.area) / 20;
            const spaceGeometry = new THREE.BoxGeometry(spaceSize, 0.5, spaceSize);
            const spaceColor = this.getSpaceColor(space.type);
            const spaceMaterial = new THREE.MeshStandardMaterial({
                color: spaceColor,
                transparent: true,
                opacity: 0.4
            });
            const spaceMesh = new THREE.Mesh(spaceGeometry, spaceMaterial);
            spaceMesh.position.set(
                position.x + (index - bimData.spaces.length / 2) * 3,
                position.y - 2,
                position.z
            );
            spaceMesh.userData = {
                type: 'space',
                spaceType: space.type,
                area: space.area,
                count: space.count
            };
            group.add(spaceMesh);
        });
    }

    getSpaceColor(spaceType) {
        const colors = {
            'Platform': 0x4169E1,
            'Concourse': 0x32CD32,
            'Retail': 0xFFD700,
            'Office': 0x9370DB,
            'Plant Room': 0xFF6347
        };
        return colors[spaceType] || 0x808080;
    }

    // Generate floor plan data
    generateFloorPlan(stationName, floorLevel) {
        const bimData = BIMVisualization.stationBIMData[stationName];
        if (!bimData) return null;

        const floor = bimData.floors.find(f => f.level === floorLevel);
        if (!floor) return null;

        return {
            stationName,
            floorLevel,
            floorName: floor.name,
            elevation: floor.elevation,
            dimensions: bimData.dimensions,
            rooms: this.generateRoomLayout(bimData, floorLevel),
            systems: this.generateSystemLayout(bimData, floorLevel),
            assets: this.getAssetsOnFloor(stationName, floorLevel)
        };
    }

    generateRoomLayout(bimData, floorLevel) {
        // Generate room layout based on floor level
        const rooms = [];
        const roomCount = Math.floor(Math.random() * 10) + 5;

        for (let i = 0; i < roomCount; i++) {
            rooms.push({
                id: `room_${i}`,
                name: `Room ${i + 1}`,
                type: ['Office', 'Plant', 'Storage', 'Corridor'][Math.floor(Math.random() * 4)],
                area: Math.floor(Math.random() * 100) + 20,
                position: {
                    x: Math.random() * bimData.dimensions.length,
                    y: Math.random() * bimData.dimensions.width
                }
            });
        }

        return rooms;
    }

    generateSystemLayout(bimData, floorLevel) {
        return {
            hvac: {
                vents: Math.floor(Math.random() * 20) + 10,
                returns: Math.floor(Math.random() * 15) + 5
            },
            electrical: {
                outlets: Math.floor(Math.random() * 50) + 20,
                panels: Math.floor(Math.random() * 5) + 2
            },
            plumbing: {
                fixtures: Math.floor(Math.random() * 30) + 10
            },
            fire: {
                sprinklers: Math.floor(Math.random() * 40) + 20,
                detectors: Math.floor(Math.random() * 30) + 15,
                extinguishers: Math.floor(Math.random() * 10) + 5
            }
        };
    }

    getAssetsOnFloor(stationName, floorLevel) {
        // This would integrate with the asset management system
        return {
            total: Math.floor(Math.random() * 20) + 5,
            operational: Math.floor(Math.random() * 15) + 3,
            warning: Math.floor(Math.random() * 3),
            critical: Math.floor(Math.random() * 2)
        };
    }

    // Get BIM model
    getBIMModel(stationName) {
        return this.bimModels.get(stationName);
    }

    // Remove BIM model
    removeBIMModel(stationName) {
        const model = this.bimModels.get(stationName);
        if (model && this.scene) {
            this.scene.remove(model);
            this.bimModels.delete(stationName);
        }
    }

    // Clear all BIM models
    clearAllBIMModels() {
        this.bimModels.forEach((model, name) => {
            if (this.scene) {
                this.scene.remove(model);
            }
        });
        this.bimModels.clear();
    }

    // Get BIM statistics
    getBIMStatistics(stationName) {
        const bimData = BIMVisualization.stationBIMData[stationName];
        if (!bimData) return null;

        return {
            name: bimData.name,
            totalFloors: bimData.floors.length,
            totalArea: bimData.spaces.reduce((sum, space) => sum + space.area, 0),
            totalSpaces: bimData.spaces.reduce((sum, space) => sum + space.count, 0),
            systems: bimData.systems,
            dimensions: bimData.dimensions
        };
    }
}

export default BIMVisualization;

// Made with Bob
