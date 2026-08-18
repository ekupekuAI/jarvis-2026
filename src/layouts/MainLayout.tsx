import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { StatusBar } from '@/components/StatusBar';
import { AssistantOrb } from '@/components/AssistantOrb';
import { Conversation } from '@/components/Conversation';
import { CommandBar } from '@/components/CommandBar';
import { SystemPanel } from '@/components/SystemPanel';
import { MemoryPanel } from '@/components/MemoryPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { useAssistant } from '@/hooks/useAssistant';

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const assistant = useAssistant();
  const {
    state,
    isListening,
    conversations,
    activeConversationId,
    messages,
    systemInfo,
    memories,
    settings,
    groupedConversations,
    error,
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
  } = assistant;

  return (
    <div className="flex h-screen overflow-hidden bg-space-950">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none fixed left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400/5 blur-[120px]" />

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        groupedConversations={groupedConversations}
        onNewConversation={newConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        onOpenSettings={() => setSettingsOpen(true)}
        assistantName={settings.assistantName}
      />

      {/* Main area */}
      <main className="relative flex flex-1 flex-col">
        {/* Status bar */}
        <StatusBar state={state} assistantName={settings.assistantName} />

        {/* Body: conversation + right panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Conversation area */}
          <div className="flex flex-1 flex-col">
            {/* Orb + state */}
            <div className="flex flex-col items-center justify-center py-6">
              <AssistantOrb state={state} />
            </div>

            {/* Error banner */}
            {error && (
              <div className="mx-auto mb-3 max-w-3xl rounded-lg border border-danger/20 bg-danger/5 px-4 py-2.5 text-sm text-danger animate-slide-up">
                {error}
              </div>
            )}

            {/* Conversation */}
            <Conversation messages={messages} assistantName={settings.assistantName} />

            {/* Command bar */}
            <CommandBar
              state={state}
              isListening={isListening}
              onSend={sendMessage}
              onToggleListening={toggleListening}
              onStop={stopGeneration}
              onQuickCommand={runQuickCommand}
            />
          </div>

          {/* Right panel */}
          {rightPanelOpen && (
            <div className="hidden w-80 shrink-0 flex-col gap-3 overflow-y-auto border-l border-white/[0.06] bg-space-900/30 p-3 backdrop-blur-xl lg:flex">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Panels</span>
                <button
                  onClick={() => setRightPanelOpen(false)}
                  className="text-xs text-slate-500 transition hover:text-slate-300"
                >
                  Hide
                </button>
              </div>
              <SystemPanel info={systemInfo} />
              <MemoryPanel memories={memories} onAdd={addMemory} onDelete={removeMemory} />
            </div>
          )}

          {/* Show panel button when hidden */}
          {!rightPanelOpen && (
            <button
              onClick={() => setRightPanelOpen(true)}
              className="hidden items-center border-l border-white/[0.06] px-3 text-xs text-slate-500 transition hover:text-slate-300 lg:flex"
            >
              <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
                Panels
              </span>
            </button>
          )}
        </div>
      </main>

      {/* Settings modal */}
      <SettingsPanel
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onUpdate={updateSettings}
      />
    </div>
  );
}
