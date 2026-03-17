// Maximo Asset Management Data Generator for London Underground

// London Underground Lines
const tubeLines = [
    'Bakerloo', 'Central', 'Circle', 'District', 'Hammersmith & City',
    'Jubilee', 'Metropolitan', 'Northern', 'Piccadilly', 'Victoria', 'Waterloo & City'
];

// Asset Types in London Underground
const assetTypes = [
    { type: 'Train', icon: '🚇', prefix: 'TRN' },
    { type: 'Escalator', icon: '🎢', prefix: 'ESC' },
    { type: 'Lift', icon: '🛗', prefix: 'LFT' },
    { type: 'Signal', icon: '🚦', prefix: 'SIG' },
    { type: 'Track', icon: '🛤️', prefix: 'TRK' },
    { type: 'Power Supply', icon: '⚡', prefix: 'PWR' },
    { type: 'Ventilation', icon: '💨', prefix: 'VNT' },
    { type: 'CCTV', icon: '📹', prefix: 'CAM' },
    { type: 'Ticket Machine', icon: '🎫', prefix: 'TKT' },
    { type: 'Platform Door', icon: '🚪', prefix: 'PDR' }
];

// Asset Status Types
const statusTypes = [
    { status: 'Operational', color: 0x4caf50, weight: 70 },
    { status: 'Warning', color: 0xff9800, weight: 20 },
    { status: 'Critical', color: 0xf44336, weight: 10 }
];

// Major London Underground Stations
const stations = [
    'King\'s Cross St. Pancras', 'Oxford Circus', 'Victoria', 'Liverpool Street',
    'Waterloo', 'London Bridge', 'Paddington', 'Bank', 'Stratford', 'Canary Wharf',
    'Leicester Square', 'Piccadilly Circus', 'Green Park', 'Westminster', 'Euston',
    'Camden Town', 'Clapham Common', 'Brixton', 'Wembley Park', 'Heathrow Terminal 5'
];

class MaximoAsset {
    constructor(id, type, line, station) {
        this.id = id;
        this.assetNum = `${type.prefix}-${String(id).padStart(5, '0')}`;
        this.type = type.type;
        this.icon = type.icon;
        this.line = line;
        this.station = station;
        this.status = this.generateStatus();
        this.installDate = this.generateInstallDate();
        this.lastMaintenance = this.generateLastMaintenance();
        this.nextMaintenance = this.generateNextMaintenance();
        this.workOrders = Math.floor(Math.random() * 50);
        this.mtbf = Math.floor(Math.random() * 5000) + 1000; // Mean Time Between Failures (hours)
        this.utilizationRate = Math.floor(Math.random() * 40) + 60; // 60-100%
        this.temperature = this.generateTemperature();
        this.vibration = this.generateVibration();
        this.powerConsumption = this.generatePowerConsumption();
        this.position = this.generatePosition();
    }

    generateStatus() {
        const rand = Math.random() * 100;
        let cumulative = 0;
        for (const statusType of statusTypes) {
            cumulative += statusType.weight;
            if (rand <= cumulative) {
                return {
                    status: statusType.status,
                    color: statusType.color
                };
            }
        }
        return statusTypes[0];
    }

    generateInstallDate() {
        const years = Math.floor(Math.random() * 15) + 5; // 5-20 years ago
        const date = new Date();
        date.setFullYear(date.getFullYear() - years);
        return date.toISOString().split('T')[0];
    }

    generateLastMaintenance() {
        const days = Math.floor(Math.random() * 90); // 0-90 days ago
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date.toISOString().split('T')[0];
    }

