/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MachineNode, SensorChannel } from '../types/telemetry';
import { TelemetryStatusChip } from '../components/TelemetryStatusChip';
import { MachineSchematicBlueprint } from '../components/MachineSchematicBlueprint';
import { FftSpectrumViewer } from '../components/FftSpectrumViewer';
import { SensorFeedGrid } from '../components/SensorFeedGrid';
import { Play, CheckCircle2, AlertTriangle, Sliders, Shield, RefreshCw, Cpu, Activity, Clock } from 'lucide-react';

interface MachineInspectorViewProps {
  machines: MachineNode[];
  selectedMachine: MachineNode;
  onSelectMachine: (machine: MachineNode) => void;
  onCalibrateSensor: (sensor: SensorChannel) => void;
  onUpdateThresholds?: (machineId: string, sensorId: string, warn: number, trip: number) => void;
}

export const MachineInspectorView: React.FC<MachineInspectorViewProps> = ({
  machines,
  selectedMachine,
  onSelectMachine,
  onCalibrateSensor,
  onUpdateThresholds,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<SensorChannel>(
    selectedMachine.sensors[0] || null
  );

  // Self-Test State
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [testResults, setTestResults] = useState<{ name: string; status: 'pending' | 'running' | 'passed'; value: string }[] | null>(null);

  const startSelfTest = () => {
    setIsTesting(true);
    setTestProgress(10);
    setTestResults([
      { name: 'Transducer Loopback & ADC Noise Floor', status: 'running', value: 'Checking SNR...' },
      { name: 'Rotor Dynamic Balance & Eccentricity', status: 'pending', value: 'Queued' },
      { name: 'Emergency SCRAM Trip Interlock Latch', status: 'pending', value: 'Queued' },
      { name: 'Sensor Zero-Offset Drift Tolerance', status: 'pending', value: 'Queued' },
    ]);

    setTimeout(() => {
      setTestProgress(45);
      setTestResults((prev) =>
        prev ? [
          { name: 'Transducer Loopback & ADC Noise Floor', status: 'passed', value: 'SNR 94.2 dB (Nominal)' },
          { name: 'Rotor Dynamic Balance & Eccentricity', status: 'running', value: 'Analyzing 1X Harmonic...' },
          { name: 'Emergency SCRAM Trip Interlock Latch', status: 'pending', value: 'Queued' },
          { name: 'Sensor Zero-Offset Drift Tolerance', status: 'pending', value: 'Queued' },
        ] : null
      );
    }, 1200);

    setTimeout(() => {
      setTestProgress(80);
      setTestResults((prev) =>
        prev ? [
          { name: 'Transducer Loopback & ADC Noise Floor', status: 'passed', value: 'SNR 94.2 dB (Nominal)' },
          { name: 'Rotor Dynamic Balance & Eccentricity', status: 'passed', value: 'Eccentricity < 0.003 mm' },
          { name: 'Emergency SCRAM Trip Interlock Latch', status: 'running', value: 'Testing relay trip in 12ms...' },
          { name: 'Sensor Zero-Offset Drift Tolerance', status: 'pending', value: 'Queued' },
        ] : null
      );
    }, 2400);

    setTimeout(() => {
      setTestProgress(100);
      setIsTesting(false);
      setTestResults([
        { name: 'Transducer Loopback & ADC Noise Floor', status: 'passed', value: 'SNR 94.2 dB (Nominal)' },
        { name: 'Rotor Dynamic Balance & Eccentricity', status: 'passed', value: 'Eccentricity < 0.003 mm' },
        { name: 'Emergency SCRAM Trip Interlock Latch', status: 'passed', value: 'Trip Response 11.4 ms (Passed)' },
        { name: 'Sensor Zero-Offset Drift Tolerance', status: 'passed', value: 'Max Drift 0.04% (Passed)' },
      ]);
    }, 3600);
  };

  return (
    <div className="space-y-6">
      {/* Top Unit Selector Header */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4.5 elevation-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-[#006578] bg-[#E5EEFF] px-2 py-0.5 rounded">
              {selectedMachine.id}
            </span>
            <span className="text-xs text-[#64748B]">·</span>
            <span className="text-xs text-[#64748B]">{selectedMachine.location}</span>
            <span className="text-xs text-[#64748B]">·</span>
            <span className="text-xs font-mono text-[#94A3B8]">{selectedMachine.serialNumber}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B1C30] tracking-tight">
            {selectedMachine.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Machine Dropdown Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Inspect Unit:
            </label>
            <select
              value={selectedMachine.id}
              onChange={(e) => {
                const found = machines.find((m) => m.id === e.target.value);
                if (found) {
                  onSelectMachine(found);
                  setSelectedSensor(found.sensors[0]);
                }
              }}
              className="h-9 px-3 bg-white border border-[#CBD5E1] rounded-md text-xs font-bold text-[#0B1C30] focus:outline-none focus:border-[#0098B3] cursor-pointer"
            >
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} - {m.name}
                </option>
              ))}
            </select>
          </div>

          <TelemetryStatusChip status={selectedMachine.status} />
        </div>
      </div>

      {/* Machine Key Hardware Specs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] elevation-card">
          <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
            Uptime
          </div>
          <div className="text-sm font-bold text-[#0B1C30] tabular-nums mt-0.5">
            {selectedMachine.uptimeHours} hrs
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] elevation-card">
          <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
            Rotor Velocity
          </div>
          <div className="text-sm font-bold text-[#0B1C30] tabular-nums mt-0.5">
            {selectedMachine.rpm.toLocaleString()} RPM
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] elevation-card">
          <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
            Primary Vibration
          </div>
          <div className="text-sm font-bold text-[#0B1C30] tabular-nums mt-0.5">
            {selectedMachine.vibration.toFixed(2)} mm/s
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] elevation-card">
          <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
            Thermal Envelope
          </div>
          <div className="text-sm font-bold text-[#0B1C30] tabular-nums mt-0.5">
            {selectedMachine.thermalLoad.toFixed(1)} °C
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] elevation-card">
          <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
            RTOS Gateway
          </div>
          <div className="text-sm font-bold text-[#006578] font-mono mt-0.5 truncate">
            {selectedMachine.edgeGateway}
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] elevation-card">
          <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
            Calibration Due
          </div>
          <div className="text-sm font-bold text-[#0B1C30] font-mono mt-0.5">
            {selectedMachine.calibrationDue}
          </div>
        </div>
      </div>

      {/* Main Schematic Blueprint */}
      <MachineSchematicBlueprint
        machine={selectedMachine}
        selectedSensorId={selectedSensor?.id}
        onSelectSensor={(s) => setSelectedSensor(s)}
      />

      {/* 2-Column Split: Sensor Calibration & Detail + FFT Harmonic Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Sensor Channel Inspector */}
        {selectedSensor && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-4.5 elevation-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#006578] bg-[#ECFEFF] px-2 py-0.5 rounded border border-[#A5F3FC]">
                    {selectedSensor.channel}
                  </span>
                  <h4 className="text-sm font-bold text-[#0B1C30]">
                    {selectedSensor.name}
                  </h4>
                </div>
                <TelemetryStatusChip status={selectedSensor.status} />
              </div>

              {/* Current Value Readout */}
              <div className="bg-[#F8FAFC] p-3 rounded-md border border-[#E2E8F0] mb-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B] mb-1">
                  Active Physical Measurement
                </div>
                <div className="text-3xl font-extrabold text-[#0B1C30] tabular-nums">
                  {selectedSensor.value.toFixed(2)}{' '}
                  <span className="text-sm font-normal text-[#94A3B8]">
                    {selectedSensor.unit}
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">
                  Installed at: <span className="font-semibold text-[#0B1C30]">{selectedSensor.locationPoint}</span> · Sample Rate: <span className="font-mono text-[#006578]">{selectedSensor.sampleRate}</span>
                </div>
              </div>

              {/* Dynamic Threshold Sliders */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#D97706]">Advisory Warning Limit</span>
                    <span className="font-mono font-bold tabular-nums">{selectedSensor.thresholdWarn} {selectedSensor.unit}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="0.5"
                    value={selectedSensor.thresholdWarn}
                    onChange={(e) => {
                      const newWarn = Number(e.target.value);
                      setSelectedSensor({ ...selectedSensor, thresholdWarn: newWarn });
                      if (onUpdateThresholds) {
                        onUpdateThresholds(selectedMachine.id, selectedSensor.id, newWarn, selectedSensor.thresholdTrip);
                      }
                    }}
                    className="w-full accent-[#D97706] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-[#DC2626]">Emergency Scram Trip Limit</span>
                    <span className="font-mono font-bold tabular-nums">{selectedSensor.thresholdTrip} {selectedSensor.unit}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="150"
                    step="0.5"
                    value={selectedSensor.thresholdTrip}
                    onChange={(e) => {
                      const newTrip = Number(e.target.value);
                      setSelectedSensor({ ...selectedSensor, thresholdTrip: newTrip });
                      if (onUpdateThresholds) {
                        onUpdateThresholds(selectedMachine.id, selectedSensor.id, selectedSensor.thresholdWarn, newTrip);
                      }
                    }}
                    className="w-full accent-[#DC2626] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 pt-3 border-t border-[#F1F5F9]">
              <button
                onClick={() => onCalibrateSensor(selectedSensor)}
                className="btn-edge-primary flex-1 py-2 px-3 text-xs flex items-center justify-center gap-1.5 cursor-pointer font-semibold"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Zero-Offset Calibrate</span>
              </button>
            </div>
          </div>
        )}

        {/* FFT Frequency Spectrum Analyzer */}
        <FftSpectrumViewer
          machineId={selectedMachine.id}
          fundamentalRpm={selectedMachine.rpm}
          currentVibration={selectedMachine.vibration}
        />
      </div>

      {/* Subassembly Condition Matrix */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4.5 elevation-card">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F5F9]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#0B1C30]">
              Subassembly Mechanical Integrity Matrix
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Continuous physical subsystem breakdown for {selectedMachine.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {selectedMachine.subassemblies.map((sub, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-xs font-bold text-[#0B1C30]">{sub.name}</h4>
                  <TelemetryStatusChip status={sub.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="bg-white p-1.5 rounded border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] block">Sub-Temp</span>
                    <span className="font-mono font-bold tabular-nums">{sub.temp.toFixed(1)} °C</span>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#64748B] block">Vibration</span>
                    <span className="font-mono font-bold tabular-nums">{sub.vibration.toFixed(2)} mm/s</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-[#64748B] border-t border-[#E2E8F0] pt-1.5">
                {sub.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Self-Test Diagnostic Suite */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4.5 elevation-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#0B1C30]">
              Automated RTOS Hardware Diagnostics Routine
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Verify transducer circuit loopback, scram relay latches, and clock jitter
            </p>
          </div>

          <button
            onClick={startSelfTest}
            disabled={isTesting}
            className="btn-edge-primary px-4 py-2 text-xs flex items-center justify-center gap-2 cursor-pointer font-semibold disabled:opacity-60"
          >
            {isTesting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Test ({testProgress}%)...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Diagnostics Self-Test</span>
              </>
            )}
          </button>
        </div>

        {/* Test Progress Bar */}
        {isTesting && (
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden mb-4">
            <div
              className="bg-[#0098B3] h-full transition-all duration-300"
              style={{ width: `${testProgress}%` }}
            />
          </div>
        )}

        {/* Results Checklist */}
        {testResults && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {testResults.map((t, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded border border-[#E2E8F0] bg-[#F8FAFC]"
              >
                <div className="flex items-center gap-2">
                  {t.status === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  ) : t.status === 'running' ? (
                    <RefreshCw className="w-4 h-4 text-[#0098B3] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300" />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-[#0B1C30]">{t.name}</div>
                    <div className="text-[11px] text-[#64748B] font-mono">{t.value}</div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    t.status === 'passed'
                      ? 'bg-[#ECFDF5] text-[#065F46]'
                      : t.status === 'running'
                      ? 'bg-[#ECFEFF] text-[#006578]'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sensor Feed Grid for this Machine */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#64748B]">
          Installed Sensor Transducers ({selectedMachine.sensors.length} Channels)
        </h3>
        <SensorFeedGrid
          sensors={selectedMachine.sensors}
          onCalibrate={onCalibrateSensor}
          onSelectSensor={(s) => setSelectedSensor(s)}
        />
      </div>
    </div>
  );
};
