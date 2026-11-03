/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  INITIAL_MACHINES,
  INITIAL_ALERTS,
  INITIAL_RULES,
  INITIAL_GATEWAYS,
  INITIAL_CALIBRATIONS,
} from './data/mockTelemetry';
import {
  MachineNode,
  TelemetryAlert,
  AutomationRule,
  EdgeGateway,
  CalibrationRecord,
  SensorChannel,
} from './types/telemetry';
import { Header } from './components/Header';
import { FleetMonitorView } from './views/FleetMonitorView';
import { MachineInspectorView } from './views/MachineInspectorView';
import { AutomationEngineView } from './views/AutomationEngineView';
import { AlarmEventsView } from './views/AlarmEventsView';
import { AssetCalibrationView } from './views/AssetCalibrationView';
import { EmergencyScramModal } from './components/EmergencyScramModal';
import { ZeroCalibrationModal } from './components/ZeroCalibrationModal';
import { DataPoint } from './components/LiveTelemetryChart';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('fleet');
  const [machines, setMachines] = useState<MachineNode[]>(INITIAL_MACHINES);
  const [selectedMachine, setSelectedMachine] = useState<MachineNode>(INITIAL_MACHINES[0]);
  const [alerts, setAlerts] = useState<TelemetryAlert[]>(INITIAL_ALERTS);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [gateways, setGateways] = useState<EdgeGateway[]>(INITIAL_GATEWAYS);
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>(INITIAL_CALIBRATIONS);

  // Streaming State
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamRateMs, setStreamRateMs] = useState<number>(1000);

  // Modals
  const [isScramModalOpen, setIsScramModalOpen] = useState<boolean>(false);
  const [activeCalibrateSensor, setActiveCalibrateSensor] = useState<SensorChannel | null>(null);

  // Live Chart rolling buffer
  const [chartData, setChartData] = useState<DataPoint[]>(() => {
    const pts: DataPoint[] = [];
    const now = Date.now();
    for (let i = 30; i >= 0; i--) {
      const timeMs = now - i * 1000;
      const d = new Date(timeMs);
      const timeStr = d.toTimeString().split(' ')[0];
      pts.push({
        time: timeStr,
        timestamp: timeMs,
        val1: 2.1 + (Math.sin(i / 3) * 0.25) + ((Math.random() - 0.5) * 0.1),
        val2: 72.0 + (Math.cos(i / 4) * 1.5) + ((Math.random() - 0.5) * 0.4),
      });
    }
    return pts;
  });

  // Real-time telemetry generator loop
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeStr = new Date(now).toTimeString().split(' ')[0];

      setMachines((prev) =>
        prev.map((m) => {
          // If machine is in scram/shut down, keep static
          if (m.rpm === 0 && m.status === 'alert') return m;

          // Tiny realistic fluctuation
          const vibJitter = (Math.random() - 0.5) * 0.08;
          const tempJitter = (Math.random() - 0.5) * 0.3;
          const pressJitter = (Math.random() - 0.5) * 0.15;

          const newVib = Math.max(0.1, Number((m.vibration + vibJitter).toFixed(2)));
          const newTemp = Number((m.thermalLoad + tempJitter).toFixed(1));
          const newPress = Number((m.pressure + pressJitter).toFixed(1));

          const updatedSensors = m.sensors.map((s) => {
            let newVal = s.value;
            if (s.unit === 'mm/s') newVal = Math.max(0.01, s.value + (Math.random() - 0.5) * 0.06);
            if (s.unit === '°C') newVal = s.value + (Math.random() - 0.5) * 0.2;
            if (s.unit === 'bar') newVal = Math.max(0.1, s.value + (Math.random() - 0.5) * 0.1);
            return {
              ...s,
              value: Number(newVal.toFixed(2)),
            };
          });

          return {
            ...m,
            vibration: newVib,
            vibrationTrend: [...m.vibrationTrend.slice(1), newVib],
            thermalLoad: newTemp,
            thermalTrend: [...m.thermalTrend.slice(1), newTemp],
            pressure: newPress,
            pressureTrend: [...m.pressureTrend.slice(1), newPress],
            sensors: updatedSensors,
          };
        })
      );

      // Append point to live chart for TRB-409X
      setChartData((prev) => {
        const trb = machines.find((m) => m.id === 'TRB-409X');
        const v1 = trb ? trb.vibration : 2.14;
        const v2 = trb ? trb.thermalLoad : 72.8;

        const nextPoint: DataPoint = {
          time: timeStr,
          timestamp: now,
          val1: v1,
          val2: v2,
        };
        return [...prev.slice(1), nextPoint];
      });
    }, streamRateMs);

    return () => clearInterval(interval);
  }, [isStreaming, streamRateMs, machines]);

  // Keep selectedMachine in sync with machines state
  useEffect(() => {
    const found = machines.find((m) => m.id === selectedMachine.id);
    if (found) {
      setSelectedMachine(found);
    }
  }, [machines, selectedMachine.id]);

  // Handlers
  const handleInspectMachine = (machine: MachineNode) => {
    setSelectedMachine(machine);
    setCurrentTab('diagnostics');
  };

  const handleQuickAction = (machine: MachineNode, action: string) => {
    if (action === 'Auto-Mitigate') {
      setMachines((prev) =>
        prev.map((m) => {
          if (m.id === machine.id) {
            return {
              ...m,
              status: 'nominal',
              vibration: 2.45,
              thermalLoad: 68.4,
              healthScore: 97.0,
            };
          }
          return m;
        })
      );

      // Add audit alert
      const newAlert: TelemetryAlert = {
        id: `ALT-${Math.floor(2000 + Math.random() * 8000)}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        machineId: machine.id,
        machineName: machine.name,
        severity: 'info',
        title: `Auto-Mitigation Executed on ${machine.id}`,
        description: `Field parameter throttling successfully normalized thermal and vibration telemetry below advisory thresholds.`,
        metricValue: '2.45 mm/s / 68.4 °C',
        acknowledged: true,
        acknowledgedBy: 'Automation Rule Engine',
        acknowledgedAt: 'Just now',
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const handleExecuteScram = (targetScope: string, reason: string) => {
    const nowTime = new Date().toTimeString().split(' ')[0];

    if (targetScope === 'GLOBAL_FACILITY') {
      setMachines((prev) =>
        prev.map((m) => ({
          ...m,
          status: 'alert',
          rpm: 0,
          vibration: 0.12,
          powerDraw: 0,
          healthScore: 60.0,
        }))
      );

      const alertItem: TelemetryAlert = {
        id: `ALT-SCRAM-${Date.now().toString().slice(-4)}`,
        timestamp: nowTime,
        machineId: 'ALL',
        machineName: 'Full Facility Machinery Bays',
        severity: 'critical',
        title: 'GLOBAL EMERGENCY SCRAM TRIPPED',
        description: `Facility emergency interlock disengaged by manual operator command. Reason: ${reason}`,
        metricValue: '0 RPM / 0 kW',
        acknowledged: false,
      };
      setAlerts((prev) => [alertItem, ...prev]);
    } else {
      setMachines((prev) =>
        prev.map((m) => {
          if (m.id === targetScope) {
            return {
              ...m,
              status: 'alert',
              rpm: 0,
              vibration: 0.08,
              powerDraw: 0,
              healthScore: 65.0,
            };
          }
          return m;
        })
      );

      const alertItem: TelemetryAlert = {
        id: `ALT-SCRAM-${Date.now().toString().slice(-4)}`,
        timestamp: nowTime,
        machineId: targetScope,
        machineName: `Unit ${targetScope}`,
        severity: 'critical',
        title: `EMERGENCY SCRAM TRIPPED: ${targetScope}`,
        description: `Interlock latch relay opened. Power cutoff verified. Reason: ${reason}`,
        metricValue: '0 RPM / 0 kW',
        acknowledged: false,
      };
      setAlerts((prev) => [alertItem, ...prev]);
    }
  };

  const handleCalibrateSensor = (sensor: SensorChannel) => {
    setActiveCalibrateSensor(sensor);
  };

  const handleApplyCalibration = (sensorId: string, offset: number) => {
    setMachines((prev) =>
      prev.map((m) => ({
        ...m,
        sensors: m.sensors.map((s) => {
          if (s.id === sensorId) {
            return {
              ...s,
              value: Number((s.value + offset).toFixed(2)),
              status: 'nominal',
            };
          }
          return s;
        }),
      }))
    );
  };

  const handleUpdateThresholds = (
    machineId: string,
    sensorId: string,
    warn: number,
    trip: number
  ) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id === machineId) {
          return {
            ...m,
            sensors: m.sensors.map((s) => {
              if (s.id === sensorId) {
                return {
                  ...s,
                  thresholdWarn: warn,
                  thresholdTrip: trip,
                };
              }
              return s;
            }),
          };
        }
        return m;
      })
    );
  };

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleAddRule = (
    newRuleData: Omit<AutomationRule, 'id' | 'executionCount' | 'lastTriggered'>
  ) => {
    const newRule: AutomationRule = {
      ...newRuleData,
      id: `RUL-0${rules.length + 1}`,
      executionCount: 0,
      lastTriggered: 'Never',
    };
    setRules((prev) => [newRule, ...prev]);
  };

  const handleSimulateRule = (rule: AutomationRule) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === rule.id
          ? {
              ...r,
              executionCount: r.executionCount + 1,
              lastTriggered: 'Just now (Simulated)',
            }
          : r
      )
    );

    const newAlert: TelemetryAlert = {
      id: `ALT-SIM-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toTimeString().split(' ')[0],
      machineId: rule.targetMachineId,
      machineName: `Interlock: ${rule.name}`,
      severity: rule.safetyLevel === 'Level 3 Scram Interlock' ? 'critical' : 'warning',
      title: `Simulated Trip: ${rule.name}`,
      description: `Test simulation executed safety action: ${rule.actionDescription}`,
      metricValue: `${rule.conditionMetric} >= ${rule.threshold} ${rule.unit}`,
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleAcknowledgeAlert = (alertId: string, engineerName: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              acknowledged: true,
              acknowledgedBy: engineerName,
              acknowledgedAt: new Date().toTimeString().split(' ')[0],
            }
          : a
      )
    );
  };

  const handleDispatchTech = (alertId: string, techName: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              acknowledged: true,
              acknowledgedBy: `${techName} (Dispatched)`,
              acknowledgedAt: new Date().toTimeString().split(' ')[0],
            }
          : a
      )
    );
  };

  const handleAddNoteToAlert = (alertId: string, note: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              description: `${a.description} [Engineer Note: ${note}]`,
            }
          : a
      )
    );
  };

  const handleManualCommand = (cmd: string) => {
    const newAlert: TelemetryAlert = {
      id: `CMD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toTimeString().split(' ')[0],
      machineId: 'FACILITY',
      machineName: 'Central Actuator Bus',
      severity: 'info',
      title: `Manual Actuator Command: ${cmd}`,
      description: `Field override executed by lead technician via local RTOS console.`,
      metricValue: 'Command Acknowledged',
      acknowledged: true,
      acknowledgedBy: 'Operator Console',
      acknowledgedAt: 'Just now',
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const handleExportSnapshot = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            timestamp: new Date().toISOString(),
            machines,
            gateways,
            activeAlerts: alerts.filter((a) => !a.acknowledged),
            telemetryBuffer: chartData,
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `edgepulse_telemetry_snapshot_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const unacknowledgedAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1C30] flex flex-col font-sans">
      {/* EdgePulse Top Bar Contract Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        isStreaming={isStreaming}
        onToggleStreaming={() => setIsStreaming(!isStreaming)}
        streamRateMs={streamRateMs}
        onStreamRateChange={(rate) => setStreamRateMs(rate)}
        onOpenScramModal={() => setIsScramModalOpen(true)}
        activeAlertCount={unacknowledgedAlertsCount}
      />

      {/* Main Content Canvas Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 lg:px-8 py-6">
        {currentTab === 'fleet' && (
          <FleetMonitorView
            machines={machines}
            liveChartData={chartData}
            isStreaming={isStreaming}
            onInspectMachine={handleInspectMachine}
            onQuickAction={handleQuickAction}
            onCalibrateSensor={handleCalibrateSensor}
            onExportSnapshot={handleExportSnapshot}
          />
        )}

        {currentTab === 'diagnostics' && (
          <MachineInspectorView
            machines={machines}
            selectedMachine={selectedMachine}
            onSelectMachine={(m) => setSelectedMachine(m)}
            onCalibrateSensor={handleCalibrateSensor}
            onUpdateThresholds={handleUpdateThresholds}
          />
        )}

        {currentTab === 'automation' && (
          <AutomationEngineView
            rules={rules}
            gateways={gateways}
            machines={machines}
            onToggleRule={handleToggleRule}
            onAddRule={handleAddRule}
            onSimulateRule={handleSimulateRule}
            onSyncGateways={() => {
              setGateways((prev) =>
                prev.map((gw) => ({
                  ...gw,
                  rulesSynchronized: true,
                  lastSync: 'Just now',
                }))
              );
            }}
            onManualCommand={handleManualCommand}
          />
        )}

        {currentTab === 'incidents' && (
          <AlarmEventsView
            alerts={alerts}
            machines={machines}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onDispatchTech={handleDispatchTech}
            onAddNote={handleAddNoteToAlert}
          />
        )}

        {currentTab === 'calibration' && (
          <AssetCalibrationView
            calibrations={calibrations}
            machines={machines}
            onAddCalibration={(cal) => setCalibrations((prev) => [cal, ...prev])}
          />
        )}
      </main>

      {/* Quiet Clinical Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-4 px-4 lg:px-8 mt-auto text-xs text-[#64748B]">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#0B1C30]">EdgePulse RTOS</span>
            <span>·</span>
            <span>Industrial IoT & Machine Telemetry Operations</span>
            <span>·</span>
            <span className="font-mono text-[#006578]">IEEE 1588 PTP Synced</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Cleanroom Alpha · Sector D Infrastructure</span>
            <span>·</span>
            <span>ISO 10816 / ISO 17025 Compliant</span>
          </div>
        </div>
      </footer>

      {/* Emergency SCRAM Modal */}
      <EmergencyScramModal
        isOpen={isScramModalOpen}
        onClose={() => setIsScramModalOpen(false)}
        machines={machines}
        onExecuteScram={handleExecuteScram}
      />

      {/* Zero Offset Calibration Modal */}
      <ZeroCalibrationModal
        sensor={activeCalibrateSensor}
        onClose={() => setActiveCalibrateSensor(null)}
        onApplyCalibration={handleApplyCalibration}
      />
    </div>
  );
}
