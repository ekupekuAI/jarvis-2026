import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Volume2,
  Mic,
  Sparkles,
  Palette,
  Monitor,
  X,
  Check,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import type { Settings } from '@/types/assistant';

interface SettingsPanelProps {
  open: boolean;
  settings: Settings;
  onClose: () => void;
  onUpdate: (patch: Partial<Settings>) => void;
}

type Tab = 'assistant' | 'ai' | 'appearance' | 'system';

export function SettingsPanel({ open, settings, onClose, onUpdate }: SettingsPanelProps) {
  const [tab, setTab] = useState<Tab>('assistant');

  if (!open) return null;

  const tabs: { id: Tab; label: string; icon: typeof SettingsIcon }[] = [
    { id: 'assistant', label: 'Assistant', icon: Mic },
    { id: 'ai', label: 'AI', icon: Cpu },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-[600px] max-h-[90vh] w-[760px] max-w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-space-900/80 backdrop-blur-2xl shadow-glow-soft">
        {/* Sidebar */}
        <div className="flex w-48 flex-col border-r border-white/[0.06] bg-space-950/40 p-4">
          <div className="mb-6 flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-accent-300" />
            <span className="text-sm font-semibold text-slate-200">Settings</span>
          </div>
          <nav className="space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                    tab === t.id
                      ? 'bg-accent-400/10 text-accent-200 ring-1 ring-accent-400/20'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <h2 className="text-base font-semibold text-slate-100">
              {tabs.find((t) => t.id === tab)?.label}
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {tab === 'assistant' && (
              <div className="space-y-5">
                <Field label="Assistant Name">
                  <input
                    value={settings.assistantName}
                    onChange={(e) => onUpdate({ assistantName: e.target.value })}
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent-400/30"
                  />
                </Field>
                <Toggle
                  label="Voice Enabled"
                  icon={Volume2}
                  checked={settings.voiceEnabled}
                  onChange={(v) => onUpdate({ voiceEnabled: v })}
                />
                <Field label={`Voice Volume — ${settings.voiceVolume}%`}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={settings.voiceVolume}
                    onChange={(e) => onUpdate({ voiceVolume: parseInt(e.target.value) })}
                    className="w-full accent-accent-400"
                  />
                </Field>
                <Field label="Response Style">
                  <div className="flex gap-2">
                    {(['concise', 'balanced', 'detailed'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => onUpdate({ responseStyle: style })}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition ${
                          settings.responseStyle === style
                            ? 'border-accent-400/30 bg-accent-400/10 text-accent-200'
                            : 'border-white/[0.06] text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {tab === 'ai' && (
              <div className="space-y-5">
                <Field label="Provider">
                  <select
                    value={settings.provider}
                    onChange={(e) => onUpdate({ provider: e.target.value })}
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent-400/30"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="local">Local (Ollama)</option>
                  </select>
                </Field>
                <Field label="Model">
                  <input
                    value={settings.model}
                    onChange={(e) => onUpdate({ model: e.target.value })}
                    className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-slate-200 outline-none focus:border-accent-400/30"
                  />
                </Field>
                <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  {settings.apiConfigured ? (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15">
                        <Check className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">API Configured</p>
                        <p className="text-xs text-slate-500">Connection ready</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/15">
                        <AlertCircle className="h-4 w-4 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">API Not Configured</p>
                        <p className="text-xs text-slate-500">
                          API keys are managed by the backend — never exposed in the UI.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {tab === 'appearance' && (
              <div className="space-y-5">
                <Field label="Theme">
                  <div className="flex gap-2">
                    {(['dark', 'midnight', 'deep-space'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => onUpdate({ theme })}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition ${
                          settings.theme === theme
                            ? 'border-accent-400/30 bg-accent-400/10 text-accent-200'
                            : 'border-white/[0.06] text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        {theme.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Animation Intensity">
                  <div className="flex gap-2">
                    {(['subtle', 'normal', 'high'] as const).map((intensity) => (
                      <button
                        key={intensity}
                        onClick={() => onUpdate({ animationIntensity: intensity })}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition ${
                          settings.animationIntensity === intensity
                            ? 'border-accent-400/30 bg-accent-400/10 text-accent-200'
                            : 'border-white/[0.06] text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        {intensity}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Accent Style">
                  <div className="flex gap-2">
                    {(['cyan', 'blue', 'teal'] as const).map((accent) => (
                      <button
                        key={accent}
                        onClick={() => onUpdate({ accentStyle: accent })}
                        className={`flex items-center gap-2 flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition ${
                          settings.accentStyle === accent
                            ? 'border-accent-400/30 bg-accent-400/10 text-accent-200'
                            : 'border-white/[0.06] text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{
                            background:
                              accent === 'cyan' ? '#16c7f5' : accent === 'blue' ? '#5b8dff' : '#2dd4bf',
                          }}
                        />
                        {accent}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {tab === 'system' && (
              <div className="space-y-5">
                <Field label="Startup Behavior">
                  <div className="flex gap-2">
                    {(['silent', 'greet', 'listen'] as const).map((behavior) => (
                      <button
                        key={behavior}
                        onClick={() => onUpdate({ startupBehavior: behavior })}
                        className={`flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition ${
                          settings.startupBehavior === behavior
                            ? 'border-accent-400/30 bg-accent-400/10 text-accent-200'
                            : 'border-white/[0.06] text-slate-400 hover:bg-white/5'
                        }`}
                      >
                        {behavior}
                      </button>
                    ))}
                  </div>
                </Field>
                <Toggle
                  label="Notifications"
                  icon={Sparkles}
                  checked={settings.notifications}
                  onChange={(v) => onUpdate({ notifications: v })}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string;
  icon: typeof Volume2;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-slate-400" />
        <span className="text-sm text-slate-200">{label}</span>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? 'bg-accent-400/40' : 'bg-white/10'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            checked ? 'left-5.5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
