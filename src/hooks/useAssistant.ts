import { useCallback, useEffect, useRef, useState } from 'react';
import { assistantService, defaultSettings, quickCommands } from '@/services/assistant';
import type {
  AssistantState,
  Conversation,
  Memory,
  Message,
  Settings,
  SystemInfo,
  ToolActivity,
} from '@/types/assistant';

const seedConversations = (): Conversation[] => {
  const now = Date.now();
  return [
    {
      id: crypto.randomUUID(),
      title: 'Project discussion',
      messages: [],
      createdAt: now - 1000 * 60 * 30,
      updatedAt: now - 1000 * 60 * 30,
    },
    {
      id: crypto.randomUUID(),
      title: 'Java learning',
      messages: [],
      createdAt: now - 1000 * 60 * 60 * 3,
      updatedAt: now - 1000 * 60 * 60 * 3,
    },
    {
      id: crypto.randomUUID(),
      title: 'LabourConnect',
      messages: [],
      createdAt: now - 1000 * 60 * 60 * 7,
      updatedAt: now - 1000 * 60 * 60 * 7,
    },
    {
      id: crypto.randomUUID(),
      title: 'System setup',
      messages: [],
      createdAt: now - 1000 * 60 * 60 * 26,
      updatedAt: now - 1000 * 60 * 60 * 26,
    },
  ];
};

const groupByDate = (conversations: Conversation[]) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 1000 * 60 * 60 * 24;

  const groups: Record<string, Conversation[]> = { Today: [], Yesterday: [], Older: [] };
  for (const c of conversations) {
    if (c.updatedAt >= startOfToday) groups.Today.push(c);
    else if (c.updatedAt >= startOfYesterday) groups.Yesterday.push(c);
    else groups.Older.push(c);
  }
  return groups;
};

export function useAssistant() {
  const [state, setState] = useState<AssistantState>('ONLINE');
  const [conversations, setConversations] = useState<Conversation[]>(seedConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    cpu: null,
    ram: null,
    storage: null,
    battery: null,
    network: 'unknown',
    os: null,
  });
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: crypto.randomUUID(),
      title: 'Preferred browser',
      content: 'User prefers Chrome for web browsing.',
      category: 'preference',
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
    {
      id: crypto.randomUUID(),
      title: 'Project stack',
      content: 'LabourConnect uses React, TypeScript, and Supabase.',
      category: 'fact',
      createdAt: Date.now() - 1000 * 60 * 60 * 48,
    },
  ]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [toolActivities, setToolActivities] = useState<ToolActivity[]>([]);
  const [error, setError] = useState<string | null>(null);

  const stateRef = useRef(state);
  stateRef.current = state;

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null;

  useEffect(() => {
    assistantService.getSystemStatus().then(setSystemInfo);
    assistantService.getSettings().then((s) => setSettings({ ...defaultSettings, ...s }));
  }, []);

  const newConversation = useCallback(() => {
    const conv: Conversation = {
      id: crypto.randomUUID(),
      title: 'New conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConversationId(conv.id);
    setMessages([]);
    setError(null);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    const conv = conversations.find((c) => c.id === id);
    setMessages(conv?.messages ?? []);
    setError(null);
  }, [conversations]);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveConversationId((curr) => (curr === id ? null : curr));
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setState('THINKING');
    setError(null);

    try {
      const placeholder = await assistantService.sendMessage(text);
      setMessages((prev) => [...prev, placeholder]);
    } catch {
      setState('ERROR');
      setError('Unable to reach the assistant backend. Check your connection and try again.');
    }
  }, []);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      await assistantService.stopListening();
      setIsListening(false);
      setState('ONLINE');
    } else {
      setIsListening(true);
      setState('LISTENING');
      await assistantService.startListening();
    }
  }, [isListening]);

  const stopGeneration = useCallback(() => {
    setState('ONLINE');
    setMessages((prev) =>
      prev.map((m) => (m.pending ? { ...m, pending: false, content: m.content || '[stopped]' } : m)),
    );
  }, []);

  const runQuickCommand = useCallback(async (commandId: string) => {
    const cmd = quickCommands.find((c) => c.id === commandId);
    if (!cmd) return;
    sendMessage(cmd.prompt);
  }, [sendMessage]);

  const addMemory = useCallback(async (memory: Omit<Memory, 'id' | 'createdAt'>) => {
    const created = await assistantService.addMemory(memory);
    setMemories((prev) => [created, ...prev]);
  }, []);

  const removeMemory = useCallback(async (id: string) => {
    await assistantService.deleteMemory(id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      assistantService.saveSettings(next);
      return next;
    });
  }, []);

  return {
    state,
    setState,
    isListening,
    conversations,
    activeConversation,
    activeConversationId,
    messages,
    systemInfo,
    memories,
    settings,
    toolActivities,
    error,
    groupedConversations: groupByDate(conversations),
    newConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
    toggleListening,
    stopGeneration,
    runQuickCommand,
    addMemory,
    removeMemory,
    updateSettings,
  };
}

export type UseAssistant = ReturnType<typeof useAssistant>;