    generateNextMaintenance() {
        const days = Math.floor(Math.random() * 60) + 1; // 1-60 days from now
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    generateTemperature() {
        // Temperature in Celsius
        return (Math.random() * 30 + 15).toFixed(1); // 15-45°C
    }

    generateVibration() {
        // Vibration level in mm/s
        return (Math.random() * 5).toFixed(2); // 0-5 mm/s
    }

    generatePowerConsumption() {
        // Power consumption in kW
        return (Math.random() * 100 + 10).toFixed(1); // 10-110 kW
    }

    generatePosition() {
        // Generate random 3D position for visualization
        return {
            x: (Math.random() - 0.5) * 30,
            y: (Math.random() - 0.5) * 20,
            z: (Math.random() - 0.5) * 30
        };
    }

    updateRealTimeData() {
        // Simulate real-time data changes
        const statusChange = Math.random();
        if (statusChange < 0.05) { // 5% chance of status change
            this.status = this.generateStatus();
        }

        // Update sensor readings with small variations
        this.temperature = (parseFloat(this.temperature) + (Math.random() - 0.5) * 2).toFixed(1);
        this.vibration = Math.max(0, parseFloat(this.vibration) + (Math.random() - 0.5) * 0.5).toFixed(2);
        this.powerConsumption = (parseFloat(this.powerConsumption) + (Math.random() - 0.5) * 5).toFixed(1);
        this.utilizationRate = Math.max(0, Math.min(100, this.utilizationRate + Math.floor((Math.random() - 0.5) * 10)));
    }
}

export class MaximoDataGenerator {
    constructor(assetCount = 50) {
        this.assets = [];
        this.generateAssets(assetCount);
    }

    generateAssets(count) {
        for (let i = 0; i < count; i++) {
            const type = assetTypes[Math.floor(Math.random() * assetTypes.length)];
            const line = tubeLines[Math.floor(Math.random() * tubeLines.length)];
            const station = stations[Math.floor(Math.random() * stations.length)];
            
            const asset = new MaximoAsset(i + 1, type, line, station);
            this.assets.push(asset);
        }
    }

    getAssets() {
        return this.assets;
    }

    getAssetById(id) {
        return this.assets.find(asset => asset.id === id);
    }

    getAssetsByStatus(status) {
        return this.assets.filter(asset => asset.status.status === status);
    }

    getAssetsByType(type) {
        return this.assets.filter(asset => asset.type === type);
    }

    getAssetsByLine(line) {
        return this.assets.filter(asset => asset.line === line);
    }

    getStatistics() {
        const total = this.assets.length;
        const operational = this.getAssetsByStatus('Operational').length;
        const warning = this.getAssetsByStatus('Warning').length;
        const critical = this.getAssetsByStatus('Critical').length;

        return {
            total,
            operational,
            warning,
            critical,
            operationalPercentage: ((operational / total) * 100).toFixed(1),
            warningPercentage: ((warning / total) * 100).toFixed(1),
            criticalPercentage: ((critical / total) * 100).toFixed(1)
        };
    }

    updateAllAssets() {
        // Simulate real-time updates for all assets
        this.assets.forEach(asset => asset.updateRealTimeData());
    }

    // Simulate Maximo Work Order Creation
    createWorkOrder(assetId, priority = 'Medium') {
        const asset = this.getAssetById(assetId);
        if (asset) {
            asset.workOrders++;
            return {
                workOrderNum: `WO-${Date.now()}`,
                assetNum: asset.assetNum,
                description: `Maintenance required for ${asset.type} at ${asset.station}`,
                priority: priority,
                status: 'Open',
                createdDate: new Date().toISOString(),
                assignedTo: 'Maintenance Team ' + (Math.floor(Math.random() * 5) + 1)
            };
        }
        return null;
    }

    // Get asset health score (0-100)
    getAssetHealthScore(assetId) {
        const asset = this.getAssetById(assetId);
        if (!asset) return 0;

        let score = 100;
        
        // Deduct points based on status
        if (asset.status.status === 'Warning') score -= 20;
        if (asset.status.status === 'Critical') score -= 50;
        
        // Deduct points based on age
        const installYear = new Date(asset.installDate).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - installYear;
        score -= Math.min(age * 2, 30);
        
        // Deduct points based on work orders
        score -= Math.min(asset.workOrders * 0.5, 20);
        
        return Math.max(0, Math.floor(score));
    }
}

export { assetTypes, tubeLines, stations, statusTypes };

// Made with Bob
