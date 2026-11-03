/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MachineNode, SensorChannel } from '../types/telemetry';
import { MetricCard } from '../components/MetricCard';
import { MachineNodeCard } from '../components/MachineNodeCard';
import { LiveTelemetryChart, DataPoint } from '../components/LiveTelemetryChart';
import { SensorFeedGrid } from '../components/SensorFeedGrid';
import { Activity, Gauge, Cpu, Zap, Search, Filter, RefreshCw, Download, ShieldCheck } from 'lucide-react';

interface FleetMonitorViewProps {
  machines: MachineNode[];
  liveChartData: DataPoint[];
  isStreaming: boolean;
  onInspectMachine: (machine: MachineNode) => void;
  onQuickAction: (machine: MachineNode, action: string) => void;
  onCalibrateSensor: (sensor: SensorChannel) => void;
  onExportSnapshot: () => void;
}

export const FleetMonitorView: React.FC<FleetMonitorViewProps> = ({
  machines,
  liveChartData,
  isStreaming,
  onInspectMachine,
  onQuickAction,
  onCalibrateSensor,
  onExportSnapshot,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'nominal' | 'warning' | 'alert'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Compute aggregate KPI stats
  const totalMachines = machines.length;
  const nominalCount = machines.filter((m) => m.status === 'nominal').length;
  const warningCount = machines.filter((m) => m.status === 'warning').length;
  const alertCount = machines.filter((m) => m.status === 'alert').length;

  const fleetEquilibrium = Math.round(
    (machines.reduce((acc, m) => acc + m.healthScore, 0) / totalMachines) * 10
  ) / 10;

  const totalPowerDraw = Math.round(machines.reduce((acc, m) => acc + m.powerDraw, 0));
  const avgVibration = (
    machines.reduce((acc, m) => acc + m.vibration, 0) / totalMachines
  ).toFixed(2);
  const avgLatency = (
    machines.reduce((acc, m) => acc + m.edgeLatency, 0) / totalMachines
  ).toFixed(1);

  // Filter machines
  const filteredMachines = machines.filter((m) => {
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Flat sensor channels across machines for the live feed
  const activeSensors = machines.flatMap((m) =>
    m.sensors.map((s) => ({
      ...s,
      name: `${m.id} · ${s.name}`,
    }))
  ).slice(0, 8);

  const categories = ['All', 'Turbine', 'CNC Machine', 'Cryo Pump', 'Robotics', 'Furnace', 'Compressor'];

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Stat Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#006578] font-bold">
            Operations View · Mission-Critical Infrastructure
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Fleet Telemetry Monitor
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportSnapshot}
            className="btn-edge-secondary px-3 py-2 text-xs flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Snapshot</span>
          </button>
        </div>
      </div>

      {/* Aggregate Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Fleet Equilibrium Index"
          value={fleetEquilibrium}
          unit="%"
          trend={[96.2, 97.0, 97.5, 96.8, 97.2, 97.8, fleetEquilibrium]}
          thresholdNotice="Target: >= 95.0%"
          delta="+0.8% nominal"
          deltaType="positive"
          status={fleetEquilibrium >= 95 ? 'nominal' : 'warning'}
          icon={<ShieldCheck className="w-4 h-4" />}
        />

        <MetricCard
          label="Aggregated Power Load"
          value={totalPowerDraw}
          unit="kW"
          trend={[2380, 2410, 2450, 2490, 2520, totalPowerDraw]}
          thresholdNotice="Substation Cap: 3,200 kW"
          delta="+34 kW in shift"
          deltaType="neutral"
          icon={<Zap className="w-4 h-4" />}
        />

        <MetricCard
          label="Mean Radial Vibration"
          value={avgVibration}
          unit="mm/s"
          trend={[2.4, 2.5, 2.7, 2.8, Number(avgVibration)]}
          thresholdNotice="Advisory Limit: 4.5 mm/s"
          delta={alertCount > 0 ? '1 Alert Node' : 'Within Spec'}
          deltaType={alertCount > 0 ? 'negative' : 'positive'}
          status={alertCount > 0 ? 'alert' : warningCount > 0 ? 'warning' : 'nominal'}
          icon={<Activity className="w-4 h-4" />}
        />

        <MetricCard
          label="RTOS Edge Telemetry Latency"
          value={avgLatency}
          unit="ms"
          trend={[1.8, 1.6, 1.4, 1.5, Number(avgLatency)]}
          thresholdNotice="SLA Ceiling: 5.0 ms"
          delta="100% PTP Sync"
          deltaType="positive"
          icon={<Cpu className="w-4 h-4" />}
        />
      </div>

      {/* Real-time Streaming High-Velocity Chart */}
      <LiveTelemetryChart
        data={liveChartData}
        title="High-Frequency Vibration & Thermal Load Trace (TRB-409X Main Rotor)"
        metric1Name="Vibration Velocity"
        metric1Unit="mm/s"
        metric2Name="Stator Thermal Load"
        metric2Unit="°C"
        warnThreshold={4.5}
        tripThreshold={6.0}
        isStreaming={isStreaming}
      />

      {/* Fleet Controls: Filter Tabs, Category Pills, Search */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] p-4 elevation-card space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Filter Tabs (Button-based segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-lg">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-[#0B1C30] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              All Units ({totalMachines})
            </button>
            <button
              onClick={() => setStatusFilter('nominal')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'nominal'
                  ? 'bg-white text-[#065F46] shadow-xs'
                  : 'text-[#64748B] hover:text-[#065F46]'
              }`}
            >
              Nominal ({nominalCount})
            </button>
            <button
              onClick={() => setStatusFilter('warning')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'warning'
                  ? 'bg-white text-[#92400E] shadow-xs'
                  : 'text-[#64748B] hover:text-[#92400E]'
              }`}
            >
              Warning ({warningCount})
            </button>
            <button
              onClick={() => setStatusFilter('alert')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                statusFilter === 'alert'
                  ? 'bg-white text-[#991B1B] shadow-xs'
                  : 'text-[#64748B] hover:text-[#991B1B]'
              }`}
            >
              Alert ({alertCount})
            </button>
          </div>

          {/* Search Input adhering to spec: 40px height, 1px border #CBD5E1 */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by machine ID, name, bay..."
              className="w-full h-10 pl-9 pr-3 text-xs bg-white border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0098B3] focus:ring-2 focus:ring-[#0098B3]/15 transition-all"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <span className="text-[11px] font-semibold text-[#64748B] mr-1 uppercase tracking-wider shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#0098B3] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Machine Nodes Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#64748B]">
            Active Machine Nodes ({filteredMachines.length} of {totalMachines})
          </h3>
          <span className="text-xs text-[#94A3B8]">
            Telemetry interval: 10 kHz Fast-Scan
          </span>
        </div>

        {filteredMachines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMachines.map((machine) => (
              <MachineNodeCard
                key={machine.id}
                machine={machine}
                onInspect={onInspectMachine}
                onQuickAction={onQuickAction}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-8 text-center">
            <p className="text-sm text-[#64748B] mb-2">No machine nodes match the active filter criteria.</p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setCategoryFilter('All');
                setSearchQuery('');
              }}
              className="btn-edge-secondary px-3 py-1.5 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Real-time Sensor Feed Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.05em] text-[#64748B]">
              Multi-Channel Live Sensor Feed Matrix
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Continuous physical layer telemetry streamed from edge RTOS gateways
            </p>
          </div>
          <span className="text-xs font-mono text-[#006578]">
            Buffer Depth: 1024 Samples
          </span>
        </div>

        <SensorFeedGrid
          sensors={activeSensors}
          onCalibrate={onCalibrateSensor}
        />
      </div>
    </div>
  );
};
