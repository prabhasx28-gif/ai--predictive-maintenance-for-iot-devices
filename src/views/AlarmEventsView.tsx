/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TelemetryAlert, MachineNode } from '../types/telemetry';
import { TelemetryStatusChip } from '../components/TelemetryStatusChip';
import { AlertTriangle, CheckCircle, ShieldAlert, Bell, Download, Search, UserCheck, MessageSquare } from 'lucide-react';

interface AlarmEventsViewProps {
  alerts: TelemetryAlert[];
  machines: MachineNode[];
  onAcknowledgeAlert: (alertId: string, engineerName: string) => void;
  onDispatchTech: (alertId: string, techName: string) => void;
  onAddNote: (alertId: string, note: string) => void;
}

export const AlarmEventsView: React.FC<AlarmEventsViewProps> = ({
  alerts,
  machines,
  onAcknowledgeAlert,
  onDispatchTech,
  onAddNote,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [showAckOnly, setShowAckOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Note dialog
  const [activeNoteAlertId, setActiveNoteAlertId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredAlerts = alerts.filter((a) => {
    const matchesSev = severityFilter === 'all' || a.severity === severityFilter;
    const matchesAck = showAckOnly ? !a.acknowledged : true;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.machineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.machineId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesAck && matchesSearch;
  });

  const exportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Machine ID', 'Machine Name', 'Severity', 'Title', 'Value', 'Acknowledged', 'Acknowledged By'];
    const rows = filteredAlerts.map((a) => [
      a.id,
      a.timestamp,
      a.machineId,
      `"${a.machineName}"`,
      a.severity,
      `"${a.title}"`,
      `"${a.metricValue}"`,
      a.acknowledged ? 'YES' : 'NO',
      `"${a.acknowledgedBy || 'Unassigned'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edgepulse_alarms_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#006578] font-bold">
            Real-Time Machine Incident Triage & Event Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Alarm Events & Condition Advisory
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="btn-edge-secondary px-3.5 py-2 text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Incident Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter and Triage Bar */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 elevation-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Severity tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
          {(['all', 'critical', 'warning', 'info'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                severityFilter === s
                  ? 'bg-white text-[#0B1C30] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              {s === 'all' ? `All (${alerts.length})` : s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-[#0B1C30] font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={showAckOnly}
              onChange={(e) => setShowAckOnly(e.target.checked)}
              className="w-4 h-4 rounded border-[#CBD5E1] accent-[#0098B3]"
            />
            <span>Unacknowledged Only</span>
          </label>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search incidents..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0098B3]"
            />
          </div>
        </div>
      </div>

      {/* Alarm Events Feed */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => {
            const isCrit = alert.severity === 'critical';
            const isWarn = alert.severity === 'warning';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all ${
                  isCrit
                    ? 'bg-[#FEF2F2]/40 border-[#FECACA]'
                    : isWarn
                    ? 'bg-[#FFFBEB]/40 border-[#FDE68A]'
                    : 'bg-white border-[#E2E8F0]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-md mt-0.5 ${
                        isCrit
                          ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
                          : isWarn
                          ? 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]'
                          : 'bg-[#EFF4FF] text-[#006578] border border-[#CFFAFE]'
                      }`}
                    >
                      {isCrit ? (
                        <ShieldAlert className="w-4 h-4 stroke-[2.2]" />
                      ) : isWarn ? (
                        <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
                      ) : (
                        <Bell className="w-4 h-4 stroke-[2.2]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-[#0B1C30]">
                          {alert.id}
                        </span>
                        <span className="text-xs text-[#64748B]">·</span>
                        <span className="text-xs font-mono text-[#006578] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                          {alert.machineId}
                        </span>
                        <span className="text-xs text-[#64748B]">·</span>
                        <span className="text-xs text-[#64748B] font-mono">{alert.timestamp}</span>
                      </div>

                      <h4 className="text-sm font-bold text-[#0B1C30]">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-[#64748B] mt-0.5">{alert.description}</p>
                    </div>
                  </div>

                  {/* Value and Severity Tag */}
                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
                        Peak Metric
                      </div>
                      <div className="text-sm font-bold text-[#0B1C30] font-mono tabular-nums">
                        {alert.metricValue}
                      </div>
                    </div>

                    <TelemetryStatusChip
                      status={isCrit ? 'alert' : isWarn ? 'warning' : 'nominal'}
                      label={alert.severity.toUpperCase()}
                    />
                  </div>
                </div>

                {/* Triage Action Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t border-[#F1F5F9] text-xs">
                  <div className="flex items-center gap-2">
                    {alert.acknowledged ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#065F46] bg-[#ECFDF5] px-2.5 py-1 rounded border border-[#A7F3D0] font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-[#059669]" />
                        Acknowledged by {alert.acknowledgedBy} ({alert.acknowledgedAt || 'Today'})
                      </span>
                    ) : (
                      <button
                        onClick={() => onAcknowledgeAlert(alert.id, 'J. Mercer (Lead Systems Engineer)')}
                        className="btn-edge-primary px-3 py-1 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Acknowledge Incident</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDispatchTech(alert.id, 'E. Vance (Field Metrology)')}
                      className="btn-edge-secondary px-3 py-1 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Dispatch Field Tech</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveNoteAlertId(alert.id);
                        setNoteText('');
                      }}
                      className="p-1 text-[#64748B] hover:text-[#0098B3] rounded"
                      title="Add diagnostic note"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-[#94A3B8]">
                    RTOS Alarm Relay ID: #REL-{alert.id.split('-')[1]}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-8 text-center">
            <CheckCircle className="w-8 h-8 text-[#059669] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0B1C30]">No Active Alarms in Selected Filter</p>
            <p className="text-xs text-[#64748B]">All connected automation units are within nominal operating limits.</p>
          </div>
        )}
      </div>

      {/* Note Modal */}
      {activeNoteAlertId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#CBD5E1] p-5 max-w-md w-full elevation-modal">
            <h3 className="text-sm font-bold text-[#0B1C30] mb-2">
              Append Engineering Log Note (Incident {activeNoteAlertId})
            </h3>
            <textarea
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Inspected front bearing oil manifold; pressure restored to 34 bar."
              className="w-full p-2.5 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0098B3] mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveNoteAlertId(null)}
                className="btn-edge-secondary px-3 py-1.5 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (noteText.trim()) {
                    onAddNote(activeNoteAlertId, noteText);
                  }
                  setActiveNoteAlertId(null);
                }}
                className="btn-edge-primary px-3 py-1.5 text-xs font-semibold cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
