/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit: string;
  trend?: number[];
  thresholdNotice?: string;
  status?: 'nominal' | 'warning' | 'alert';
  icon?: React.ReactNode;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  trend = [],
  thresholdNotice,
  status = 'nominal',
  icon,
  delta,
  deltaType = 'neutral',
  onClick,
}) => {
  // Sparkline calculation
  const minVal = trend.length > 0 ? Math.min(...trend) : 0;
  const maxVal = trend.length > 0 ? Math.max(...trend) : 100;
  const range = maxVal - minVal || 1;
  const width = 120;
  const height = 34;

  const points = trend.map((v, i) => {
    const x = (i / Math.max(1, trend.length - 1)) * width;
    const y = height - ((v - minVal) / range) * (height - 6) - 3;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor =
    status === 'alert'
      ? '#DC2626'
      : status === 'warning'
      ? '#D97706'
      : '#0098B3';

  const fillColor =
    status === 'alert'
      ? 'rgba(220, 38, 38, 0.08)'
      : status === 'warning'
      ? 'rgba(217, 119, 6, 0.08)'
      : 'rgba(0, 152, 179, 0.08)';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-[#E2E8F0] p-4 elevation-card elevation-hover flex flex-col justify-between transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-[0.05em] text-[#64748B]">
          {label}
        </span>
        {icon && (
          <span className="text-[#64748B] hover:text-[#0098B3] transition-colors">
            {icon}
          </span>
        )}
      </div>

      {/* Main Metric Value & Unit */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[32px] sm:text-[36px] font-bold text-[#0B1C30] leading-none tracking-[-0.02em] tabular-nums">
          {value}
        </span>
        <span className="text-xs font-normal text-[#94A3B8]">{unit}</span>
      </div>

      {/* Footer / Sparkline & Delta */}
      <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
        {trend.length > 1 ? (
          <div className="w-[120px] h-[34px] overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id={`grad-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,${height} ${points} ${width},${height}`}
                fill={`url(#grad-${label.replace(/\s+/g, '')})`}
              />
              <polyline
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        ) : (
          <span className="text-[11px] text-[#94A3B8]">Buffer Synchronized</span>
        )}

        <div className="text-right">
          {delta && (
            <span
              className={`text-[11px] font-semibold tabular-nums ${
                deltaType === 'positive'
                  ? 'text-[#059669]'
                  : deltaType === 'negative'
                  ? 'text-[#DC2626]'
                  : 'text-[#64748B]'
              }`}
            >
              {delta}
            </span>
          )}
          {thresholdNotice && (
            <div className="text-[10px] text-[#94A3B8] tracking-tight">
              {thresholdNotice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
