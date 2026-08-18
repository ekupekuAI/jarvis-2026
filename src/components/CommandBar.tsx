import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Square, Globe, Activity, Camera, Search, StickyNote } from 'lucide-react';
import { quickCommands } from '@/services/assistant';
import type { AssistantState } from '@/types/assistant';

interface CommandBarProps {
  state: AssistantState;
  isListening: boolean;
  onSend: (text: string) => void;
  onToggleListening: () => void;
  onStop: () => void;
  onQuickCommand: (id: string) => void;
}

const iconMap: Record<string, typeof Globe> = {
  Globe,
  Activity,
  Camera,
  Search,
  StickyNote,
};

export function CommandBar({
  state,
  isListening,
  onSend,
  onToggleListening,
  onStop,
  onQuickCommand,
}: CommandBarProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isBusy = state === 'THINKING' || state === 'EXECUTING';

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim() || isBusy) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        {/* Quick commands */}
        <div className="mb-2.5 flex flex-wrap gap-2">
          {quickCommands.map((cmd) => {
            const Icon = iconMap[cmd.icon] ?? Globe;
            return (
              <button
                key={cmd.id}
                onClick={() => onQuickCommand(cmd.id)}
                disabled={isBusy}
                className="group flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-accent-400/30 hover:bg-accent-400/5 hover:text-accent-200 disabled:opacity-40 disabled:hover:border-white/[0.06] disabled:hover:bg-white/[0.02] disabled:hover:text-slate-400"
              >
                <Icon className="h-3.5 w-3.5" />
                {cmd.label}
              </button>
            );
          })}
        </div>

        {/* Input bar */}
        <div
          className={`flex items-end gap-2 rounded-2xl border bg-space-900/60 px-3 py-2.5 backdrop-blur-xl transition ${
            isListening ? 'border-success/40 shadow-glow-sm' : 'border-white/[0.08] focus-within:border-accent-400/30'
          }`}
        >
          {/* Mic button */}
          <button
            onClick={onToggleListening}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
              isListening
                ? 'bg-success/20 text-success ring-1 ring-success/40 animate-pulse'
                : 'text-slate-400 hover:bg-white/5 hover:text-accent-300'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <Mic className="h-4.5 w-4.5" />
          </button>

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask JARVIS anything..."
            rows={1}
            className="flex-1 resize-none bg-transparent py-1.5 text-sm text-slate-100 placeholder-slate-500 outline-none"
          />

          {/* Stop / Send button */}
          {isBusy ? (
            <button
              onClick={onStop}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warning/15 text-warning transition hover:bg-warning/25"
              aria-label="Stop"
            >
              <Square className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-400/15 text-accent-300 ring-1 ring-accent-400/25 transition hover:bg-accent-400/25 disabled:opacity-30 disabled:hover:bg-accent-400/15"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
