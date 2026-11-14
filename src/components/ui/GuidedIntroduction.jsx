import { motion } from 'framer-motion';
import { ArrowRight, Compass, X } from 'lucide-react';

function MissionList({ missions, onChoose }) {
  return (
    <ol className="mt-5 grid gap-2 border-t border-white/10 pt-4">
      {missions.map((mission, index) => (
        <li key={mission.id}>
          <button type="button" onClick={() => onChoose(index)} className="flex w-full items-center justify-between rounded border border-white/10 px-3 py-2 text-left transition hover:border-[#00f3ff]/50 hover:bg-white/5">
            <span>
              <span className="block font-mono text-[9px] text-white/40">{String(index + 1).padStart(2, '0')} // {mission.body}</span>
              <span className="block text-sm text-white/85">{mission.name}</span>
            </span>
            <ArrowRight size={14} className="text-white/40" />
          </button>
        </li>
      ))}
    </ol>
  );
}

export default function GuidedIntroduction({
  missions,
  showList,
  onToggleList,
  onStart,
  onChoose,
  onExit,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      className="pointer-events-auto fixed left-6 top-28 z-[45] w-[min(90vw,430px)] rounded-xl border border-[#00f3ff]/30 bg-[#12141d]/95 p-6 shadow-2xl backdrop-blur-md"
      role="dialog"
      aria-modal="false"
      aria-label="Guided exploration introduction"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#00f3ff]">Mission chronology // archive route</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-wide text-white">ABANDONED BUT NOT FORGOTTEN</h2>
        </div>
        <button type="button" onClick={onExit} aria-label="Exit guided exploration" className="text-white/50 hover:text-white"><X size={18} /></button>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white/70">Explore the history of humanity&apos;s robotic explorers across the Moon and Mars.</p>
      <div className="mt-6 grid gap-2">
        <button type="button" onClick={() => onStart(0)} className="flex items-center justify-center gap-2 rounded border border-[#00f3ff]/50 bg-[#00f3ff] px-4 py-3 font-mono text-xs font-bold tracking-wider text-[#08090c] hover:bg-[#7df9ff]">
          <Compass size={15} /> START JOURNEY
        </button>
        <button type="button" onClick={onToggleList} className="rounded border border-white/15 px-4 py-3 font-mono text-xs tracking-wider text-white/70 hover:border-[#00f3ff]/40 hover:text-white">
          {showList ? 'HIDE MISSION LIST' : 'VIEW MISSION LIST'}
        </button>
      </div>
      {showList && <MissionList missions={missions} onChoose={onChoose} />}
      <button type="button" onClick={onExit} className="mt-5 font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-white">Exit</button>
    </motion.section>
  );
}
