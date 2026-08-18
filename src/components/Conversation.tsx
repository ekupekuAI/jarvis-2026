import { useEffect, useRef } from 'react';
import type { Message } from '@/types/assistant';
import { User, Cpu, Loader2 } from 'lucide-react';
import { ToolActivityItem } from './ToolActivityItem';

interface ConversationProps {
  messages: Message[];
  assistantName: string;
}

export function Conversation({ messages, assistantName }: ConversationProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="mb-3 text-sm font-medium uppercase tracking-widest text-accent-300/60">
          {assistantName} is ready
        </div>
        <p className="max-w-md text-balance text-lg text-slate-400">
          Ask me to open apps, search the web, take screenshots, manage files, or answer questions.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} assistantName={assistantName} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}

function MessageBubble({ message, assistantName }: { message: Message; assistantName: string }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
        <Cpu className="h-4 w-4 text-slate-500" />
        <span className="text-sm text-slate-400">{message.content}</span>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser
            ? 'bg-blue-500/15 ring-1 ring-blue-400/20'
            : 'bg-gradient-to-br from-accent-400/20 to-accent-600/10 ring-1 ring-accent-400/20'
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-blue-400" />
        ) : (
          <Cpu className="h-4 w-4 text-accent-300" />
        )}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <p className="mb-1 text-xs font-medium text-slate-500">
          {isUser ? 'You' : assistantName}
        </p>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-blue-500/10 text-slate-200 ring-1 ring-blue-400/15'
              : 'glass text-slate-200'
          }`}
        >
          {message.pending && !message.content ? (
            <span className="flex items-center gap-2 text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-accent-300" />
              Processing…
            </span>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        {message.tools && message.tools.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {message.tools.map((tool) => (
              <ToolActivityItem key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
