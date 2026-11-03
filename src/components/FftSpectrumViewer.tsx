/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Activity, BarChart2 } from 'lucide-react';

interface FftSpectrumViewerProps {
  machineId: string;
  fundamentalRpm: number;
  currentVibration: number;
}

export const FftSpectrumViewer: React.FC<FftSpectrumViewerProps> = ({
  machineId,
  fundamentalRpm,
  currentVibration,
}) => {
  const [selectedPeak, setSelectedPeak] = useState<string | null>(null);

  // Fundamental frequency in Hz (RPM / 60)
  const fundamentalHz = Math.round(fundamentalRpm / 60) || 50;

  // Generate harmonic spectrum bins
  const harmonics = [
    { label: '0.5X Subharmonic', freq: Math.round(fundamentalHz * 0.5), amp: (currentVibration * 0.12).toFixed(2), desc: 'Oil Whirl / Subharmonic Lube Stability' },
    { label: '1X Fundamental', freq: fundamentalHz, amp: (currentVibration * 0.82).toFixed(2), desc: 'Primary Rotational Unbalance' },
    { label: '2X Harmonic', freq: fundamentalHz * 2, amp: (currentVibration * 0.45).toFixed(2), desc: 'Shaft Angular Misalignment' },
    { label: '3X Harmonic', freq: fundamentalHz * 3, amp: (currentVibration * 0.22).toFixed(2), desc: 'Coupling Looseness / Non-linear Stiffness' },
    { label: 'BPFO Bearing Outer', freq: Math.round(fundamentalHz * 3.58), amp: (currentVibration * 0.38).toFixed(2), desc: 'Ball Pass Frequency Outer Race Defect' },
    { label: 'Blade Pass (12X)', freq: fundamentalHz * 12, amp: (currentVibration * 0.19).toFixed(2), desc: 'Compressor Impeller Blade Vane Pass' },
  ];

  const maxAmp = Math.max(...harmonics.map((h) => Number(h.amp)), 3.0);

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 elevation-card">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#0098B3]" />
          <h4 className="text-xs font-bold uppercase tracking-[0.05em] text-[#0B1C30]">
            FFT Frequency Spectrum Analyzer · Vibration Harmonics
          </h4>
        </div>
        <span className="text-[11px] font-mono text-[#006578] bg-[#ECFEFF] px-2 py-0.5 rounded border border-[#A5F3FC]">
          1X = {fundamentalHz} Hz ({fundamentalRpm} RPM)
        </span>
      </div>

      {/* Spectrum Chart */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-md p-3 mb-3">
        <div className="flex items-end gap-2 h-36 pt-4 px-2">
          {harmonics.map((h) => {
            const heightPct = (Number(h.amp) / maxAmp) * 100;
            const isSelected = selectedPeak === h.label;
            const isHigh = Number(h.amp) > 2.5;

            return (
              <div
                key={h.label}
                onClick={() => setSelectedPeak(isSelected ? null : h.label)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Peak Amplitude Tag */}
                <div
                  className={`text-[9px] font-mono font-bold mb-1 transition-colors tabular-nums ${
                    isHigh
                      ? 'text-[#DC2626]'
                      : isSelected
                      ? 'text-[#0098B3]'
                      : 'text-[#64748B] group-hover:text-[#0B1C30]'
                  }`}
                >
                  {h.amp}
                </div>

                {/* Spectral Bar */}
                <div className="w-full max-w-[28px] bg-slate-200 rounded-t overflow-hidden h-full flex items-end">
                  <div
                    style={{ height: `${Math.max(8, heightPct)}%` }}
                    className={`w-full transition-all duration-300 rounded-t ${
                      isHigh
                        ? 'bg-[#DC2626]'
                        : isSelected
                        ? 'bg-[#0098B3] shadow-[0_0_8px_rgba(0,152,179,0.4)]'
                        : 'bg-[#0284C7] group-hover:bg-[#0098B3]'
                    }`}
                  />
                </div>

                {/* Frequency Label */}
                <div className="text-[9px] font-mono text-[#94A3B8] group-hover:text-[#0B1C30] mt-1 tabular-nums whitespace-nowrap">
                  {h.freq} Hz
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Harmonic Descriptor Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {harmonics.map((h) => (
          <div
            key={h.label}
            onClick={() => setSelectedPeak(h.label)}
            className={`p-2 rounded border cursor-pointer transition-all ${
              selectedPeak === h.label
                ? 'bg-[#EFF4FF] border-[#0098B3] text-[#006578]'
                : 'bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]'
            }`}
          >
            <div className="flex items-center justify-between font-semibold mb-0.5">
              <span>{h.label}</span>
              <span className="font-mono text-[#0B1C30] tabular-nums">{h.amp} mm/s</span>
            </div>
            <div className="text-[11px] text-[#64748B]">{h.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
