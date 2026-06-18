// Scenario Simulator - Simulate various situations and their cascading effects

export class ScenarioSimulator {
    constructor(maximoData, alertSystem) {
        this.maximoData = maximoData;
        this.alertSystem = alertSystem;
        this.activeScenarios = [];
        this.scenarioEffects = new Map();
    }

    // Predefined scenarios
    static scenarios = {
        POWER_OUTAGE: {
            name: 'Power Outage',
            icon: '⚡',
            description: 'Simulate power loss in selected area',
            affectedAssetTypes: ['Power Supply', 'Lift', 'Escalator', 'CCTV', 'Ticket Machine', 'Platform Door'],
            effects: {
                immediate: ['Power Supply goes critical', 'Lifts stop', 'Escalators stop'],
                delayed: ['CCTV offline', 'Ticket machines offline', 'Platform doors manual'],
                cascading: ['Increased crowding', 'Security concerns', 'Evacuation may be needed']
            }
        },
        SIGNAL_FAILURE: {
            name: 'Signal Failure',
            icon: '🚦',
            description: 'Simulate signal system malfunction',
            affectedAssetTypes: ['Signal', 'Train'],
            effects: {
                immediate: ['Signals go to red', 'Trains stop'],
                delayed: ['Train delays accumulate', 'Platform overcrowding'],
                cascading: ['Service disruption', 'Passenger complaints', 'Alternative routes needed']
            }
        },
        FLOODING: {
            name: 'Flooding',
            icon: '🌊',
            description: 'Simulate water ingress',
            affectedAssetTypes: ['Track', 'Power Supply', 'Escalator', 'Lift'],
            effects: {
                immediate: ['Track flooding', 'Power systems at risk'],
                delayed: ['Escalators stop', 'Lifts stop', 'Station closure'],
                cascading: ['Service suspension', 'Emergency evacuation', 'Structural damage risk']
            }
        },
        FIRE_ALARM: {
            name: 'Fire Alarm',
            icon: '🔥',
            description: 'Simulate fire detection',
            affectedAssetTypes: ['Ventilation', 'Platform Door', 'Train'],
            effects: {
                immediate: ['Ventilation to emergency mode', 'Platform doors open'],
                delayed: ['Train service stopped', 'Evacuation initiated'],
                cascading: ['Station closure', 'Emergency services called', 'Passenger safety priority']
            }
        },
        EXTREME_HEAT: {
            name: 'Extreme Heat',
            icon: '🌡️',
            description: 'Simulate heat wave conditions',
            affectedAssetTypes: ['Train', 'Track', 'Power Supply', 'Ventilation'],
            effects: {
                immediate: ['Track expansion', 'Speed restrictions'],
                delayed: ['Train cooling issues', 'Power demand spike', 'Ventilation overload'],
                cascading: ['Service delays', 'Passenger discomfort', 'Equipment failures']
            }
        },
        OVERCROWDING: {
            name: 'Overcrowding',
            icon: '👥',
            description: 'Simulate peak hour overcrowding',
            affectedAssetTypes: ['Escalator', 'Lift', 'Platform Door', 'Ticket Machine'],
            effects: {
                immediate: ['Platform capacity reached', 'Entry restrictions'],
                delayed: ['Escalator overload', 'Ticket machine queues', 'Platform door delays'],
                cascading: ['Service delays', 'Safety concerns', 'Alternative routes needed']
            }
        },
        TRACK_FAULT: {
            name: 'Track Fault',
            icon: '🛤️',
            description: 'Simulate track defect',
            affectedAssetTypes: ['Track', 'Train', 'Signal'],
            effects: {
                immediate: ['Track section closed', 'Signals to danger'],
                delayed: ['Train diversions', 'Speed restrictions', 'Service delays'],
                cascading: ['Maintenance required', 'Service disruption', 'Passenger delays']
            }
        },
        SECURITY_INCIDENT: {
            name: 'Security Incident',
            icon: '🚨',
            description: 'Simulate security alert',
            affectedAssetTypes: ['CCTV', 'Platform Door', 'Train'],
            effects: {
                immediate: ['CCTV monitoring increased', 'Platform doors held'],
                delayed: ['Train service stopped', 'Station lockdown'],
                cascading: ['Police called', 'Evacuation possible', 'Service suspension']
            }
        }
    };

