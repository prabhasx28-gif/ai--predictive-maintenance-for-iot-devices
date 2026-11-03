/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MachineNode, TelemetryAlert, AutomationRule, EdgeGateway, CalibrationRecord } from '../types/telemetry';

export const INITIAL_MACHINES: MachineNode[] = [
  {
    id: 'TRB-409X',
    name: 'TRB-409X Gas Turbine Generator',
    category: 'Turbine',
    location: 'Cleanroom Alpha · Bay 04',
    status: 'nominal',
    healthScore: 98.4,
    vibration: 2.14,
    vibrationTrend: [2.05, 2.10, 2.12, 2.18, 2.14, 2.15, 2.11, 2.16, 2.14],
    thermalLoad: 72.8,
    thermalTrend: [71.2, 71.8, 72.0, 72.5, 72.9, 73.1, 72.6, 72.8],
    pressure: 34.2,
    pressureTrend: [34.0, 34.1, 34.3, 34.2, 34.4, 34.1, 34.2],
    rpm: 12450,
    rpmTrend: [12400, 12420, 12450, 12460, 12450, 12440, 12450],
    powerDraw: 840.5,
    powerTrend: [835.0, 838.2, 842.1, 840.5, 841.0, 839.8, 840.5],
    edgeLatency: 1.4,
    lastHeartbeat: 'Just now',
    edgeGateway: 'GW-ALPHA-01',
    uptimeHours: 4120.5,
    firmwareVersion: 'v4.18.2-rtos',
    serialNumber: 'EP-TURB-2024-00918',
    calibrationDue: '2026-12-15',
    sensors: [
      { id: 'SN-01', name: 'Front Radial Bearing Transducer', channel: 'CH-1', value: 2.14, unit: 'mm/s', thresholdWarn: 4.2, thresholdTrip: 6.0, status: 'nominal', sampleRate: '10 kHz', locationPoint: 'Journal Bearing 1' },
      { id: 'SN-02', name: 'High-Pressure Stator Thermocouple', channel: 'CH-2', value: 72.8, unit: '°C', thresholdWarn: 88.0, thresholdTrip: 105.0, status: 'nominal', sampleRate: '1 kHz', locationPoint: 'Stator Winding Ring' },
      { id: 'SN-03', name: 'Hydraulic Lube Oil Pressure Manifold', channel: 'CH-3', value: 34.2, unit: 'bar', thresholdWarn: 28.0, thresholdTrip: 24.0, status: 'nominal', sampleRate: '500 Hz', locationPoint: 'Lube Oil Supply' },
      { id: 'SN-04', name: 'Combustor Acoustic Resonator', channel: 'CH-4', value: 118.4, unit: 'dB', thresholdWarn: 130.0, thresholdTrip: 142.0, status: 'nominal', sampleRate: '20 kHz', locationPoint: 'Combustor Can 3' },
      { id: 'SN-05', name: 'Optical Shaft Speed Tachometer', channel: 'CH-5', value: 12450, unit: 'RPM', thresholdWarn: 13200, thresholdTrip: 14000, status: 'nominal', sampleRate: '50 kHz', locationPoint: 'Main Rotor Shaft' },
    ],
    subassemblies: [
      { name: 'Front Journal Bearing Array', status: 'nominal', temp: 64.2, vibration: 1.88, notes: 'Oil film dynamic pressure nominal.' },
      { name: 'Centrifugal Compressor Stage', status: 'nominal', temp: 72.8, vibration: 2.14, notes: 'Blade pass frequency harmonics in check.' },
      { name: 'Dry Low-NOx Combustion Ring', status: 'nominal', temp: 685.0, vibration: 2.45, notes: 'Flame ionization detector active.' },
      { name: 'Single-Shaft Expander Runner', status: 'nominal', temp: 540.2, vibration: 2.21, notes: 'Thermal expansion clearances nominal.' },
      { name: 'Main Thrust Bearing Housing', status: 'nominal', temp: 68.4, vibration: 1.95, notes: 'Axial displacement < 0.04 mm.' }
    ]
  },
  {
    id: 'CNC-880M',
    name: 'CNC-880M 5-Axis Precision Mill',
    category: 'CNC Machine',
    location: 'Fabrication Cell · Bay 02',
    status: 'warning',
    healthScore: 86.2,
    vibration: 4.62,
    vibrationTrend: [3.2, 3.5, 3.8, 4.1, 4.4, 4.5, 4.62],
    thermalLoad: 84.6,
    thermalTrend: [74.0, 77.2, 80.1, 82.3, 83.9, 84.6],
    pressure: 18.5,
    pressureTrend: [18.2, 18.4, 18.5, 18.5, 18.6, 18.5],
    rpm: 18200,
    rpmTrend: [18000, 18100, 18200, 18200, 18150, 18200],
    powerDraw: 42.8,
    powerTrend: [38.2, 39.5, 41.0, 42.1, 42.8],
    edgeLatency: 2.1,
    lastHeartbeat: 'Just now',
    edgeGateway: 'GW-ALPHA-01',
    uptimeHours: 1980.2,
    firmwareVersion: 'v5.04.1-rtos',
    serialNumber: 'EP-CNC-2025-01042',
    calibrationDue: '2026-11-20',
    sensors: [
      { id: 'SN-11', name: 'Spindle Dual-Axis Accelerometer', channel: 'CH-1', value: 4.62, unit: 'mm/s', thresholdWarn: 4.5, thresholdTrip: 6.8, status: 'warning', sampleRate: '25 kHz', locationPoint: 'Spindle Nose C-Axis' },
      { id: 'SN-12', name: 'Ceramic Bearing Thermal Core', channel: 'CH-2', value: 84.6, unit: '°C', thresholdWarn: 82.0, thresholdTrip: 95.0, status: 'warning', sampleRate: '1 kHz', locationPoint: 'Spindle Housing' },
      { id: 'SN-13', name: 'Flood Coolant Delivery Pressure', channel: 'CH-3', value: 18.5, unit: 'bar', thresholdWarn: 14.0, thresholdTrip: 10.0, status: 'nominal', sampleRate: '200 Hz', locationPoint: 'Internal Nozzle Array' },
      { id: 'SN-14', name: 'Linear Optical Scale X-Axis', channel: 'CH-4', value: 0.003, unit: 'mm', thresholdWarn: 0.008, thresholdTrip: 0.015, status: 'nominal', sampleRate: '100 kHz', locationPoint: 'Saddle Guide' },
    ],
    subassemblies: [
      { name: 'Direct-Drive High Speed Spindle', status: 'warning', temp: 84.6, vibration: 4.62, notes: 'Bearing preload temperature exceeding secondary advisory.' },
      { name: 'X/Y/Z Linear Magnetics', status: 'nominal', temp: 42.1, vibration: 1.12, notes: 'Positional drift within 2 microns.' },
      { name: 'High-Pressure Through-Spindle Coolant', status: 'nominal', temp: 22.0, vibration: 0.84, notes: 'Filter differential pressure acceptable.' }
    ]
  },
  {
    id: 'CRYO-P2',
    name: 'CRYO-P2 Cryogenic Transfer Pump',
    category: 'Cryo Pump',
    location: 'Cryogenics Facility · Sector D',
    status: 'nominal',
    healthScore: 99.1,
    vibration: 1.05,
    vibrationTrend: [1.02, 1.04, 1.01, 1.06, 1.05, 1.05],
    thermalLoad: -182.4,
    thermalTrend: [-181.8, -182.0, -182.3, -182.5, -182.4],
    pressure: 68.4,
    pressureTrend: [68.0, 68.2, 68.5, 68.3, 68.4],
    rpm: 3600,
    rpmTrend: [3600, 3600, 3600, 3600, 3600],
    powerDraw: 112.0,
    powerTrend: [110.5, 111.2, 112.0, 111.8, 112.0],
    edgeLatency: 1.8,
    lastHeartbeat: 'Just now',
    edgeGateway: 'GW-BETA-02',
    uptimeHours: 8740.0,
    firmwareVersion: 'v3.90.0-rtos',
    serialNumber: 'EP-CRYO-2023-00431',
    calibrationDue: '2027-01-10',
    sensors: [
      { id: 'SN-21', name: 'Cold-End Magnetic Levitation Gap', channel: 'CH-1', value: 0.35, unit: 'mm', thresholdWarn: 0.60, thresholdTrip: 0.85, status: 'nominal', sampleRate: '10 kHz', locationPoint: 'Mag-Lev Stator' },
      { id: 'SN-22', name: 'Liquid Argon Cryostat Core', channel: 'CH-2', value: -182.4, unit: '°C', thresholdWarn: -170.0, thresholdTrip: -150.0, status: 'nominal', sampleRate: '100 Hz', locationPoint: 'Cryo-Chamber' },
      { id: 'SN-23', name: 'Discharge Mass Flow Transducer', channel: 'CH-3', value: 68.4, unit: 'bar', thresholdWarn: 55.0, thresholdTrip: 45.0, status: 'nominal', sampleRate: '1 kHz', locationPoint: 'Outlet Header' }
    ],
    subassemblies: [
      { name: 'Superconducting Mag-Bearing', status: 'nominal', temp: -182.4, vibration: 0.42, notes: 'Zero mechanical friction detected.' },
      { name: 'Multi-Stage Inconel Impeller', status: 'nominal', temp: -180.0, vibration: 1.05, notes: 'Cavitation suppression coefficient 1.00.' }
    ]
  },
  {
    id: 'ROB-ARM-03',
    name: 'ROB-ARM-03 6-Axis Collaborative Arm',
    category: 'Robotics',
    location: 'Assembly Cell 01 · Bay 01',
    status: 'nominal',
    healthScore: 97.5,
    vibration: 1.82,
    vibrationTrend: [1.70, 1.75, 1.80, 1.85, 1.82],
    thermalLoad: 46.2,
    thermalTrend: [44.0, 45.1, 45.8, 46.2],
    pressure: 6.2,
    pressureTrend: [6.1, 6.2, 6.2, 6.2],
    rpm: 240,
    rpmTrend: [220, 230, 240, 240],
    powerDraw: 3.4,
    powerTrend: [3.1, 3.2, 3.4, 3.4],
    edgeLatency: 0.9,
    lastHeartbeat: 'Just now',
    edgeGateway: 'GW-ALPHA-01',
    uptimeHours: 3200.4,
    firmwareVersion: 'v6.1.0-rtos',
    serialNumber: 'EP-ROB-2025-00772',
    calibrationDue: '2026-12-01',
    sensors: [
      { id: 'SN-31', name: 'Joint 4 Harmonic Drive Strain Gauge', channel: 'CH-1', value: 1.82, unit: 'mm/s', thresholdWarn: 3.5, thresholdTrip: 5.0, status: 'nominal', sampleRate: '10 kHz', locationPoint: 'Wrist Flexure' },
      { id: 'SN-32', name: 'Servo Motor Stator Thermistor', channel: 'CH-2', value: 46.2, unit: '°C', thresholdWarn: 65.0, thresholdTrip: 78.0, status: 'nominal', sampleRate: '500 Hz', locationPoint: 'Joint 2 Shoulder' }
    ],
    subassemblies: [
      { name: 'Harmonic Drive Gearsets', status: 'nominal', temp: 46.2, vibration: 1.82, notes: 'Backlash < 0.01 arcmin.' },
      { name: 'Pneumatic Micro-Gripper', status: 'nominal', temp: 24.0, vibration: 0.20, notes: 'Vacuum seal integrity verified.' }
    ]
  },
  {
    id: 'IND-FRN-7',
    name: 'IND-FRN-7 Induction Sintering Furnace',
    category: 'Furnace',
    location: 'Thermal Processing · Sector B',
    status: 'alert',
    healthScore: 74.0,
    vibration: 3.10,
    vibrationTrend: [2.5, 2.7, 2.9, 3.1],
    thermalLoad: 1420.5,
    thermalTrend: [1360, 1380, 1405, 1420.5],
    pressure: 0.04, // Torr
    pressureTrend: [0.02, 0.02, 0.03, 0.04],
    rpm: 0,
    rpmTrend: [0, 0, 0, 0],
    powerDraw: 1450.0,
    powerTrend: [1390, 1420, 1445, 1450],
    edgeLatency: 3.4,
    lastHeartbeat: 'Just now',
    edgeGateway: 'GW-RACK-04',
    uptimeHours: 540.2,
    firmwareVersion: 'v2.8.4-rtos',
    serialNumber: 'EP-FRN-2026-00019',
    calibrationDue: '2026-11-15',
    sensors: [
      { id: 'SN-41', name: 'Refractory Crucible Pyrometer Array', channel: 'CH-1', value: 1420.5, unit: '°C', thresholdWarn: 1380.0, thresholdTrip: 1450.0, status: 'alert', sampleRate: '1 kHz', locationPoint: 'Graphite Susceptor' },
      { id: 'SN-42', name: 'Chamber Turbo-Molecular Vacuum Gauge', channel: 'CH-2', value: 0.04, unit: 'mbar', thresholdWarn: 0.03, thresholdTrip: 0.05, status: 'warning', sampleRate: '100 Hz', locationPoint: 'Vacuum Plenum' },
      { id: 'SN-43', name: 'Induction Coil RF Current Monitor', channel: 'CH-3', value: 1450.0, unit: 'kW', thresholdWarn: 1400.0, thresholdTrip: 1550.0, status: 'alert', sampleRate: '10 kHz', locationPoint: 'Copper Resonator Coils' }
    ],
    subassemblies: [
      { name: 'Water-Cooled Induction Coil', status: 'alert', temp: 88.4, vibration: 3.10, notes: 'Deionized coolant loop return temp high.' },
      { name: 'Graphite Thermal Insulation Felt', status: 'warning', temp: 1420.5, vibration: 0.10, notes: 'Degradation detected via pyrometer delta.' }
    ]
  },
  {
    id: 'CMP-STG-2',
    name: 'CMP-STG-2 Dual-Piston Air Compressor',
    category: 'Compressor',
    location: 'Utility Infrastructure · Bay 06',
    status: 'nominal',
    healthScore: 94.8,
    vibration: 2.85,
    vibrationTrend: [2.80, 2.82, 2.86, 2.84, 2.85],
    thermalLoad: 68.1,
    thermalTrend: [67.0, 67.5, 68.0, 68.1],
    pressure: 12.4,
    pressureTrend: [12.2, 12.3, 12.5, 12.4],
    rpm: 1750,
    rpmTrend: [1750, 1750, 1750, 1750],
    powerDraw: 75.0,
    powerTrend: [74.0, 74.8, 75.0, 75.0],
    edgeLatency: 1.2,
    lastHeartbeat: 'Just now',
    edgeGateway: 'GW-BETA-02',
    uptimeHours: 6120.8,
    firmwareVersion: 'v4.02.1-rtos',
    serialNumber: 'EP-CMP-2024-00188',
    calibrationDue: '2026-12-28',
    sensors: [
      { id: 'SN-51', name: 'Intercooler Stage 2 Pressure Sensor', channel: 'CH-1', value: 12.4, unit: 'bar', thresholdWarn: 14.5, thresholdTrip: 16.0, status: 'nominal', sampleRate: '500 Hz', locationPoint: 'High-Pressure Discharge' },
      { id: 'SN-52', name: 'Crankcase Temperature Sensor', channel: 'CH-2', value: 68.1, unit: '°C', thresholdWarn: 80.0, thresholdTrip: 92.0, status: 'nominal', sampleRate: '100 Hz', locationPoint: 'Oil Reservoir' }
    ],
    subassemblies: [
      { name: 'Twin Cast-Iron Compression Cylinders', status: 'nominal', temp: 68.1, vibration: 2.85, notes: 'Valve sealing dynamic response optimal.' },
      { name: 'Aftercooler Condensate Trap', status: 'nominal', temp: 32.0, vibration: 0.15, notes: 'Auto-drain cycle cycling every 15 min.' }
    ]
  }
];

