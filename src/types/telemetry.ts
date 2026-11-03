/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MachineStatus = 'nominal' | 'warning' | 'alert';

export interface SensorChannel {
  id: string;
  name: string;
  channel: string;
  value: number;
  unit: string;
  thresholdWarn: number;
  thresholdTrip: number;
  status: MachineStatus;
  sampleRate: string;
  locationPoint: string;
}

export interface SubAssembly {
  name: string;
  status: MachineStatus;
  temp: number;
  vibration: number;
  notes: string;
}

export interface MachineNode {
  id: string;
  name: string;
  category: 'Turbine' | 'CNC Machine' | 'Cryo Pump' | 'Robotics' | 'Furnace' | 'Compressor';
  location: string;
  status: MachineStatus;
  healthScore: number;
  vibration: number; // mm/s
  vibrationTrend: number[];
  thermalLoad: number; // °C
  thermalTrend: number[];
  pressure: number; // bar
  pressureTrend: number[];
  rpm: number; // RPM
  rpmTrend: number[];
  powerDraw: number; // kW
  powerTrend: number[];
  edgeLatency: number; // ms
  lastHeartbeat: string;
  edgeGateway: string;
  uptimeHours: number;
  firmwareVersion: string;
  serialNumber: string;
  calibrationDue: string;
  sensors: SensorChannel[];
  subassemblies: SubAssembly[];
}

export interface TelemetryAlert {
  id: string;
  timestamp: string;
  machineId: string;
  machineName: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  metricValue: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  conditionMetric: 'vibration' | 'thermalLoad' | 'pressure' | 'rpm' | 'edgeLatency';
  operator: '>' | '<' | '>=' | '<=';
  threshold: number;
  unit: string;
  durationSeconds: number;
  targetMachineId: string; // Machine ID or 'ALL'
  actionDescription: string;
  actionType: 'throttle' | 'interlock' | 'coolant_boost' | 'purge' | 'notify';
  safetyLevel: 'Level 1 Info' | 'Level 2 Auto-Mitigate' | 'Level 3 Scram Interlock';
  isActive: boolean;
  executionCount: number;
  lastTriggered?: string;
}

export interface EdgeGateway {
  id: string;
  hostname: string;
  ipAddress: string;
  location: string;
  activeNodes: number;
  cpuUsage: number;
  memoryUsage: number;
  packetLossRate: number;
  status: MachineStatus;
  rulesSynchronized: boolean;
  lastSync: string;
}

export interface CalibrationRecord {
  id: string;
  machineId: string;
  sensorId: string;
  sensorName: string;
  date: string;
  technician: string;
  certificateNo: string;
  driftPercentage: number;
  status: 'passed' | 'recalibrated' | 'pending';
  nextDue: string;
  notes: string;
}
