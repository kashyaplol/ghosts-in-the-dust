export default function Header({ activeBody, onToggleBody }) {
  return (
    <header className="pointer-events-auto z-50 flex w-full items-center justify-between border-b border-white/10 bg-[#08090c]/80 px-6 py-4 backdrop-blur-md">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">
          NASA // DEEP SPACE ARCHIVE
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-widest text-[#00f3ff]">
          Ghosts in the Dust
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center rounded-full border border-white/10 bg-[#12141d]/85 p-1 font-mono text-xs uppercase tracking-wider">
          {['Moon', 'Mars'].map((body) => {
            const isActive = body === activeBody;

            return (
              <button
                key={body}
                type="button"
                onClick={() => onToggleBody(body)}
                className={`rounded-full px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00f3ff]/70 ${
                  isActive
                    ? 'bg-[#00f3ff] text-[#08090c]'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                aria-pressed={isActive}
              >
                {body}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 font-mono text-xs text-[#00f3ff] sm:flex">
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-[#00f3ff]"
            aria-hidden="true"
          />
          <span>SYSTEM ONLINE // 3D WEBGL ACTIVE</span>
        </div>
      </div>
    </header>
  );
}

