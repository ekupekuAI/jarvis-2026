import { useState } from 'react';
import { Brain, Plus, Trash2, Search, StickyNote, Heart, BookOpen } from 'lucide-react';
import type { Memory } from '@/types/assistant';

interface MemoryPanelProps {
  memories: Memory[];
  onAdd: (memory: Omit<Memory, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

const categoryConfig = {
  note: { icon: StickyNote, label: 'Note', color: 'text-accent-300', bg: 'bg-accent-400/10' },
  preference: { icon: Heart, label: 'Preference', color: 'text-warning', bg: 'bg-warning/10' },
  fact: { icon: BookOpen, label: 'Fact', color: 'text-blue-400', bg: 'bg-blue-400/10' },
};

export function MemoryPanel({ memories, onAdd, onDelete }: MemoryPanelProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Memory['category']>('note');

  const filtered = search
    ? memories.filter(
        (m) =>
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.content.toLowerCase().includes(search.toLowerCase()),
      )
    : memories;

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) return;
    onAdd({ title: title.trim(), content: content.trim(), category });
    setTitle('');
    setContent('');
    setCategory('note');
    setShowAdd(false);
  };

  return (
    <div className="glass-panel flex flex-col rounded-xl">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-400/10 ring-1 ring-accent-400/15">
            <Brain className="h-3.5 w-3.5 text-accent-300" />
          </div>
          <span className="text-sm font-medium text-slate-200">Memory</span>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-500">
            {memories.length}
          </span>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-accent-300"
          aria-label="Add memory"
        >
          <Plus className={`h-4 w-4 transition ${showAdd ? 'rotate-45' : ''}`} />
        </button>
      </div>

      {showAdd && (
        <div className="border-t border-white/[0.06] px-4 py-3 animate-slide-down space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-accent-400/30"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What should JARVIS remember?"
            rows={2}
            className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-accent-400/30"
          />
          <div className="flex items-center gap-2">
            {(['note', 'preference', 'fact'] as const).map((cat) => {
              const cfg = categoryConfig[cat];
              const Icon = cfg.icon;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition ${
                    category === cat
                      ? `${cfg.bg} ${cfg.color} ring-1 ring-current/20`
                      : 'text-slate-500 hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cfg.label}
                </button>
              );
            })}
            <button
              onClick={handleAdd}
              disabled={!title.trim() || !content.trim()}
              className="ml-auto rounded-lg bg-accent-400/15 px-3 py-1.5 text-xs font-medium text-accent-200 ring-1 ring-accent-400/25 transition hover:bg-accent-400/25 disabled:opacity-30"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search memories"
            className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-accent-400/30"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3" style={{ maxHeight: '300px' }}>
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-500">
            {memories.length === 0 ? 'No memories saved yet.' : 'No matches found.'}
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((mem) => {
              const cfg = categoryConfig[mem.category];
              const Icon = cfg.icon;
              return (
                <div
                  key={mem.id}
                  className="group rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition hover:border-white/[0.08]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-md ${cfg.bg}`}>
                        <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                      </div>
                      <p className="text-sm font-medium text-slate-200">{mem.title}</p>
                    </div>
                    <button
                      onClick={() => onDelete(mem.id)}
                      className="text-slate-600 opacity-0 transition hover:text-danger group-hover:opacity-100"
                      aria-label="Delete memory"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-1.5 pl-8 text-xs text-slate-400">{mem.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
