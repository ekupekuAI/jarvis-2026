export type AssistantState =
  | 'ONLINE'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'EXECUTING'
  | 'ERROR';

export type MessageRole = 'user' | 'assistant' | 'system';

export type ToolStatus = 'running' | 'completed' | 'failed';

export interface ToolActivity {
  id: string;
  label: string;
  icon: string;
  status: ToolStatus;
  detail?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  tools?: ToolActivity[];
  pending?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Memory {
  id: string;
  title: string;
  content: string;
  category: 'note' | 'preference' | 'fact';
  createdAt: number;
}

export interface SystemInfo {
  cpu: number | null;
  ram: number | null;
  storage: number | null;
  battery: number | null;
  network: 'online' | 'offline' | 'unknown';
  os: string | null;
}

export interface Settings {
  assistantName: string;
  voiceEnabled: boolean;
  voiceVolume: number;
  responseStyle: 'concise' | 'detailed' | 'balanced';
  provider: string;
  model: string;
  apiConfigured: boolean;
  theme: 'dark' | 'midnight' | 'deep-space';
  animationIntensity: 'subtle' | 'normal' | 'high';
  accentStyle: 'cyan' | 'blue' | 'teal';
  startupBehavior: 'silent' | 'greet' | 'listen';
  notifications: boolean;
}

export interface QuickCommand {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}
