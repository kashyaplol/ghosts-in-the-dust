export default function LoadingScreen({ visible, stage, ready }) {
  if (!visible) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center bg-[#08090c]/85"
      role="status"
      aria-live="polite"
      aria-label={`Loading stage: ${stage}`}
    >
      <div className="w-[min(90vw,420px)] rounded-xl border border-white/10 bg-[#12141d]/90 p-8 text-center shadow-2xl backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#00f3ff]">NASA // DEEP SPACE ARCHIVE</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-widest text-white">Ghosts in the Dust</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">Abandoned lunar and Martian missions, preserved for exploration.</p>
        <div className="mt-7 h-1 overflow-hidden rounded bg-white/10" aria-hidden="true">
          <div className="h-full w-1/3 animate-pulse rounded bg-[#00f3ff]" />
        </div>
        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-white/65">{stage}</p>
        <p className="mt-2 font-mono text-[10px] uppercase text-white/35">
          {ready ? 'Renderer ready · preparing interface' : 'Initializing renderer'}
        </p>
      </div>
    </div>
  );
}
