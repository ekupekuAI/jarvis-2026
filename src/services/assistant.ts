import type {
  AssistantState,
  Conversation,
  Memory,
  Message,
  QuickCommand,
  Settings,
  SystemInfo,
  ToolActivity,
} from '@/types/assistant';

/**
 * Assistant service — the single API boundary between the UI and the future backend.
 *
 * Every function here is a placeholder that returns a typed shape the UI can render.
 * When the real backend is wired in, replace the bodies of these functions with
 * network calls (WebSocket, REST, or IPC) — the components that consume them
 * should not need to change.
 */

export const assistantService = {
  async sendMessage(text: string): Promise<Message> {
    // TODO: backend — forward text to LLM, stream tokens back.
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      pending: true,
    };
  },

  async startListening(): Promise<void> {
    // TODO: backend — open mic stream, run STT, emit transcripts.
  },

  async stopListening(): Promise<void> {
    // TODO: backend — close mic stream.
  },

  async getSystemStatus(): Promise<SystemInfo> {
    // TODO: backend — read real OS metrics.
    return {
      cpu: null,
      ram: null,
      storage: null,
      battery: null,
      network: 'unknown',
      os: null,
    };
  },

  async getMemories(): Promise<Memory[]> {
    // TODO: backend — fetch persisted memories.
    return [];
  },

  async addMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
    // TODO: backend — persist memory.
    return {
      ...memory,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
  },

  async deleteMemory(id: string): Promise<void> {
    // TODO: backend — delete memory by id.
  },

  async executeCommand(command: QuickCommand): Promise<ToolActivity> {
    // TODO: backend — run the real system action.
    return {
      id: crypto.randomUUID(),
      label: command.label,
      icon: command.icon,
      status: 'running',
    };
  },

  async getSettings(): Promise<Settings> {
    // TODO: backend — load persisted settings.
    return defaultSettings;
  },

  async saveSettings(settings: Settings): Promise<void> {
    // TODO: backend — persist settings.
  },

  async getConversations(): Promise<Conversation[]> {
    // TODO: backend — load conversation history.
    return [];
  },

  async createConversation(): Promise<Conversation> {
    // TODO: backend — persist new conversation.
    return {
      id: crypto.randomUUID(),
      title: 'New conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  },

  onStateChange(_handler: (state: AssistantState) => void): () => void {
    // TODO: backend — subscribe to state updates.
    return () => {};
  },

  onMessage(_handler: (message: Message) => void): () => void {
    // TODO: backend — subscribe to incoming messages / streamed tokens.
    return () => {};
  },

  onToolActivity(_handler: (activity: ToolActivity) => void): () => void {
    // TODO: backend — subscribe to tool execution events.
    return () => {};
  },
};

export const defaultSettings: Settings = {
  assistantName: 'JARVIS',
  voiceEnabled: true,
  voiceVolume: 70,
  responseStyle: 'balanced',
  provider: 'openai',
  model: 'gpt-4o',
  apiConfigured: false,
  theme: 'deep-space',
  animationIntensity: 'normal',
  accentStyle: 'cyan',
  startupBehavior: 'greet',
  notifications: true,
};

export const quickCommands: QuickCommand[] = [
  { id: 'browser', label: 'Open Browser', icon: 'Globe', prompt: 'Open the browser' },
  { id: 'system', label: 'System Status', icon: 'Activity', prompt: 'Show system status' },
  { id: 'screenshot', label: 'Take Screenshot', icon: 'Camera', prompt: 'Take a screenshot' },
  { id: 'search', label: 'Search Web', icon: 'Search', prompt: 'Search the web for' },
  { id: 'note', label: 'Create Note', icon: 'StickyNote', prompt: 'Create a note:' },
];
