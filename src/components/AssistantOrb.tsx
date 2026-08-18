import type { AssistantState } from '@/types/assistant';

interface AssistantOrbProps {
  state: AssistantState;
  size?: 'sm' | 'md' | 'lg';
}

const stateConfig: Record<AssistantState, { color: string; label: string; ring: string }> = {
  ONLINE: { color: 'rgba(22, 199, 245, 0.6)', label: 'Online', ring: 'border-accent-400/40' },
  LISTENING: { color: 'rgba(45, 212, 191, 0.7)', label: 'Listening', ring: 'border-success/50' },
  THINKING: { color: 'rgba(91, 141, 255, 0.7)', label: 'Thinking', ring: 'border-blue-400/50' },
  SPEAKING: { color: 'rgba(22, 199, 245, 0.8)', label: 'Speaking', ring: 'border-accent-300/60' },
  EXECUTING: { color: 'rgba(251, 191, 36, 0.7)', label: 'Executing', ring: 'border-warning/50' },
  ERROR: { color: 'rgba(248, 113, 113, 0.7)', label: 'Error', ring: 'border-danger/50' },
};

export function AssistantOrb({ state, size = 'lg' }: AssistantOrbProps) {
  const cfg = stateConfig[state];
  const dim = size === 'lg' ? 'h-56 w-56' : size === 'md' ? 'h-32 w-32' : 'h-16 w-16';

  const isThinking = state === 'THINKING';
  const isListening = state === 'LISTENING';
  const isSpeaking = state === 'SPEAKING';
  const isExecuting = state === 'EXECUTING';
  const isError = state === 'ERROR';

  return (
    <div className={`relative flex items-center justify-center ${dim}`}>
      {/* Outer rotating ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 ${cfg.ring} ${
          isThinking ? 'animate-spin-slow' : isExecuting ? 'animate-spin-slow' : ''
        }`}
        style={{ borderStyle: isThinking ? 'dashed' : 'solid' }}
      />

      {/* Middle counter-rotating ring */}
      <div
        className={`absolute inset-4 rounded-full border border-white/10 ${
          isThinking ? 'animate-spin-reverse' : ''
        }`}
      />

      {/* Glow halo */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${cfg.color} 0%, transparent 70%)`, opacity: 0.5 }}
      />

      {/* Pulse rings for listening */}
      {isListening && (
        <>
          <div className="absolute inset-0 rounded-full border border-success/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-success/20 animate-ping" style={{ animationDelay: '0.5s' }} />
        </>
      )}

      {/* Core orb */}
      <div
        className={`relative rounded-full transition-all duration-500 ${
          size === 'lg' ? 'h-36 w-36' : size === 'md' ? 'h-20 w-20' : 'h-10 w-10'
        } ${isError ? 'animate-pulse' : 'animate-pulse-soft'}`}
        style={{
          background: `radial-gradient(circle at 35% 30%, ${cfg.color}, rgba(7, 11, 20, 0.9) 80%)`,
          boxShadow: `0 0 40px ${cfg.color}, inset 0 0 30px rgba(7, 11, 20, 0.6)`,
        }}
      >
        {/* Inner shimmer */}
        <div
          className={`absolute inset-2 rounded-full opacity-40 ${isSpeaking ? 'animate-pulse' : ''}`}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${cfg.color}, transparent 70%)`,
          }}
        />

        {/* Speaking waveform bars */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-accent-200"
                style={{
                  height: `${20 + Math.sin(i) * 40 + 40}%`,
                  animation: `pulse-soft ${0.4 + i * 0.1}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating particles for executing */}
      {isExecuting && (
        <>
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={deg}
              className="absolute h-1.5 w-1.5 rounded-full bg-warning"
              style={{
                transform: `rotate(${deg}deg) translateY(-${size === 'lg' ? '120' : '60'}px)`,
                animation: 'spin-slow 2s linear infinite',
                transformOrigin: 'center',
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
