import { Search } from 'lucide-react';
import { useState } from 'react';
import equipment from '@/data/equipment.json';
import { useSpaceContext } from '@/context/SpaceContext';

export default function Header() {
  const { activeBody, switchBody, selectEquipment } = useSpaceContext();
  const [query, setQuery] = useState('');
  const matches = equipment.filter((item) => (
    item.body === activeBody
    && item.name.toLowerCase().includes(query.trim().toLowerCase())
  ));
  const missionCount = equipment.filter((item) => item.body === activeBody).length;

  return (
    <header className="pointer-events-auto z-50 flex w-full flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#08090c]/80 px-6 py-4 backdrop-blur-md">
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
                onClick={() => switchBody(body)}
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

        <div className="relative w-full sm:w-auto">
          <label htmlFor="mission-search" className="sr-only">
            Search missions
          </label>
          <Search className="absolute left-3 top-2.5 text-white/40" size={15} />
          <input
            id="mission-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="SEARCH MISSIONS"
            className="w-full rounded border border-white/10 bg-[#12141d]/85 py-2 pl-9 pr-3 font-mono text-xs text-white outline-none transition focus:border-[#00f3ff]/60 sm:w-56"
          />
          {query && (
            <div className="absolute left-0 right-0 top-11 z-50 rounded border border-white/10 bg-[#12141d] p-1 shadow-xl">
              {matches.length ? matches.map((mission) => (
                <button
                  type="button"
                  key={mission.id}
                  onClick={() => {
                    selectEquipment(mission.id);
                    setQuery('');
                  }}
                  className="block w-full rounded px-2 py-2 text-left text-xs text-white/80 hover:bg-white/10 hover:text-[#00f3ff]"
                >
                  {mission.name}
                </button>
              )) : (
                <p className="px-2 py-2 font-mono text-xs text-white/40">
                  NO MATCHING MISSION
                </p>
              )}
            </div>
          )}
        </div>

        <div className="hidden items-center gap-2 font-mono text-xs text-[#00f3ff] sm:flex">
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-[#00f3ff]"
            aria-hidden="true"
          />
          <span>SYSTEM ONLINE // 3D WEBGL ACTIVE</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          {missionCount} {missionCount === 1 ? 'MISSION' : 'MISSIONS'} TRACKED
        </span>
      </div>
    </header>
  );
}
