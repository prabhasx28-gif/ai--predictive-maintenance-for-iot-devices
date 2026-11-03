/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MachineNode } from '../types/telemetry';
import { TelemetryStatusChip } from './TelemetryStatusChip';
import { ChevronRight, Cpu, Zap, Activity } from 'lucide-react';

interface MachineNodeCardProps {
  machine: MachineNode;
  onInspect: (machine: MachineNode) => void;
  onQuickAction?: (machine: MachineNode, action: string) => void;
}

export const MachineNodeCard: React.FC<MachineNodeCardProps> = ({
  machine,
  onInspect,
  onQuickAction,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-4.5 elevation-card elevation-hover flex flex-col justify-between transition-all group">
      {/* Top Meta Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-semibold text-[#006578] bg-[#E5EEFF] px-1.5 py-0.5 rounded">
                {machine.id}
              </span>
              <span className="text-xs text-[#64748B]">{machine.location}</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#0B1C30] tracking-tight group-hover:text-[#0098B3] transition-colors">
              {machine.name}
            </h4>
          </div>
          <TelemetryStatusChip status={machine.status} />
        </div>

        {/* Telemetry Matrix Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 my-2 border-y border-[#F1F5F9]">
          <div className="bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
              Vibration
            </div>
            <div className="text-sm font-bold text-[#0B1C30] tabular-nums mt-0.5">
              {machine.vibration.toFixed(2)}
              <span className="text-[10px] font-normal text-[#94A3B8] ml-1">mm/s</span>
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
              Thermal
            </div>
            <div className="text-sm font-bold text-[#0B1C30] tabular-nums mt-0.5">
              {machine.thermalLoad.toFixed(1)}
              <span className="text-[10px] font-normal text-[#94A3B8] ml-1">°C</span>
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
            <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B]">
              Pressure
            </div>
            <div className="text-sm font-bold text-[#0B1C30] tabular-nums mt-0.5">
              {machine.pressure.toFixed(1)}
              <span className="text-[10px] font-normal text-[#94A3B8] ml-1">bar</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Meta Subtext */}
        <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-4">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#0098B3]" />
            <span>{machine.edgeGateway}</span>
          </div>
          <div className="tabular-nums">
            Health: <span className="font-semibold text-[#0B1C30]">{machine.healthScore}%</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]">
        <button
          onClick={() => onInspect(machine)}
          className="flex-1 btn-edge-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1 cursor-pointer font-semibold"
        >
          <span>Inspect Machine</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {machine.status !== 'nominal' && onQuickAction && (
          <button
            onClick={() => onQuickAction(machine, 'Auto-Mitigate')}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-md bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] transition-colors cursor-pointer"
            title="Execute safety rule mitigation"
          >
            Mitigate
          </button>
        )}
      </div>
    </div>
  );
};
