import { Compass, HelpCircle, Keyboard } from 'lucide-react';
import equipment from '@/data/equipment.json';
import { useSpaceContext } from '@/context/SpaceContext';
import MissionSearch from '@/components/ui/MissionSearch';

export default function Header({
  onReplayTutorial,
  onToggleShortcuts,
  search,
  searchOpen,
  onOpenSearch,
  onDismissSearch,
  onSelectMission,
  onStartGuidedExploration,
}) {
  const { activeBody, switchBody } = useSpaceContext();
  const missionCount = equipment.filter((item) => item.body === activeBody).length;

  return (
    <header className="pointer-events-auto z-40 flex w-full flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#08090c]/80 px-6 py-4 backdrop-blur-md">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/50">NASA // DEEP SPACE ARCHIVE</p>
        <h1 className="mt-1 text-xl font-semibold tracking-widest text-[#00f3ff]">Ghosts in the Dust</h1>
      </div>
      <div className="flex items-center gap-6">
        <div data-tutorial="planet-selector" className="flex items-center rounded-full border border-white/10 bg-[#12141d]/85 p-1 font-mono text-xs uppercase tracking-wider">
          {['Moon', 'Mars'].map((body) => (
            <button
              key={body}
              type="button"
              onClick={() => switchBody(body)}
              className={`rounded-full px-4 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#00f3ff]/70 ${body === activeBody ? 'bg-[#00f3ff] text-[#08090c]' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}
              aria-pressed={body === activeBody}
            >
              {body}
            </button>
          ))}
        </div>
        <MissionSearch
          search={search}
          open={searchOpen}
          onOpen={onOpenSearch}
          onDismiss={onDismissSearch}
          onSelectMission={onSelectMission}
        />
        <button
          type="button"
          onClick={onStartGuidedExploration}
          className="flex items-center gap-1 rounded border border-[#ffb703]/40 px-2 py-2 font-mono text-[10px] text-[#ffb703] transition-colors hover:bg-[#ffb703]/10 focus:outline-none focus:ring-2 focus:ring-[#ffb703]/70"
        >
          <Compass size={14} /> <span className="hidden xl:inline">GUIDED EXPLORATION</span><span className="xl:hidden">GUIDED</span>
        </button>
        <div className="hidden items-center gap-2 font-mono text-xs text-[#00f3ff] sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#00f3ff]" aria-hidden="true" />
          <span>SYSTEM ONLINE // 3D WEBGL ACTIVE</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
          {missionCount} {missionCount === 1 ? 'MISSION' : 'MISSIONS'} TRACKED
        </span>
        <button type="button" onClick={onToggleShortcuts} aria-label="Show keyboard shortcuts" className="rounded border border-white/10 p-2 text-white/60 hover:border-[#00f3ff]/50 hover:text-[#00f3ff] focus:outline-none focus:ring-2 focus:ring-[#00f3ff]/70" title="Keyboard shortcuts (?)">
          <Keyboard size={14} />
        </button>
        <button type="button" onClick={onReplayTutorial} className="flex items-center gap-1 rounded border border-white/10 px-2 py-2 font-mono text-[10px] text-white/60 hover:border-[#00f3ff]/50 hover:text-[#00f3ff] focus:outline-none focus:ring-2 focus:ring-[#00f3ff]/70" aria-label="Replay tutorial" data-tutorial="help">
          <HelpCircle size={14} /> HELP
        </button>
      </div>
    </header>
  );
}
