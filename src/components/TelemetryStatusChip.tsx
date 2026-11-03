/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MachineStatus } from '../types/telemetry';

interface TelemetryStatusChipProps {
  status: MachineStatus | 'active';
  label?: string;
  className?: string;
}

export const TelemetryStatusChip: React.FC<TelemetryStatusChipProps> = ({
  status,
  label,
  className = '',
}) => {
  if (status === 'nominal') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
        {label || 'NOMINAL'}
      </span>
    );
  }

  if (status === 'alert') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA] ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
        {label || 'CRITICAL'}
      </span>
    );
  }

  if (status === 'warning') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
        {label || 'WARNING'}
      </span>
    );
  }

  // Active Telemetry State
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.08em] bg-[#ECFEFF] text-[#0E7490] border border-[#A5F3FC] ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#0098B3]" />
      {label || 'TELEMETRY ACTIVE'}
    </span>
  );
};
