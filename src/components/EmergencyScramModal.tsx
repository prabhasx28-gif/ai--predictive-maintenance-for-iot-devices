/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MachineNode } from '../types/telemetry';
import { ShieldAlert, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface EmergencyScramModalProps {
  isOpen: boolean;
  onClose: () => void;
  machines: MachineNode[];
  onExecuteScram: (targetScope: string, reason: string) => void;
}

export const EmergencyScramModal: React.FC<EmergencyScramModalProps> = ({
  isOpen,
  onClose,
  machines,
  onExecuteScram,
}) => {
  const [targetScope, setTargetScope] = useState<string>('GLOBAL_FACILITY');
  const [reason, setReason] = useState<string>('Thermal Runaway / Mechanical Resonance Exceeded');
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [scramExecuted, setScramExecuted] = useState(false);

  if (!isOpen) return null;

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmationCode.toUpperCase() !== 'SCRAM') return;

    setScramExecuted(true);
    setTimeout(() => {
      onExecuteScram(targetScope, reason);
      setScramExecuted(false);
      setConfirmationCode('');
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-[#DC2626] p-6 max-w-lg w-full elevation-modal">
        {scramExecuted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-[#FEF2F2] text-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#FECACA] animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#991B1B]">
              EMERGENCY INTERLOCK DISENGAGED
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Deterministic breaker relays open. Generator excitation tripped.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-4 pb-3 border-b border-[#F1F5F9]">
              <div className="p-2.5 rounded-md bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] shrink-0">
                <AlertOctagon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DC2626]">
                  Safety Interlock Level 3 Action
                </div>
                <h3 className="text-lg font-extrabold text-[#0B1C30]">
                  Execute Emergency SCRAM Shutdown
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Immediately dumps hydraulic pressure, trips electrical feed relays, and halts machinery in &lt; 15 milliseconds.
                </p>
              </div>
            </div>

            <form onSubmit={handleExecute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                  Interlock Target Scope
                </label>
                <select
                  value={targetScope}
                  onChange={(e) => setTargetScope(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
                >
                  <option value="GLOBAL_FACILITY">
                    ⚠️ FULL FACILITY SCRAM (All 6 Machinery Bays)
                  </option>
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      Unit {m.id} Only - {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                  Incident Reason for Emergency Override
                </label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#DC2626]"
                />
              </div>

              <div className="bg-[#FEF2F2] p-3 rounded-md border border-[#FECACA]">
                <label className="block text-xs font-bold text-[#991B1B] mb-1">
                  Type &quot;SCRAM&quot; to authorize safety trip:
                </label>
                <input
                  type="text"
                  required
                  placeholder="SCRAM"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="w-full h-9 px-3 text-xs uppercase font-mono font-bold bg-white border border-[#FECACA] rounded text-[#991B1B] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-edge-secondary px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Cancel / Return
                </button>
                <button
                  type="submit"
                  disabled={confirmationCode.toUpperCase() !== 'SCRAM'}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-md shadow-xs transition-all disabled:opacity-40 cursor-pointer"
                >
                  Confirm SCRAM Shutdown
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
