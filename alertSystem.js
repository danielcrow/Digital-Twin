// Weather and Emergency Alert System for London Underground

export const alertTypes = {
    WEATHER: {
        SEVERE_WEATHER: { icon: '⛈️', color: '#ff6b6b', severity: 'high' },
        HEAVY_RAIN: { icon: '🌧️', color: '#4a90e2', severity: 'medium' },
        SNOW: { icon: '❄️', color: '#74b9ff', severity: 'medium' },
        HEAT_WAVE: { icon: '🌡️', color: '#ff9f43', severity: 'medium' },
        WIND: { icon: '💨', color: '#95afc0', severity: 'low' },
        FOG: { icon: '🌫️', color: '#dfe6e9', severity: 'low' }
    },
    EMERGENCY: {
        FIRE: { icon: '🔥', color: '#e74c3c', severity: 'critical' },
        FLOOD: { icon: '🌊', color: '#3498db', severity: 'high' },
        POWER_OUTAGE: { icon: '⚡', color: '#f39c12', severity: 'high' },
        SECURITY: { icon: '🚨', color: '#e74c3c', severity: 'critical' },
        MEDICAL: { icon: '🏥', color: '#e74c3c', severity: 'high' },
        EVACUATION: { icon: '🚪', color: '#c0392b', severity: 'critical' }
    },
    OPERATIONAL: {
        SIGNAL_FAILURE: { icon: '🚦', color: '#f39c12', severity: 'medium' },
        TRACK_FAULT: { icon: '🛤️', color: '#e67e22', severity: 'medium' },
        TRAIN_DELAY: { icon: '⏱️', color: '#f39c12', severity: 'low' },
        OVERCROWDING: { icon: '👥', color: '#95a5a6', severity: 'low' },
        MAINTENANCE: { icon: '🔧', color: '#3498db', severity: 'low' }
    }
};

// London zones for weather coverage
const londonZones = [
    { name: 'Central London', center: [51.5074, -0.1278], radius: 3 },
    { name: 'North London', center: [51.5642, -0.1062], radius: 4 },
    { name: 'South London', center: [51.4545, -0.1084], radius: 4 },
    { name: 'East London', center: [51.5389, 0.0198], radius: 4 },
    { name: 'West London', center: [51.5074, -0.3278], radius: 4 }
];

class Alert {
    constructor(type, category, location, description, affectedStations = []) {
        this.id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.type = type;
        this.category = category;
        this.location = location;
        this.description = description;
        this.affectedStations = affectedStations;
        this.timestamp = new Date();
        this.active = true;
        this.severity = alertTypes[category][type].severity;
        this.icon = alertTypes[category][type].icon;
        this.color = alertTypes[category][type].color;
    }

    getAge() {
        return Math.floor((Date.now() - this.timestamp.getTime()) / 1000 / 60); // minutes
    }

    isExpired() {
        return this.getAge() > 60; // Expire after 60 minutes
    }
}

export class AlertSystem {
    constructor() {
        this.alerts = [];
        this.generateInitialAlerts();
    }

    generateInitialAlerts() {
        // Generate some initial alerts
        const initialAlerts = [
            {
                type: 'HEAVY_RAIN',
                category: 'WEATHER',
                location: 'Central London',
                description: 'Heavy rainfall affecting visibility and platform conditions',
                stations: ['King\'s Cross St. Pancras', 'Oxford Circus', 'Leicester Square']
            },
            {
                type: 'SIGNAL_FAILURE',
                category: 'OPERATIONAL',
                location: 'Northern Line',
                description: 'Signal failure causing delays between Camden Town and Euston',
                stations: ['Camden Town', 'Euston']
            }
        ];

        initialAlerts.forEach(alert => {
            this.alerts.push(new Alert(
                alert.type,
                alert.category,
                alert.location,
                alert.description,
                alert.stations
            ));
        });
    }

    getActiveAlerts() {
        // Remove expired alerts
        this.alerts = this.alerts.filter(alert => !alert.isExpired());
        return this.alerts.filter(alert => alert.active);
    }

    getAlertsByStation(stationName) {
        return this.getActiveAlerts().filter(alert => 
            alert.affectedStations.includes(stationName)
        );
    }

