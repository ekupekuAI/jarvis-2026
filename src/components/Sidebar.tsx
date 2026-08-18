import { useState } from 'react';
import {
  Plus,
  Search,
  Settings as SettingsIcon,
  PanelLeftClose,
  PanelLeft,
  MessageSquare,
  Trash2,
  Cpu,
} from 'lucide-react';
import type { Conversation } from '@/types/assistant';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  groupedConversations: Record<string, Conversation[]>;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenSettings: () => void;
  assistantName: string;
}

export function Sidebar({
  collapsed,
  onToggle,
  conversations,
  activeConversationId,
  groupedConversations,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  onOpenSettings,
  assistantName,
}: SidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = search
    ? conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
    : null;

  const groups = filtered ? { Results: filtered } : groupedConversations;

  if (collapsed) {
    return (
      <aside className="flex w-16 flex-col items-center gap-4 border-r border-white/[0.06] bg-space-900/40 py-4 backdrop-blur-xl">
        <button
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-accent-300"
          aria-label="Expand sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        <button
          onClick={onNewConversation}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-accent-300"
          aria-label="New conversation"
        >
          <Plus className="h-5 w-5" />
        </button>
        <button
          onClick={onOpenSettings}
          className="mt-auto flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-accent-300"
          aria-label="Settings"
        >
          <SettingsIcon className="h-5 w-5" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex w-72 flex-col border-r border-white/[0.06] bg-space-900/40 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-400/20 to-accent-600/10 ring-1 ring-accent-400/30">
            <Cpu className="h-5 w-5 text-accent-300" />
          </div>
          <span className="text-lg font-semibold tracking-wide text-slate-100">{assistantName}</span>
        </div>
        <button
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-accent-300"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>

      {/* New conversation */}
      <div className="px-3">
        <button
          onClick={onNewConversation}
          className="group flex w-full items-center gap-2.5 rounded-xl border border-accent-400/20 bg-accent-400/5 px-3.5 py-2.5 text-sm font-medium text-accent-200 transition hover:border-accent-400/40 hover:bg-accent-400/10"
        >
          <Plus className="h-4 w-4 transition group-hover:rotate-90" />
          New Conversation
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-accent-400/30 focus:bg-white/[0.04]"
          />
        </div>
      </div>

      {/* Conversation list */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {Object.entries(groups).map(([label, items]) =>
          items.length === 0 ? null : (
            <div key={label} className="mb-4">
              <p className="px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                {label}
              </p>
              <div className="space-y-0.5">
                {items.map((conv) => (
                  <div
                    key={conv.id}
                    className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition cursor-pointer ${
                      activeConversationId === conv.id
                        ? 'bg-accent-400/10 text-accent-100 ring-1 ring-accent-400/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <MessageSquare
                      className={`h-4 w-4 shrink-0 ${
                        activeConversationId === conv.id ? 'text-accent-300' : 'text-slate-500'
                      }`}
                    />
                    <span className="flex-1 truncate">{conv.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conv.id);
                      }}
                      className="opacity-0 transition group-hover:opacity-100 hover:text-danger"
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ),
        )}
        {conversations.length === 0 && (
          <p className="px-2 py-8 text-center text-sm text-slate-500">No conversations yet.</p>
        )}
      </nav>

      {/* Settings */}
      <div className="border-t border-white/[0.06] p-3">
        <button
          onClick={onOpenSettings}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
        >
          <SettingsIcon className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