    // Simulate a scenario at specific stations
    simulateScenario(scenarioType, affectedStations, duration = 300000) { // 5 minutes default
        const scenario = ScenarioSimulator.scenarios[scenarioType];
        if (!scenario) return null;

        const scenarioId = `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const activeScenario = {
            id: scenarioId,
            type: scenarioType,
            name: scenario.name,
            icon: scenario.icon,
            stations: affectedStations,
            startTime: Date.now(),
            duration: duration,
            phase: 'immediate', // immediate, delayed, cascading
            affectedAssets: []
        };

        // Apply immediate effects
        this.applyScenarioEffects(activeScenario, scenario);
        
        // Create alert
        this.alertSystem.addAlert(
            scenarioType,
            this.getAlertCategory(scenarioType),
            affectedStations[0],
            scenario.description,
            affectedStations
        );

        this.activeScenarios.push(activeScenario);
        this.scenarioEffects.set(scenarioId, scenario);

        // Schedule phase transitions
        setTimeout(() => this.transitionPhase(scenarioId, 'delayed'), 30000); // 30 seconds
        setTimeout(() => this.transitionPhase(scenarioId, 'cascading'), 60000); // 1 minute
        setTimeout(() => this.endScenario(scenarioId), duration);

        return activeScenario;
    }

    getAlertCategory(scenarioType) {
        const categoryMap = {
            POWER_OUTAGE: 'EMERGENCY',
            SIGNAL_FAILURE: 'OPERATIONAL',
            FLOODING: 'EMERGENCY',
            FIRE_ALARM: 'EMERGENCY',
            EXTREME_HEAT: 'WEATHER',
            OVERCROWDING: 'OPERATIONAL',
            TRACK_FAULT: 'OPERATIONAL',
            SECURITY_INCIDENT: 'EMERGENCY'
        };
        return categoryMap[scenarioType] || 'OPERATIONAL';
    }

    applyScenarioEffects(activeScenario, scenario) {
        const assets = this.maximoData.getAssets();
        
        // Find assets at affected stations
        const affectedAssets = assets.filter(asset => 
            activeScenario.stations.includes(asset.station) &&
            scenario.affectedAssetTypes.includes(asset.type)
        );

        // Apply effects based on scenario type and phase
        affectedAssets.forEach(asset => {
            const originalStatus = asset.status.status;
            
            switch (activeScenario.phase) {
                case 'immediate':
                    // 50% chance of warning, 30% critical
                    if (Math.random() < 0.3) {
                        asset.status = { status: 'Critical', color: 0xf44336 };
                    } else if (Math.random() < 0.5) {
                        asset.status = { status: 'Warning', color: 0xff9800 };
                    }
                    break;
                    
                case 'delayed':
                    // 70% chance of critical, 20% warning
                    if (Math.random() < 0.7) {
                        asset.status = { status: 'Critical', color: 0xf44336 };
                    } else if (Math.random() < 0.2) {
                        asset.status = { status: 'Warning', color: 0xff9800 };
                    }
                    break;
                    
                case 'cascading':
                    // 90% chance of critical
                    if (Math.random() < 0.9) {
                        asset.status = { status: 'Critical', color: 0xf44336 };
                    }
                    break;
            }

            // Modify sensor readings based on scenario
            this.modifySensorReadings(asset, activeScenario.type);

            if (!activeScenario.affectedAssets.find(a => a.id === asset.id)) {
                activeScenario.affectedAssets.push({
                    id: asset.id,
                    originalStatus: originalStatus,
                    asset: asset
                });
            }
        });
    }

    modifySensorReadings(asset, scenarioType) {
        switch (scenarioType) {
            case 'POWER_OUTAGE':
                asset.powerConsumption = '0.0';
                asset.temperature = (parseFloat(asset.temperature) - 5).toFixed(1);
                break;
                
            case 'EXTREME_HEAT':
                asset.temperature = (parseFloat(asset.temperature) + 15).toFixed(1);
                asset.powerConsumption = (parseFloat(asset.powerConsumption) * 1.5).toFixed(1);
                break;
                
            case 'FLOODING':
                asset.temperature = (parseFloat(asset.temperature) - 10).toFixed(1);
                asset.vibration = (parseFloat(asset.vibration) * 2).toFixed(2);
                break;
                
            case 'SIGNAL_FAILURE':
                asset.powerConsumption = (parseFloat(asset.powerConsumption) * 0.5).toFixed(1);
                break;
                
            case 'FIRE_ALARM':
                asset.temperature = (parseFloat(asset.temperature) + 20).toFixed(1);
                asset.powerConsumption = (parseFloat(asset.powerConsumption) * 1.8).toFixed(1);
                break;
                
            case 'OVERCROWDING':
                asset.utilizationRate = Math.min(100, asset.utilizationRate + 30);
                asset.vibration = (parseFloat(asset.vibration) * 1.5).toFixed(2);
                break;
                
            case 'TRACK_FAULT':
                asset.vibration = (parseFloat(asset.vibration) * 3).toFixed(2);
                break;
        }
    }

    transitionPhase(scenarioId, newPhase) {
        const scenario = this.activeScenarios.find(s => s.id === scenarioId);
        if (!scenario) return;

        scenario.phase = newPhase;
        const scenarioData = this.scenarioEffects.get(scenarioId);
        
        if (scenarioData) {
            this.applyScenarioEffects(scenario, scenarioData);
        }
    }

    endScenario(scenarioId) {
        const scenarioIndex = this.activeScenarios.findIndex(s => s.id === scenarioId);
        if (scenarioIndex === -1) return;

        const scenario = this.activeScenarios[scenarioIndex];
        
        // Restore assets to operational (with some still in warning)
        scenario.affectedAssets.forEach(({ asset }) => {
            // 70% back to operational, 30% remain in warning
            if (Math.random() < 0.7) {
                asset.status = { status: 'Operational', color: 0x4caf50 };
            } else {
                asset.status = { status: 'Warning', color: 0xff9800 };
            }
        });

        this.activeScenarios.splice(scenarioIndex, 1);
        this.scenarioEffects.delete(scenarioId);
    }

    getActiveScenarios() {
        return this.activeScenarios;
    }

    getScenarioById(scenarioId) {
        return this.activeScenarios.find(s => s.id === scenarioId);
    }

    stopScenario(scenarioId) {
        this.endScenario(scenarioId);
    }

    stopAllScenarios() {
        [...this.activeScenarios].forEach(scenario => {
            this.endScenario(scenario.id);
        });
    }
}

export default ScenarioSimulator;

// Made with Bob
