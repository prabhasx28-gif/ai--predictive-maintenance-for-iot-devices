/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, Maximize2, Radio } from 'lucide-react';

export interface DataPoint {
  time: string;
  timestamp: number;
  val1: number; // primary stream (e.g. Vibration mm/s)
  val2: number; // secondary stream (e.g. Thermal load / Spindle RPM / etc)
}

interface LiveTelemetryChartProps {
  data: DataPoint[];
  title: string;
  metric1Name: string;
  metric1Unit: string;
  metric2Name: string;
  metric2Unit: string;
  warnThreshold?: number;
  tripThreshold?: number;
  isStreaming: boolean;
  onResetBuffer?: () => void;
}

export const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({
  data,
  title,
  metric1Name,
  metric1Unit,
  metric2Name,
  metric2Unit,
  warnThreshold = 4.5,
  tripThreshold = 6.0,
  isStreaming,
  onResetBuffer,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<'30s' | '2m' | '10m'>('30s');
  const [activeChannel, setActiveChannel] = useState<'both' | 'ch1' | 'ch2'>('both');

  // Chart dimensions
  const width = 800;
  const height = 220;
  const padding = { top: 24, right: 30, bottom: 28, left: 45 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Filter or slice by timeRange
  const sliceCount = timeRange === '30s' ? 30 : timeRange === '2m' ? 60 : 100;
  const displayData = data.slice(-sliceCount);

  // Scalers for val1
  const vals1 = displayData.map((d) => d.val1);
  const minVal1 = Math.min(...vals1, 0);
  const maxVal1 = Math.max(...vals1, tripThreshold * 1.1, 7.0);

  // Scalers for val2
  const vals2 = displayData.map((d) => d.val2);
  const minVal2 = Math.min(...vals2, 0);
  const maxVal2 = Math.max(...vals2, 100);

  const getX = (index: number) => {
    if (displayData.length <= 1) return padding.left;
    return padding.left + (index / (displayData.length - 1)) * plotWidth;
  };

  const getY1 = (val: number) => {
    return padding.top + plotHeight - ((val - minVal1) / (maxVal1 - minVal1 || 1)) * plotHeight;
  };

  const getY2 = (val: number) => {
    return padding.top + plotHeight - ((val - minVal2) / (maxVal2 - minVal2 || 1)) * plotHeight;
  };

  const line1Points = displayData.map((d, i) => `${getX(i)},${getY1(d.val1)}`).join(' ');
  const line2Points = displayData.map((d, i) => `${getX(i)},${getY2(d.val2)}`).join(' ');

  const warnY = getY1(warnThreshold);
  const tripY = getY1(tripThreshold);

  const activePoint = hoverIndex !== null && displayData[hoverIndex] ? displayData[hoverIndex] : displayData[displayData.length - 1];

  return (
    <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 elevation-card">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0098B3]" />
          <h3 className="text-sm font-bold text-[#0B1C30] tracking-tight">{title}</h3>
          <span className="text-[11px] font-semibold text-[#0E7490] bg-[#ECFEFF] px-2 py-0.5 rounded border border-[#A5F3FC] uppercase tracking-wider">
            {isStreaming ? 'STREAM: 10 kHz SYNCHRONIZED' : 'BUFFER FROZEN'}
          </span>
        </div>

        {/* Chart Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Channel selector */}
          <div className="flex items-center bg-[#F1F5F9] rounded-md p-0.5 text-xs">
            <button
              onClick={() => setActiveChannel('both')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                activeChannel === 'both' ? 'bg-white text-[#006578] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Dual Trace
            </button>
            <button
              onClick={() => setActiveChannel('ch1')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                activeChannel === 'ch1' ? 'bg-white text-[#0098B3] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              {metric1Name.split(' ')[0]}
            </button>
            <button
              onClick={() => setActiveChannel('ch2')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                activeChannel === 'ch2' ? 'bg-white text-[#0284C7] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              {metric2Name.split(' ')[0]}
            </button>
          </div>

          {/* Time range selector */}
          <div className="flex items-center bg-[#F1F5F9] rounded-md p-0.5 text-xs">
            {(['30s', '2m', '10m'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                  timeRange === r ? 'bg-white text-[#0B1C30] shadow-xs' : 'text-[#64748B]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {onResetBuffer && (
            <button
              onClick={onResetBuffer}
              title="Reset sample window"
              className="p-1 text-[#64748B] hover:text-[#0098B3] hover:bg-[#F1F5F9] rounded"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Real-time Metric Readout Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 bg-[#F8FAFC] p-2.5 rounded-md border border-[#E2E8F0]">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-[#0098B3]" />
            {metric1Name}
          </div>
          <div className="text-base font-bold text-[#0B1C30] tabular-nums">
            {activePoint?.val1.toFixed(2)} <span className="text-xs font-normal text-[#94A3B8]">{metric1Unit}</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#64748B] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-[#0284C7]" />
            {metric2Name}
          </div>
          <div className="text-base font-bold text-[#0B1C30] tabular-nums">
            {activePoint?.val2.toFixed(1)} <span className="text-xs font-normal text-[#94A3B8]">{metric2Unit}</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#D97706] flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-[#D97706]" />
            Advisory Threshold
          </div>
          <div className="text-base font-bold text-[#D97706] tabular-nums">
            {warnThreshold.toFixed(2)} <span className="text-xs font-normal text-[#94A3B8]">{metric1Unit}</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#DC2626] flex items-center gap-1.5">
            <span className="w-2 h-0.5 bg-[#DC2626]" />
            Scram Trip Limit
          </div>
          <div className="text-base font-bold text-[#DC2626] tabular-nums">
            {tripThreshold.toFixed(2)} <span className="text-xs font-normal text-[#94A3B8]">{metric1Unit}</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Chart */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair overflow-visible"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            if (relX >= padding.left && relX <= width - padding.right) {
              const fraction = (relX - padding.left) / plotWidth;
              const idx = Math.round(fraction * (displayData.length - 1));
              setHoverIndex(Math.max(0, Math.min(displayData.length - 1, idx)));
            }
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="primaryWaveGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0098B3" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0098B3" stopOpacity="0.0" />
            </linearGradient>
            <pattern id="chartGrid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="#FFFFFF"
          />
          <rect
            x={padding.left}
            y={padding.top}
            width={plotWidth}
            height={plotHeight}
            fill="url(#chartGrid)"
          />

          {/* Horizontal Axis Ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = padding.top + plotHeight * pct;
            const val = maxVal1 - pct * (maxVal1 - minVal1);
            return (
              <g key={i}>
                <line
                  x1={padding.left - 4}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeWidth="0.5"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily="Anybody"
                  fill="#94A3B8"
                  className="tabular-nums"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Warning Limit Line */}
          {warnThreshold <= maxVal1 && (
            <g>
              <line
                x1={padding.left}
                y1={warnY}
                x2={width - padding.right}
                y2={warnY}
                stroke="#D97706"
                strokeWidth="1.2"
                strokeDasharray="4 3"
              />
              <text
                x={width - padding.right - 4}
                y={warnY - 4}
                textAnchor="end"
                fontSize="9"
                fontWeight="600"
                fill="#D97706"
              >
                WARN {warnThreshold}
              </text>
            </g>
          )}

          {/* Trip Limit Line */}
          {tripThreshold <= maxVal1 && (
            <g>
              <line
                x1={padding.left}
                y1={tripY}
                x2={width - padding.right}
                y2={tripY}
                stroke="#DC2626"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <text
                x={width - padding.right - 4}
                y={tripY - 4}
                textAnchor="end"
                fontSize="9"
                fontWeight="700"
                fill="#DC2626"
              >
                TRIP {tripThreshold}
              </text>
            </g>
          )}

          {/* Primary Channel Polygon and Line */}
          {(activeChannel === 'both' || activeChannel === 'ch1') && (
            <>
              {displayData.length > 1 && (
                <polygon
                  points={`${padding.left},${padding.top + plotHeight} ${line1Points} ${width - padding.right},${padding.top + plotHeight}`}
                  fill="url(#primaryWaveGrad)"
                />
              )}
              <polyline
                fill="none"
                stroke="#0098B3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={line1Points}
              />
            </>
          )}

          {/* Secondary Channel Line */}
          {(activeChannel === 'both' || activeChannel === 'ch2') && (
            <polyline
              fill="none"
              stroke="#0284C7"
              strokeWidth="1.5"
              strokeDasharray="5 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={line2Points}
            />
          )}

          {/* Hover Crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + plotHeight}
                stroke="#0B1C30"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Primary point indicator */}
              {(activeChannel === 'both' || activeChannel === 'ch1') && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY1(displayData[hoverIndex].val1)}
                  r="4"
                  fill="#0098B3"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
            </g>
          )}

          {/* Base X Axis line */}
          <line
            x1={padding.left}
            y1={padding.top + plotHeight}
            x2={width - padding.right}
            y2={padding.top + plotHeight}
            stroke="#CBD5E1"
            strokeWidth="1"
          />

          {/* Timestamp labels on X axis */}
          {displayData.length > 0 && (
            <>
              <text
                x={padding.left}
                y={height - 8}
                textAnchor="start"
                fontSize="9"
                fontFamily="Anybody"
                fill="#94A3B8"
              >
                -{timeRange}
              </text>
              <text
                x={width - padding.right}
                y={height - 8}
                textAnchor="end"
                fontSize="9"
                fontFamily="Anybody"
                fill="#0098B3"
                fontWeight="600"
              >
                {displayData[displayData.length - 1].time} (NOW)
              </text>
            </>
          )}
        </svg>

        {/* Hover Readout Tooltip */}
        {hoverIndex !== null && displayData[hoverIndex] && (
          <div
            className="absolute z-10 pointer-events-none bg-[#0B1C30] text-white text-[11px] px-2.5 py-1.5 rounded shadow-lg border border-slate-700 font-mono"
            style={{
              left: `${Math.min(85, Math.max(10, (getX(hoverIndex) / width) * 100))}%`,
              top: '15%',
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold text-cyan-300">{displayData[hoverIndex].time}</div>
            <div>
              {metric1Name}: <span className="font-bold">{displayData[hoverIndex].val1.toFixed(2)}</span> {metric1Unit}
            </div>
            <div>
              {metric2Name}: <span className="font-bold">{displayData[hoverIndex].val2.toFixed(1)}</span> {metric2Unit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
