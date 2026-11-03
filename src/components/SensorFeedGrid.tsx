/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SensorChannel } from '../types/telemetry';
import { TelemetryStatusChip } from './TelemetryStatusChip';
import { Sliders, Wrench, CheckCircle } from 'lucide-react';

interface SensorFeedGridProps {
  sensors: SensorChannel[];
  onCalibrate?: (sensor: SensorChannel) => void;
  onSelectSensor?: (sensor: SensorChannel) => void;
}

export const SensorFeedGrid: React.FC<SensorFeedGridProps> = ({
  sensors,
  onCalibrate,
  onSelectSensor,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white elevation-card">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-[#F1F5F9] h-9 border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-[0.08em] text-[#64748B]">
            <th className="px-4 py-2">Channel / Tag</th>
            <th className="px-4 py-2">Transducer Name</th>
            <th className="px-4 py-2">Physical Location</th>
            <th className="px-4 py-2 text-right">Live Reading</th>
            <th className="px-4 py-2 text-right">Advisory Limit</th>
            <th className="px-4 py-2 text-right">Trip Limit</th>
            <th className="px-4 py-2">Sample Rate</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0]">
          {sensors.map((sensor, idx) => {
            const isAlternate = idx % 2 === 1;
            return (
              <tr
                key={sensor.id}
                onClick={() => onSelectSensor && onSelectSensor(sensor)}
                className={`data-row cursor-pointer transition-colors ${
                  isAlternate ? 'bg-[#FAFAFA]' : 'bg-white'
                }`}
              >
                {/* Channel / Tag */}
                <td className="px-4 py-3 font-mono font-bold text-[#006578]">
                  {sensor.channel}
                </td>

                {/* Transducer Name */}
                <td className="px-4 py-3 font-semibold text-[#0B1C30]">
                  {sensor.name}
                  <div className="text-[10px] text-[#94A3B8] font-mono">
                    ID: {sensor.id}
                  </div>
                </td>

                {/* Location */}
                <td className="px-4 py-3 text-[#64748B]">
                  {sensor.locationPoint}
                </td>

                {/* Reading */}
                <td className="px-4 py-3 text-right font-mono font-bold text-[#0B1C30] text-sm tabular-nums">
                  {sensor.value.toFixed(2)}{' '}
                  <span className="text-[10px] font-normal text-[#94A3B8] ml-0.5">
                    {sensor.unit}
                  </span>
                </td>

                {/* Advisory Limit */}
                <td className="px-4 py-3 text-right font-mono text-[#D97706] tabular-nums">
                  {sensor.thresholdWarn.toFixed(1)} {sensor.unit}
                </td>

                {/* Trip Limit */}
                <td className="px-4 py-3 text-right font-mono text-[#DC2626] tabular-nums font-semibold">
                  {sensor.thresholdTrip.toFixed(1)} {sensor.unit}
                </td>

                {/* Sample Rate */}
                <td className="px-4 py-3 text-[#64748B] font-mono">
                  {sensor.sampleRate}
                </td>

                {/* Status Chip */}
                <td className="px-4 py-3">
                  <TelemetryStatusChip status={sensor.status} />
                </td>

                {/* Action */}
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onCalibrate && onCalibrate(sensor)}
                    className="p-1.5 rounded-md hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0098B3] transition-colors"
                    title="Calibrate probe offset"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