export const INITIAL_ALERTS: TelemetryAlert[] = [
  {
    id: 'ALT-1098',
    timestamp: '10:12:44',
    machineId: 'IND-FRN-7',
    machineName: 'IND-FRN-7 Induction Sintering Furnace',
    severity: 'critical',
    title: 'Crucible Pyrometer Array Exceeded High Limit',
    description: 'Refractory core thermal load measured 1420.5°C vs 1380.0°C maximum operational envelope. Coolant delta rising.',
    metricValue: '1420.5 °C',
    acknowledged: false,
  },
  {
    id: 'ALT-1097',
    timestamp: '10:08:12',
    machineId: 'CNC-880M',
    machineName: 'CNC-880M 5-Axis Precision Mill',
    severity: 'warning',
    title: 'Spindle Bearing Thermal Load Approaching Limit',
    description: 'Ceramic bearing telemetry reads 84.6°C (threshold: 82.0°C). Vibration velocity harmonic at 4.62 mm/s.',
    metricValue: '84.6 °C / 4.62 mm/s',
    acknowledged: false,
  },
  {
    id: 'ALT-1096',
    timestamp: '09:45:00',
    machineId: 'TRB-409X',
    machineName: 'TRB-409X Gas Turbine Generator',
    severity: 'info',
    title: 'Automated Harmonic Calibration Routine Completed',
    description: 'Edge Gateway GW-ALPHA-01 synchronized 10 kHz vibration fast-Fourier envelope. System running nominal.',
    metricValue: '2.14 mm/s',
    acknowledged: true,
    acknowledgedBy: 'J. Mercer (Lead Systems Engineer)',
    acknowledgedAt: '09:47:18'
  },
  {
    id: 'ALT-1095',
    timestamp: '08:30:19',
    machineId: 'CRYO-P2',
    machineName: 'CRYO-P2 Cryogenic Transfer Pump',
    severity: 'info',
    title: 'Mag-Lev Rotor Levitation Check Nominal',
    description: 'Superconducting magnetic suspension clearance recalibrated to 0.35 mm.',
    metricValue: '0.35 mm',
    acknowledged: true,
    acknowledgedBy: 'K. Patel (Cryo Ops)',
    acknowledgedAt: '08:35:02'
  }
];

