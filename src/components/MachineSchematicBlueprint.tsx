/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MachineNode, SensorChannel } from '../types/telemetry';
import { TelemetryStatusChip } from './TelemetryStatusChip';
import { Activity, Target, ShieldCheck, Zap } from 'lucide-react';

interface MachineSchematicBlueprintProps {
  machine: MachineNode;
  onSelectSensor: (sensor: SensorChannel) => void;
  selectedSensorId?: string;
}

export const MachineSchematicBlueprint: React.FC<MachineSchematicBlueprintProps> = ({
  machine,
  onSelectSensor,
  selectedSensorId,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  // Hotspot coordinates for schematic probes
  const probeCoordinates: Record<string, { x: number; y: number; label: string }> = {
    'SN-01': { x: 180, y: 155, label: 'Bearing 1 Radial Transducer' },
    'SN-02': { x: 340, y: 120, label: 'Stator High-Temp Core' },
    'SN-03': { x: 260, y: 220, label: 'Oil Hydraulic Pressure' },
    'SN-04': { x: 510, y: 140, label: 'Combustor Resonator' },
    'SN-05': { x: 670, y: 155, label: 'Thrust Bearing Speed Sensor' },
    // Default fallback spots
    'SN-11': { x: 220, y: 140, label: 'Spindle Dual-Axis Vibro' },
    'SN-12': { x: 380, y: 160, label: 'Ceramic Core Thermocouple' },
    'SN-13': { x: 490, y: 180, label: 'Coolant Flow Transducer' },
    'SN-14': { x: 620, y: 140, label: 'Optical Linear Encoder' },
  };

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-4.5 elevation-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#F1F5F9]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#006578] font-semibold">
            Architectural Module Topology · Assembly Schematics
          </div>
          <h3 className="text-base font-bold text-[#0B1C30]">
            {machine.name} (Cross-Section Instrumentation)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748B]">Click sensor probe to inspect channel:</span>
          <TelemetryStatusChip status={machine.status} />
        </div>
      </div>

      {/* SVG Technical Blueprint Diagram */}
      <div className="relative w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-md overflow-hidden p-2">
        <svg
          viewBox="0 0 840 300"
          className="w-full h-auto select-none"
        >
          <defs>
            {/* Precision Grid Pattern */}
            <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
            </pattern>
            {/* Cyan probe glow */}
            <filter id="probeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#0098B3" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Blueprint background grid */}
          <rect width="840" height="300" fill="#F8FAFC" />
          <rect width="840" height="300" fill="url(#blueprintGrid)" />

          {/* Dimension and Reference Markers */}
          <line x1="40" y1="20" x2="800" y2="20" stroke="#CBD5E1" strokeWidth="0.75" strokeDasharray="3 3" />
          <text x="420" y="16" textAnchor="middle" fontSize="9" fontFamily="Anybody" fill="#94A3B8">
            DATUM AXIS 0.000 mm / HORIZONTAL CLEARANCE TOLERANCE ±0.005
          </text>

          {/* Machine Outer Housing Contour (Turbine / Industrial Casing) */}
          <path
            d="M 120 155 L 140 100 L 260 90 L 400 70 L 620 90 L 720 120 L 730 155 L 720 190 L 620 220 L 400 240 L 260 220 L 140 210 Z"
            fill="#FFFFFF"
            stroke="#64748B"
            strokeWidth="1.5"
          />

          {/* Internal Chamber Segments */}
          <rect x="180" y="115" width="80" height="80" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 2" />
          <text x="220" y="158" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="Anybody" fill="#64748B">
            INTAKE
          </text>

          <rect x="290" y="100" width="100" height="110" fill="#EFF4FF" stroke="#0098B3" strokeWidth="1" />
          <text x="340" y="158" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="Anybody" fill="#006578">
            COMPRESSION
          </text>

          <circle cx="490" cy="155" r="45" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
          <text x="490" y="158" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="Anybody" fill="#92400E">
            COMBUSTION
          </text>

          <polygon points="560,110 680,85 680,225 560,200" fill="#EFF4FF" stroke="#0284C7" strokeWidth="1" />
          <text x="620" y="158" textAnchor="middle" fontSize="10" fontWeight="bold" fontFamily="Anybody" fill="#0284C7">
            EXPANDER
          </text>

          {/* Main Rotor Centerline Shaft */}
          <line x1="80" y1="155" x2="760" y2="155" stroke="#0098B3" strokeWidth="2.5" />
          <line x1="80" y1="155" x2="760" y2="155" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="8 4" />

          {/* Rotor Bearings */}
          <rect x="160" y="145" width="30" height="20" fill="#0B1C30" rx="2" />
          <rect x="670" y="145" width="30" height="20" fill="#0B1C30" rx="2" />

          {/* Sensor Probes Markers */}
          {machine.sensors.map((sensor) => {
            const pos = probeCoordinates[sensor.id] || { x: 200 + Math.random() * 400, y: 155, label: sensor.name };
            const isSelected = selectedSensorId === sensor.id;
            const isHovered = hoveredPoint === sensor.id;
            const isWarn = sensor.status === 'warning';
            const isTrip = sensor.status === 'alert';

            const probeColor = isTrip ? '#DC2626' : isWarn ? '#D97706' : '#0098B3';

            return (
              <g
                key={sensor.id}
                className="cursor-pointer"
                onClick={() => onSelectSensor(sensor)}
                onMouseEnter={() => setHoveredPoint(sensor.id)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Pointer Line */}
                <line
                  x1={pos.x}
                  y1={pos.y}
                  x2={pos.x}
                  y2={pos.y < 155 ? pos.y - 30 : pos.y + 30}
                  stroke={probeColor}
                  strokeWidth="1.2"
                />

                {/* Outer Ring */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected || isHovered ? '9' : '7'}
                  fill="#FFFFFF"
                  stroke={probeColor}
                  strokeWidth="2.5"
                  filter={isSelected ? 'url(#probeGlow)' : undefined}
                />

                {/* Inner Dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="3"
                  fill={probeColor}
                />

                {/* Label Tag */}
                <g transform={`translate(${pos.x}, ${pos.y < 155 ? pos.y - 35 : pos.y + 35})`}>
                  <rect
                    x="-40"
                    y="-12"
                    width="80"
                    height="18"
                    rx="3"
                    fill={isSelected ? '#0B1C30' : '#FFFFFF'}
                    stroke={probeColor}
                    strokeWidth="1"
                    className="shadow-sm"
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="Anybody"
                    fill={isSelected ? '#FFFFFF' : '#0B1C30'}
                  >
                    {sensor.channel}: {sensor.value.toFixed(1)} {sensor.unit}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Dynamic probe quick legend */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-[#64748B] pt-2 px-1 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0098B3]" />
              Nominal Probe
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              Advisory Limit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
              Critical Scram Sensor
            </span>
          </div>

          <div className="font-mono text-[#006578]">
            Telemetry Clock: Synchronized · IEEE 1588 PTP
          </div>
        </div>
      </div>
    </div>
  );
};
