import { Clock3, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import equipment from '@/data/equipment.json';
import {
  filterTimelineMissions,
  getTimelineDate,
  getTimelineMissions,
} from '@/utils/missionTimeline';

const filters = ['All', 'Moon', 'Mars'];

export default function MissionTimeline({
  open,
  selectedEquipmentId,
  onSelectMission,
  onClose,
}) {
  const [body, setBody] = useState('All');
  const missions = useMemo(() => (
    filterTimelineMissions(getTimelineMissions(equipment), body)
  ), [body]);

  if (!open) return null;

  return (
    <section
      className="pointer-events-auto fixed left-6 top-28 z-[44] w-[min(92vw,680px)] rounded-xl border border-white/15 bg-[#12141d]/95 p-4 shadow-2xl backdrop-blur-md"
      aria-label="Historical mission timeline"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00f3ff]">
            <Clock3 size={13} /> Historical mission timeline
          </p>
          <p className="mt-1 text-xs text-white/45">Landing chronology // dataset records</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close historical mission timeline" className="text-white/50 hover:text-white">
          <X size={18} />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Timeline planet filter">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setBody(filter)}
            aria-pressed={body === filter}
            className={`rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition ${body === filter ? 'border-[#00f3ff]/60 bg-[#00f3ff]/10 text-[#00f3ff]' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'}`}
          >
            {filter}
          </button>
        ))}
      </div>
      <ol className="mt-4 grid max-h-[45vh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2" aria-label="Missions in chronological order">
        {missions.map((mission, index) => {
          const selected = mission.id === selectedEquipmentId;
          const accent = mission.body === 'Mars' ? '#ffb703' : '#00f3ff';
          return (
            <li key={mission.id}>
              <button
                type="button"
                onClick={() => onSelectMission(mission)}
                aria-current={selected ? 'true' : undefined}
                className={`w-full rounded-lg border p-3 text-left transition ${selected ? 'bg-white/10' : 'border-white/10 hover:bg-white/5'}`}
                style={{ borderColor: selected ? `${accent}88` : undefined }}
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block font-mono text-[9px] uppercase tracking-wider" style={{ color: accent }}>
                      {String(index + 1).padStart(2, '0')} // {mission.body}
                    </span>
                    <span className="mt-1 block text-sm text-white/90">{mission.name}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[9px] text-white/45">{getTimelineDate(mission)}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {!missions.length && <p className="py-5 text-center font-mono text-xs text-white/45">NO MISSIONS RECORDED FOR THIS FILTER</p>}
    </section>
  );
}
