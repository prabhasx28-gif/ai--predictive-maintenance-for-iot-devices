/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalibrationRecord, MachineNode } from '../types/telemetry';
import { TelemetryStatusChip } from '../components/TelemetryStatusChip';
import { Sliders, CheckCircle, Plus, FileText, Download, Award, Search, Calendar } from 'lucide-react';

interface AssetCalibrationViewProps {
  calibrations: CalibrationRecord[];
  machines: MachineNode[];
  onAddCalibration: (cal: CalibrationRecord) => void;
}

export const AssetCalibrationView: React.FC<AssetCalibrationViewProps> = ({
  calibrations,
  machines,
  onAddCalibration,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [machineId, setMachineId] = useState(machines[0]?.id || 'TRB-409X');
  const [sensorId, setSensorId] = useState('SN-01');
  const [sensorName, setSensorName] = useState('Front Radial Bearing Transducer');
  const [technician, setTechnician] = useState('Marcus Vance, PE (NIST #9921)');
  const [certificateNo, setCertificateNo] = useState(`NIST-2026-EP-${Math.floor(10000 + Math.random() * 90000)}`);
  const [driftPercentage, setDriftPercentage] = useState(0.05);
  const [notes, setNotes] = useState('Verification against ISO 10816 vibration standard complete.');

  const filtered = calibrations.filter(
    (c) =>
      c.sensorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.certificateNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.machineId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.technician.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: CalibrationRecord = {
      id: `CAL-2026-${Math.floor(100 + Math.random() * 900)}`,
      machineId,
      sensorId,
      sensorName,
      date: new Date().toISOString().split('T')[0],
      technician,
      certificateNo,
      driftPercentage,
      status: Math.abs(driftPercentage) > 1.5 ? 'recalibrated' : 'passed',
      nextDue: '2027-03-30',
      notes,
    };
    onAddCalibration(newRecord);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#006578] font-bold">
            Metrology Standards & Sensor Drift Compliance · ISO 17025 / NIST
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Transducer Calibration & Asset Registry
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="btn-edge-primary px-3.5 py-2 text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Log Calibration Event</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 elevation-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
            <Award className="w-4 h-4 text-[#0098B3]" />
            Active Certifications
          </div>
          <div className="text-2xl font-bold text-[#0B1C30] tabular-nums">
            {calibrations.length} Transducers
          </div>
          <div className="text-[11px] text-[#059669] font-medium mt-1">
            100% Traceability to NIST Primary References
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 elevation-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
            <Sliders className="w-4 h-4 text-[#0098B3]" />
            Mean Drift Tolerance
          </div>
          <div className="text-2xl font-bold text-[#0B1C30] tabular-nums">
            ± 0.28 %
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Allowed baseline envelope: ± 2.0%
          </div>
        </div>

        <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 elevation-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-1">
            <Calendar className="w-4 h-4 text-[#0098B3]" />
            Upcoming Recalibration
          </div>
          <div className="text-2xl font-bold text-[#0B1C30]">
            Nov 20, 2026
          </div>
          <div className="text-[11px] text-[#D97706] font-medium mt-1">
            CNC-880M Spindle Accelerometer due in 17 days
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 elevation-card flex items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificate, sensor ID, technician..."
            className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0098B3]"
          />
        </div>

        <span className="text-xs font-mono text-[#64748B]">
          Showing {filtered.length} of {calibrations.length} records
        </span>
      </div>

      {/* Calibration Records Table adhering to the Data Grid Spec */}
      <div className="overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white elevation-card">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F1F5F9] h-9 border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-[0.08em] text-[#64748B]">
              <th className="px-4 py-2">Record ID</th>
              <th className="px-4 py-2">Machine / Unit</th>
              <th className="px-4 py-2">Sensor Transducer</th>
              <th className="px-4 py-2">Certificate Number</th>
              <th className="px-4 py-2 text-right">Drift %</th>
              <th className="px-4 py-2">Calibration Date</th>
              <th className="px-4 py-2">Next Due</th>
              <th className="px-4 py-2">Certified By</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((cal, idx) => {
              const isAlternate = idx % 2 === 1;
              return (
                <tr
                  key={cal.id}
                  className={`data-row ${isAlternate ? 'bg-[#FAFAFA]' : 'bg-white'}`}
                >
                  <td className="px-4 py-3 font-mono font-bold text-[#006578]">
                    {cal.id}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#0B1C30]">
                    {cal.machineId}
                  </td>
                  <td className="px-4 py-3 text-[#0B1C30]">
                    <div className="font-semibold">{cal.sensorName}</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">{cal.sensorId}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[#006578]">
                    {cal.certificateNo}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold tabular-nums">
                    <span
                      className={
                        Math.abs(cal.driftPercentage) > 1.5
                          ? 'text-[#D97706]'
                          : 'text-[#059669]'
                      }
                    >
                      {cal.driftPercentage > 0 ? `+${cal.driftPercentage}%` : `${cal.driftPercentage}%`}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-[#64748B]">
                    {cal.date}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-[#0B1C30]">
                    {cal.nextDue}
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">
                    {cal.technician}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        cal.status === 'passed'
                          ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                          : 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                      }`}
                    >
                      {cal.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Log Calibration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#CBD5E1] p-6 max-w-lg w-full elevation-modal">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <h3 className="text-base font-bold text-[#0B1C30]">
                Record Metrology Calibration Event
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#64748B] hover:text-[#0B1C30] font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Machine Unit
                  </label>
                  <select
                    value={machineId}
                    onChange={(e) => {
                      setMachineId(e.target.value);
                      const m = machines.find((mach) => mach.id === e.target.value);
                      if (m && m.sensors.length > 0) {
                        setSensorId(m.sensors[0].id);
                        setSensorName(m.sensors[0].name);
                      }
                    }}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  >
                    {machines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} - {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Sensor Channel
                  </label>
                  <input
                    type="text"
                    value={sensorName}
                    onChange={(e) => setSensorName(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Certificate Number
                  </label>
                  <input
                    type="text"
                    required
                    value={certificateNo}
                    onChange={(e) => setCertificateNo(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Measured Drift %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={driftPercentage}
                    onChange={(e) => setDriftPercentage(Number(e.target.value))}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                  Certified Metrologist / Technician
                </label>
                <input
                  type="text"
                  required
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                  Metrology Log Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-edge-secondary px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-edge-primary px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
