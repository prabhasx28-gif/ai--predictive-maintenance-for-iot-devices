/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AutomationRule, EdgeGateway, MachineNode } from '../types/telemetry';
import { TelemetryStatusChip } from '../components/TelemetryStatusChip';
import { Plus, Server, RefreshCw, Zap, ShieldAlert, CheckCircle, Sliders, Play, RotateCcw, Flame } from 'lucide-react';

interface AutomationEngineViewProps {
  rules: AutomationRule[];
  gateways: EdgeGateway[];
  machines: MachineNode[];
  onToggleRule: (ruleId: string) => void;
  onAddRule: (rule: Omit<AutomationRule, 'id' | 'executionCount' | 'lastTriggered'>) => void;
  onSimulateRule: (rule: AutomationRule) => void;
  onSyncGateways: () => void;
  onManualCommand: (commandName: string) => void;
}

export const AutomationEngineView: React.FC<AutomationEngineViewProps> = ({
  rules,
  gateways,
  machines,
  onToggleRule,
  onAddRule,
  onSimulateRule,
  onSyncGateways,
  onManualCommand,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // New Rule form state
  const [newRuleName, setNewRuleName] = useState('');
  const [conditionMetric, setConditionMetric] = useState<'vibration' | 'thermalLoad' | 'pressure' | 'rpm' | 'edgeLatency'>('vibration');
  const [operator, setOperator] = useState<'>' | '<' | '>=' | '<='>('>=');
  const [threshold, setThreshold] = useState<number>(5.0);
  const [durationSeconds, setDurationSeconds] = useState<number>(2.0);
  const [targetMachineId, setTargetMachineId] = useState<string>('ALL');
  const [actionDescription, setActionDescription] = useState('');
  const [safetyLevel, setSafetyLevel] = useState<'Level 1 Info' | 'Level 2 Auto-Mitigate' | 'Level 3 Scram Interlock'>('Level 2 Auto-Mitigate');
  const [actionType, setActionType] = useState<'throttle' | 'interlock' | 'coolant_boost' | 'purge' | 'notify'>('throttle');

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      onSyncGateways();
      setSyncFeedback('Rules compiled and pushed to 3 RTOS Gateway instances via IEEE 1588 real-time bus.');
      setTimeout(() => setSyncFeedback(null), 4000);
    }, 1500);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const unitMap: Record<string, string> = {
      vibration: 'mm/s',
      thermalLoad: '°C',
      pressure: 'bar',
      rpm: 'RPM',
      edgeLatency: 'ms',
    };

    onAddRule({
      name: newRuleName,
      conditionMetric,
      operator,
      threshold,
      unit: unitMap[conditionMetric] || '',
      durationSeconds,
      targetMachineId,
      actionDescription: actionDescription || `Automatically execute ${actionType} on target unit.`,
      actionType,
      safetyLevel,
      isActive: true,
    });

    // Reset and close
    setNewRuleName('');
    setActionDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#006578] font-bold">
            Real-Time Deterministic Control · Sub-5ms Interlock Loop
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Automation Infrastructure & Safety Interlocks
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-edge-secondary px-3.5 py-2 text-xs flex items-center gap-1.5 cursor-pointer font-semibold disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Deploying to Gateways...' : 'Push Rules to Edge RTOS'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-edge-primary px-3.5 py-2 text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Safety Rule</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#059669]" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Edge Gateways Status Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.05em] text-[#64748B]">
            Connected Edge RTOS Gateways ({gateways.length} Nodes)
          </h3>
          <span className="text-xs font-mono text-[#006578]">Sub-millisecond Precision Time Protocol</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {gateways.map((gw) => (
            <div
              key={gw.id}
              className="bg-white rounded-lg border border-[#E2E8F0] p-4 elevation-card elevation-hover"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#0098B3]" />
                    <span className="font-mono text-xs font-bold text-[#0B1C30]">
                      {gw.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B] font-mono truncate">
                    {gw.ipAddress} · {gw.location}
                  </div>
                </div>
                <TelemetryStatusChip status={gw.status} />
              </div>

              <div className="grid grid-cols-3 gap-1.5 py-2 my-2 border-y border-[#F1F5F9] text-center text-xs">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-[#94A3B8]">CPU</div>
                  <div className="font-mono font-bold text-[#0B1C30] tabular-nums">{gw.cpuUsage}%</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-[#94A3B8]">RAM</div>
                  <div className="font-mono font-bold text-[#0B1C30] tabular-nums">{gw.memoryUsage}%</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-[#94A3B8]">Packet Loss</div>
                  <div className="font-mono font-bold text-[#059669] tabular-nums">{gw.packetLossRate}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                <span>Active Nodes: <b className="text-[#0B1C30]">{gw.activeNodes}</b></span>
                <span className="text-[10px] text-[#006578] font-mono">Sync: {gw.lastSync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automation Rules Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4.5 elevation-card space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#0B1C30]">
              Active Automation Rules & Hardware Interlocks
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Interlocks run deterministically on gateway DSP hardware to protect capital assets
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#006578]">
            {rules.filter((r) => r.isActive).length} Armed / {rules.length} Total
          </span>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => {
            const isScram = rule.safetyLevel === 'Level 3 Scram Interlock';
            const isMitigate = rule.safetyLevel === 'Level 2 Auto-Mitigate';

            return (
              <div
                key={rule.id}
                className={`p-4 rounded-lg border transition-all ${
                  rule.isActive
                    ? 'bg-white border-[#CBD5E1] shadow-xs'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] opacity-60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    {/* Checkbox adhering to spec: 18x18px box, radius 4px */}
                    <input
                      type="checkbox"
                      checked={rule.isActive}
                      onChange={() => onToggleRule(rule.id)}
                      className="w-[18px] h-[18px] rounded border-[#94A3B8] accent-[#0098B3] cursor-pointer"
                      title="Toggle rule armed status"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#006578]">
                          {rule.id}
                        </span>
                        <h4 className="text-sm font-bold text-[#0B1C30]">
                          {rule.name}
                        </h4>
                      </div>
                      <div className="text-xs text-[#64748B]">
                        Target: <span className="font-semibold text-[#0B1C30]">{rule.targetMachineId}</span> · Hysteresis: <span className="font-mono text-[#0B1C30]">{rule.durationSeconds}s</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isScram
                          ? 'bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]'
                          : isMitigate
                          ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]'
                          : 'bg-[#EFF4FF] text-[#006578] border-[#CFFAFE]'
                      }`}
                    >
                      {rule.safetyLevel}
                    </span>

                    <button
                      onClick={() => onSimulateRule(rule)}
                      className="btn-edge-secondary px-2.5 py-1 text-xs flex items-center gap-1 cursor-pointer font-semibold text-[#64748B] hover:text-[#0098B3]"
                      title="Simulate rule condition trigger safely"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Simulate Trigger</span>
                    </button>
                  </div>
                </div>

                {/* Condition Expression Strip */}
                <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0] text-xs font-mono flex flex-wrap items-center justify-between gap-2 mt-2">
                  <div className="text-[#0B1C30]">
                    <span className="text-[#64748B] font-bold">IF </span>
                    <span className="text-[#0098B3] font-bold">{rule.conditionMetric}</span>{' '}
                    <span className="text-[#D97706] font-bold">{rule.operator}</span>{' '}
                    <span className="text-[#DC2626] font-bold">{rule.threshold} {rule.unit}</span>{' '}
                    <span className="text-[#64748B]">FOR {rule.durationSeconds}s</span>
                  </div>

                  <div className="text-[#64748B] text-[11px]">
                    Action: <span className="font-sans font-semibold text-[#0B1C30]">{rule.actionDescription}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#94A3B8] pt-2 px-1">
                  <span>Execution Trips: <b className="text-[#0B1C30] font-mono">{rule.executionCount}</b></span>
                  <span>Last Triggered: <b className="text-[#64748B]">{rule.lastTriggered || 'Never'}</b></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Emergency Command Panel */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4.5 elevation-card">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F1F5F9]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#0B1C30]">
              Direct Manual Actuator Command Panel
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Emergency overrides for field technicians with level-2 authorization
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onManualCommand('Purge Vibration Dampener Hydraulic Reservoir')}
            className="p-3 bg-[#F8FAFC] hover:bg-[#EFF4FF] border border-[#CBD5E1] hover:border-[#0098B3] rounded-lg text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#0B1C30] group-hover:text-[#0098B3]">Purge Dampener</span>
              <RotateCcw className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#0098B3]" />
            </div>
            <p className="text-[11px] text-[#64748B]">Force high-pressure nitrogen flush on journal bearing line.</p>
          </button>

          <button
            onClick={() => onManualCommand('Boost Glycol Chilled Loop to 100%')}
            className="p-3 bg-[#F8FAFC] hover:bg-[#EFF4FF] border border-[#CBD5E1] hover:border-[#0098B3] rounded-lg text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#0B1C30] group-hover:text-[#0098B3]">Boost Coolant Flow</span>
              <Zap className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#0098B3]" />
            </div>
            <p className="text-[11px] text-[#64748B]">Activate dual secondary chillers for CNC & induction bays.</p>
          </button>

          <button
            onClick={() => onManualCommand('Reset Emergency SCRAM Relay Latch')}
            className="p-3 bg-[#F8FAFC] hover:bg-[#EFF4FF] border border-[#CBD5E1] hover:border-[#0098B3] rounded-lg text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#0B1C30] group-hover:text-[#0098B3]">Reset SCRAM Latch</span>
              <ShieldAlert className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#0098B3]" />
            </div>
            <p className="text-[11px] text-[#64748B]">Clear physical latch coil after verifying zero RPM standstill.</p>
          </button>

          <button
            onClick={() => onManualCommand('Cycle Vacuum Chamber Forepump')}
            className="p-3 bg-[#F8FAFC] hover:bg-[#EFF4FF] border border-[#CBD5E1] hover:border-[#0098B3] rounded-lg text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#0B1C30] group-hover:text-[#0098B3]">Cycle Vacuum Pump</span>
              <Flame className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#0098B3]" />
            </div>
            <p className="text-[11px] text-[#64748B]">Re-establish rough vacuum plenum pressure below 0.02 mbar.</p>
          </button>
        </div>
      </div>

      {/* New Rule Modal adhering to Elevation Level 3 and Input Specs */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#CBD5E1] p-6 max-w-xl w-full elevation-modal">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F1F5F9]">
              <div>
                <h3 className="text-base font-bold text-[#0B1C30]">
                  Configure RTOS Safety Interlock Rule
                </h3>
                <p className="text-xs text-[#64748B]">
                  Pushed directly to edge gateway DSP memory for deterministic execution
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#64748B] hover:text-[#0B1C30] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                  Rule Name / Identifier
                </label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Spindle High Temp Automatic Throttle"
                  className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0098B3] focus:ring-2 focus:ring-[#0098B3]/15"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Target Machine
                  </label>
                  <select
                    value={targetMachineId}
                    onChange={(e) => setTargetMachineId(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  >
                    <option value="ALL">ALL Fleet Units</option>
                    {machines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id} ({m.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Telemetry Metric
                  </label>
                  <select
                    value={conditionMetric}
                    onChange={(e) => setConditionMetric(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  >
                    <option value="vibration">Vibration Velocity (mm/s)</option>
                    <option value="thermalLoad">Thermal Load (°C)</option>
                    <option value="pressure">Pressure (bar)</option>
                    <option value="rpm">Rotor Velocity (RPM)</option>
                    <option value="edgeLatency">Network Latency (ms)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Operator
                  </label>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  >
                    <option value=">=">&gt;= (Greater or Equal)</option>
                    <option value="<=">&lt;= (Less or Equal)</option>
                    <option value=">">&gt; (Strictly Greater)</option>
                    <option value="<">&lt; (Strictly Less)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Threshold
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Duration (s)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    required
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(Number(e.target.value))}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Safety Interlock Level
                  </label>
                  <select
                    value={safetyLevel}
                    onChange={(e) => setSafetyLevel(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  >
                    <option value="Level 1 Info">Level 1 Info</option>
                    <option value="Level 2 Auto-Mitigate">Level 2 Auto-Mitigate</option>
                    <option value="Level 3 Scram Interlock">Level 3 Scram Interlock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                    Action Type
                  </label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] focus:outline-none focus:border-[#0098B3]"
                  >
                    <option value="throttle">Throttle Speed / Load</option>
                    <option value="interlock">Emergency SCRAM Trip</option>
                    <option value="coolant_boost">Engage Secondary Coolant</option>
                    <option value="purge">Nitrogen Dampener Purge</option>
                    <option value="notify">Log Advisory Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1C30] mb-1">
                  Action Detail Description
                </label>
                <input
                  type="text"
                  value={actionDescription}
                  onChange={(e) => setActionDescription(e.target.value)}
                  placeholder="e.g. Cut RF power by 50% and engage cold glycol loop."
                  className="w-full h-10 px-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0098B3]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-edge-secondary px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-edge-primary px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Save & Arm Interlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