export const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'RUL-01',
    name: 'Emergency Vibration Scram Interlock',
    conditionMetric: 'vibration',
    operator: '>=',
    threshold: 6.0,
    unit: 'mm/s',
    durationSeconds: 1.5,
    targetMachineId: 'ALL',
    actionDescription: 'Trip main emergency breaker, disconnect generator excitation, and latch scram alarm.',
    actionType: 'interlock',
    safetyLevel: 'Level 3 Scram Interlock',
    isActive: true,
    executionCount: 0,
    lastTriggered: 'Never'
  },
  {
    id: 'RUL-02',
    name: 'Thermal Spike Auto-Throttle',
    conditionMetric: 'thermalLoad',
    operator: '>=',
    threshold: 82.0,
    unit: '°C',
    durationSeconds: 3.0,
    targetMachineId: 'CNC-880M',
    actionDescription: 'Reduce feed rate by 35% and engage high-pressure secondary spindle flood nozzle.',
    actionType: 'throttle',
    safetyLevel: 'Level 2 Auto-Mitigate',
    isActive: true,
    executionCount: 3,
    lastTriggered: 'Today 10:08:12'
  },
  {
    id: 'RUL-03',
    name: 'Hydraulic Pressure Low Trip Guard',
    conditionMetric: 'pressure',
    operator: '<=',
    threshold: 24.0,
    unit: 'bar',
    durationSeconds: 2.0,
    targetMachineId: 'TRB-409X',
    actionDescription: 'Start auxiliary DC emergency lube oil pump and broadcast Level 2 audio advisory.',
    actionType: 'coolant_boost',
    safetyLevel: 'Level 2 Auto-Mitigate',
    isActive: true,
    executionCount: 0,
    lastTriggered: 'Never'
  },
  {
    id: 'RUL-04',
    name: 'Induction Furnace Safety Curtailment',
    conditionMetric: 'thermalLoad',
    operator: '>=',
    threshold: 1400.0,
    unit: '°C',
    durationSeconds: 2.0,
    targetMachineId: 'IND-FRN-7',
    actionDescription: 'Throttle RF power output by 50% and increase chilled water manifold flow to 120 L/min.',
    actionType: 'throttle',
    safetyLevel: 'Level 2 Auto-Mitigate',
    isActive: true,
    executionCount: 2,
    lastTriggered: 'Today 10:12:44'
  },
  {
    id: 'RUL-05',
    name: 'Edge Network Latency Degradation Watch',
    conditionMetric: 'edgeLatency',
    operator: '>=',
    threshold: 5.0,
    unit: 'ms',
    durationSeconds: 5.0,
    targetMachineId: 'ALL',
    actionDescription: 'Switch RTOS telemetry bus to local Ring Buffer mode and notify Site Reliability Lead.',
    actionType: 'notify',
    safetyLevel: 'Level 1 Info',
    isActive: true,
    executionCount: 1,
    lastTriggered: 'Yesterday 16:22:04'
  }
];

