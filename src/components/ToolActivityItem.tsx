import { Globe, Camera, FileText, Search, StickyNote, Activity, Terminal, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { ToolActivity } from '@/types/assistant';

const iconMap: Record<string, typeof Globe> = {
  Globe,
  Camera,
  FileText,
  Search,
  StickyNote,
  Activity,
  Terminal,
};

export function ToolActivityItem({ tool }: { tool: ToolActivity }) {
  const Icon = iconMap[tool.icon] ?? Terminal;
  const statusIcon = {
    running: <Loader2 className="h-3.5 w-3.5 animate-spin text-warning" />,
    completed: <CheckCircle2 className="h-3.5 w-3.5 text-success" />,
    failed: <XCircle className="h-3.5 w-3.5 text-danger" />,
  }[tool.status];

  const statusLabel = {
    running: 'Running',
    completed: 'Completed',
    failed: 'Failed',
  }[tool.status];

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-space-850/50 px-3 py-2 animate-slide-in">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-400/10 ring-1 ring-accent-400/15">
        <Icon className="h-3.5 w-3.5 text-accent-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-xs font-medium text-slate-300">{tool.label}</p>
        {tool.detail && <p className="truncate text-xs text-slate-500">{tool.detail}</p>}
      </div>
      <div className="flex items-center gap-1.5">
        {statusIcon}
        <span className="text-xs text-slate-500">{statusLabel}</span>
      </div>
    </div>
  );
}
