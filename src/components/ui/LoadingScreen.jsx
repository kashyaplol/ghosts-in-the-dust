export default function LoadingScreen({ visible, stage, ready }) {
  if (!visible) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center bg-space-black/90 p-4"
      role="status"
      aria-live="polite"
      aria-label={`Loading stage: ${stage}`}
    >
      <div className="instrument-panel w-[min(90vw,420px)] rounded-lg p-8 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ice-accent">
          Planetary Archaeology Archive
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink-primary">
          Ghosts in the Dust
        </h1>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-secondary">
          Abandoned lunar and Martian missions, preserved for exploration.
        </p>
        <div className="mt-6 h-0.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
          <div className="h-full w-1/2 rounded-full bg-ice-accent transition-opacity duration-300" />
        </div>
        <p className="mt-4 font-mono text-xs text-ink-primary">{stage}</p>
        <p className="mt-1.5 text-[11px] text-ink-muted">
          {ready ? 'Renderer ready · preparing interface' : 'Initializing renderer'}
        </p>
      </div>
    </div>
  );
}