export const INITIAL_GATEWAYS: EdgeGateway[] = [
  {
    id: 'GW-ALPHA-01',
    hostname: 'edge-rtos-alpha-01.cleanroom.internal',
    ipAddress: '10.240.12.10',
    location: 'Cleanroom Alpha · Rack A1',
    activeNodes: 3,
    cpuUsage: 14.8,
    memoryUsage: 28.4,
    packetLossRate: 0.000,
    status: 'nominal',
    rulesSynchronized: true,
    lastSync: '12 seconds ago'
  },
  {
    id: 'GW-BETA-02',
    hostname: 'edge-rtos-beta-02.cryo.internal',
    ipAddress: '10.240.12.22',
    location: 'Sector D · Rack B2',
    activeNodes: 2,
    cpuUsage: 9.2,
    memoryUsage: 21.6,
    packetLossRate: 0.000,
    status: 'nominal',
    rulesSynchronized: true,
    lastSync: '18 seconds ago'
  },
  {
    id: 'GW-RACK-04',
    hostname: 'edge-rtos-rack04.furnace.internal',
    ipAddress: '10.240.14.04',
    location: 'Thermal Bay · Rack C4',
    activeNodes: 1,
    cpuUsage: 38.6,
    memoryUsage: 44.1,
    packetLossRate: 0.012,
    status: 'warning',
    rulesSynchronized: true,
    lastSync: '4 seconds ago'
  }
];

