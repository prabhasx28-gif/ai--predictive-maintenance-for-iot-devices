/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SensorChannel } from '../types/telemetry';
import { Sliders, CheckCircle2, RotateCcw } from 'lucide-react';

interface ZeroCalibrationModalProps {
  sensor: SensorChannel | null;
  onClose: () => void;
  onApplyCalibration: (sensorId: string, offset: number) => void;
}

export const ZeroCalibrationModal: React.FC<ZeroCalibrationModalProps> = ({
  sensor,
  onClose,
  onApplyCalibration,
}) => {
  const [offsetValue, setOffsetValue] = useState<number>(0.0);
  const [calibrated, setCalibrated] = useState(false);

  if (!sensor) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCalibrated(true);
    setTimeout(() => {
      onApplyCalibration(sensor.id, offsetValue);
      setCalibrated(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-[#CBD5E1] p-6 max-w-md w-full elevation-modal">
        {calibrated ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-10 h-10 text-[#059669] mx-auto mb-2 animate-bounce" />
            <h3 className="text-base font-bold text-[#0B1C30]">
              Zero-Offset Calibration Verified
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              ADC bias register adjusted by {offsetValue > 0 ? `+${offsetValue}` : offsetValue} {sensor.unit}.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#006578] uppercase">
                  {sensor.channel} · Transducer Zeroing
                </span>
                <h3 className="text-base font-bold text-[#0B1C30]">
                  {sensor.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#64748B] hover:text-[#0B1C30] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div className="bg-[#F8FAFC] p-3 rounded-md border border-[#E2E8F0]">
                <div className="text-[10px] uppercase font-semibold text-[#64748B] mb-0.5">
                  Raw Hardware Transducer Reading
                </div>
                <div className="text-2xl font-bold font-mono text-[#0B1C30] tabular-nums">
                  {sensor.value.toFixed(2)} {sensor.unit}
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">
                  Point: {sensor.locationPoint} · Sample Rate: {sensor.sampleRate}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Offset Correction</span>
                  <span className="font-mono text-[#006578]">
                    {offsetValue > 0 ? `+${offsetValue}` : offsetValue} {sensor.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min="-2.0"
                  max="2.0"
                  step="0.01"
                  value={offsetValue}
                  onChange={(e) => setOffsetValue(Number(e.target.value))}
                  className="w-full accent-[#0098B3] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <button
                  type="button"
                  onClick={() => setOffsetValue(0)}
                  className="flex items-center gap-1 hover:text-[#0098B3] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Factory Zero</span>
                </button>
                <span className="font-mono text-[11px] text-[#94A3B8]">
                  New Bias: {(sensor.value + offsetValue).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-edge-secondary px-3.5 py-2 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-edge-primary px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Apply Calibration Register
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