    getAlertsBySeverity(severity) {
        return this.getActiveAlerts().filter(alert => 
            alert.severity === severity
        );
    }

    addAlert(type, category, location, description, affectedStations = []) {
        const alert = new Alert(type, category, location, description, affectedStations);
        this.alerts.push(alert);
        return alert;
    }

    removeAlert(alertId) {
        const index = this.alerts.findIndex(alert => alert.id === alertId);
        if (index !== -1) {
            this.alerts.splice(index, 1);
            return true;
        }
        return false;
    }

    dismissAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.active = false;
            return true;
        }
        return false;
    }

    // Simulate random alerts appearing
    simulateRandomAlert() {
        const rand = Math.random();
        
        // 10% chance of new alert
        if (rand < 0.1) {
            const categories = Object.keys(alertTypes);
            const category = categories[Math.floor(Math.random() * categories.length)];
            const types = Object.keys(alertTypes[category]);
            const type = types[Math.floor(Math.random() * types.length)];
            
            const stations = [
                'King\'s Cross St. Pancras', 'Oxford Circus', 'Victoria', 
                'Liverpool Street', 'Waterloo', 'London Bridge', 'Paddington',
                'Bank', 'Stratford', 'Canary Wharf'
            ];
            
            const affectedCount = Math.floor(Math.random() * 3) + 1;
            const affectedStations = [];
            for (let i = 0; i < affectedCount; i++) {
                const station = stations[Math.floor(Math.random() * stations.length)];
                if (!affectedStations.includes(station)) {
                    affectedStations.push(station);
                }
            }
            
            const descriptions = {
                WEATHER: {
                    SEVERE_WEATHER: 'Severe weather conditions affecting operations',
                    HEAVY_RAIN: 'Heavy rainfall causing platform flooding risk',
                    SNOW: 'Snow accumulation affecting track conditions',
                    HEAT_WAVE: 'Extreme heat affecting equipment performance',
                    WIND: 'Strong winds affecting above-ground sections',
                    FOG: 'Dense fog reducing visibility'
                },
                EMERGENCY: {
                    FIRE: 'Fire alarm activated - evacuation in progress',
                    FLOOD: 'Flooding detected in station area',
                    POWER_OUTAGE: 'Power supply interruption',
                    SECURITY: 'Security incident - station temporarily closed',
                    MEDICAL: 'Medical emergency - delays expected',
                    EVACUATION: 'Emergency evacuation in progress'
                },
                OPERATIONAL: {
                    SIGNAL_FAILURE: 'Signal system malfunction causing delays',
                    TRACK_FAULT: 'Track defect detected - speed restrictions',
                    TRAIN_DELAY: 'Train delays due to operational issues',
                    OVERCROWDING: 'Station overcrowding - entry restrictions',
                    MAINTENANCE: 'Planned maintenance affecting service'
                }
            };
            
            const description = descriptions[category][type];
            const location = affectedStations[0];
            
            this.addAlert(type, category, location, description, affectedStations);
        }
    }

    getStatistics() {
        const active = this.getActiveAlerts();
        return {
            total: active.length,
            critical: active.filter(a => a.severity === 'critical').length,
            high: active.filter(a => a.severity === 'high').length,
            medium: active.filter(a => a.severity === 'medium').length,
            low: active.filter(a => a.severity === 'low').length,
            weather: active.filter(a => a.category === 'WEATHER').length,
            emergency: active.filter(a => a.category === 'EMERGENCY').length,
            operational: active.filter(a => a.category === 'OPERATIONAL').length
        };
    }

    // Get weather overlay data for map
    getWeatherOverlays() {
        const weatherAlerts = this.getActiveAlerts().filter(a => a.category === 'WEATHER');
        return weatherAlerts.map(alert => ({
            id: alert.id,
            type: alert.type,
            icon: alert.icon,
            color: alert.color,
            severity: alert.severity,
            location: alert.location,
            description: alert.description,
            affectedStations: alert.affectedStations,
            timestamp: alert.timestamp
        }));
    }
}

export default AlertSystem;

// Made with Bob
