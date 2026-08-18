import { useState } from 'react';
import { Cpu, MemoryStick, HardDrive, Battery, Wifi, Monitor, ChevronDown } from 'lucide-react';
import type { SystemInfo } from '@/types/assistant';

interface SystemPanelProps {
  info: SystemInfo;
}

export function SystemPanel({ info }: SystemPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const metrics = [
    { label: 'CPU', value: info.cpu, unit: '%', icon: Cpu, color: 'text-accent-300' },
    { label: 'RAM', value: info.ram, unit: '%', icon: MemoryStick, color: 'text-blue-400' },
    { label: 'Storage', value: info.storage, unit: '%', icon: HardDrive, color: 'text-success' },
    { label: 'Battery', value: info.battery, unit: '%', icon: Battery, color: 'text-warning' },
  { label: 'Network', value: info.network, unit: '', icon: Wifi, color: 'text-accent-300' },
    { label: 'OS', value: info.os, unit: '', icon: Monitor, color: 'text-slate-400' },
  ];

  return (
    <div className="glass-panel rounded-xl">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-400/10 ring-1 ring-accent-400/15">
            <Cpu className="h-3.5 w-3.5 text-accent-300" />
          </div>
          <span className="text-sm font-medium text-slate-200">System</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="border-t border-white/[0.06] px-4 py-3 animate-slide-up">
          <div className="grid grid-cols-2 gap-2.5">
            {metrics.map((m) => {
              const Icon = m.icon;
              const display = m.value === null || m.value === 'unknown' ? '—' : m.value;
              return (
                <div
                  key={m.label}
                  className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2"
                >
                  <div className="mb-1 flex items-center gap-1.5">
                    <Icon className={`h-3.5 w-3.5 ${m.color}`} />
                    <span className="text-xs text-slate-500">{m.label}</span>
                  </div>
                  {typeof m.value === 'number' ? (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-sm font-semibold text-slate-200">{m.value}</span>
                        <span className="text-xs text-slate-500">{m.unit}</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-accent-400/60"
                          style={{ width: `${Math.min(m.value, 100)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm font-medium capitalize text-slate-300">{display}</p>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-2.5 text-xs text-slate-600">Metrics will populate when the backend is connected.</p>
        </div>
      )}
    </div>
  );
}
