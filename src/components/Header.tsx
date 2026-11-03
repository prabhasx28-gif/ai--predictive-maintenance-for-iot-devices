/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ShieldAlert, Pause, Play, RefreshCw } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  streamRateMs: number;
  onStreamRateChange: (rate: number) => void;
  onOpenScramModal: () => void;
  activeAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  isStreaming,
  onToggleStreaming,
  streamRateMs,
  onStreamRateChange,
  onOpenScramModal,
  activeAlertCount,
}) => {
  const navItems = [
    { id: 'fleet', label: 'Fleet Monitor' },
    { id: 'diagnostics', label: 'Machine Inspector' },
    { id: 'automation', label: 'Automation Logic' },
    { id: 'incidents', label: `Incident Log ${activeAlertCount > 0 ? `(${activeAlertCount})` : ''}` },
    { id: 'calibration', label: 'Calibration Lab' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] px-4 lg:px-8 py-3.5 elevation-card">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-md bg-[#0098B3] flex items-center justify-center text-white shadow-[0_0_12px_rgba(0,152,179,0.3)]">
            <Activity className="w-5 h-5 stroke-[2.2]" />
          </div>
          <button
            onClick={() => onTabChange('fleet')}
            className="text-left cursor-pointer focus:outline-none"
          >
            <div className="text-xl font-extrabold tracking-[-0.03em] text-[#0B1C30] flex items-center gap-1.5 whitespace-nowrap">
              <span>EdgePulse</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0098B3] bg-[#ECFEFF] px-1.5 py-0.5 rounded border border-[#A5F3FC]">
                RTOS
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#E5EEFF] text-[#006578] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0B1C30] hover:bg-[#F1F5F9]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Controls & Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Telemetry Stream Control */}
          <div className="flex items-center bg-[#F1F5F9] rounded-md p-0.5 border border-[#E2E8F0] text-xs">
            <button
              onClick={onToggleStreaming}
              title={isStreaming ? 'Pause live stream' : 'Resume live stream'}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                isStreaming
                  ? 'bg-white text-[#006578] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              {isStreaming ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-ping" />
                  <span className="hidden sm:inline">LIVE</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-[#D97706]" />
                  <span className="hidden sm:inline">PAUSED</span>
                </>
              )}
            </button>
            <select
              value={streamRateMs}
              onChange={(e) => onStreamRateChange(Number(e.target.value))}
              className="bg-transparent text-[11px] font-medium text-[#64748B] px-1 py-1 focus:outline-none cursor-pointer"
              title="Stream frequency"
            >
              <option value={250}>250ms</option>
              <option value={500}>500ms</option>
              <option value={1000}>1.0s</option>
              <option value={2000}>2.0s</option>
            </select>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenScramModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-md shadow-xs transition-all active:scale-98 whitespace-nowrap shrink-0"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Interlock</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto pt-2.5 mt-2 border-t border-[#F1F5F9]">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-[#E5EEFF] text-[#006578]'
                  : 'text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
