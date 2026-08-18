import type { AssistantState } from '@/types/assistant';

interface StatusBarProps {
  state: AssistantState;
  assistantName: string;
}

const stateConfig: Record<AssistantState, { dot: string; text: string; glow: string }> = {
  ONLINE: { dot: 'bg-accent-400', text: 'text-accent-300', glow: 'shadow-[0_0_8px_rgba(22,199,245,0.6)]' },
  LISTENING: { dot: 'bg-success', text: 'text-success', glow: 'shadow-[0_0_8px_rgba(45,212,191,0.6)]' },
  THINKING: { dot: 'bg-blue-400', text: 'text-blue-400', glow: 'shadow-[0_0_8px_rgba(91,141,255,0.6)]' },
  SPEAKING: { dot: 'bg-accent-300', text: 'text-accent-200', glow: 'shadow-[0_0_8px_rgba(22,199,245,0.7)]' },
  EXECUTING: { dot: 'bg-warning', text: 'text-warning', glow: 'shadow-[0_0_8px_rgba(251,191,36,0.6)]' },
  ERROR: { dot: 'bg-danger', text: 'text-danger', glow: 'shadow-[0_0_8px_rgba(248,113,113,0.6)]' },
};

export function StatusBar({ state, assistantName }: StatusBarProps) {
  const cfg = stateConfig[state];

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-wide text-slate-100">{assistantName}</h1>
        <div className={`flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1`}>
          <span className={`h-2 w-2 rounded-full ${cfg.dot} ${cfg.glow} ${state === 'LISTENING' || state === 'THINKING' ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-medium ${cfg.text}`}>{state}</span>
        </div>
      </div>
      <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
        <span className="font-mono">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}