export const INITIAL_CALIBRATIONS: CalibrationRecord[] = [
  {
    id: 'CAL-2026-081',
    machineId: 'TRB-409X',
    sensorId: 'SN-01',
    sensorName: 'Front Radial Bearing Transducer',
    date: '2026-09-14',
    technician: 'Marcus Vance, PE (NIST Cert #9921)',
    certificateNo: 'NIST-2026-EP-88419',
    driftPercentage: 0.04,
    status: 'passed',
    nextDue: '2026-12-15',
    notes: 'Zero point verified at 0.000 mm/s with optical calibration rig.'
  },
  {
    id: 'CAL-2026-082',
    machineId: 'TRB-409X',
    sensorId: 'SN-02',
    sensorName: 'High-Pressure Stator Thermocouple',
    date: '2026-09-14',
    technician: 'Marcus Vance, PE (NIST Cert #9921)',
    certificateNo: 'NIST-2026-EP-88420',
    driftPercentage: 0.12,
    status: 'passed',
    nextDue: '2026-12-15',
    notes: 'Calibrated against platinum RTD standard reference thermometer.'
  },
  {
    id: 'CAL-2026-077',
    machineId: 'CNC-880M',
    sensorId: 'SN-11',
    sensorName: 'Spindle Dual-Axis Accelerometer',
    date: '2026-08-20',
    technician: 'Elena Rostova (Metrology Specialist)',
    certificateNo: 'ISO17025-2026-4412',
    driftPercentage: 1.84,
    status: 'recalibrated',
    nextDue: '2026-11-20',
    notes: 'Recalibrated bias offset by -0.08 mm/s due to mechanical settlement.'
  },
  {
    id: 'CAL-2026-065',
    machineId: 'IND-FRN-7',
    sensorId: 'SN-41',
    sensorName: 'Refractory Crucible Pyrometer Array',
    date: '2026-08-15',
    technician: 'T. Halloway (Thermal Instrumentation)',
    certificateNo: 'NIST-2026-EP-77140',
    driftPercentage: 2.15,
    status: 'recalibrated',
    nextDue: '2026-11-15',
    notes: 'Spectral emissivity coefficient adjusted from 0.88 to 0.91.'
  }
];
