import { ArrowLeftRight, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import equipment from '@/data/equipment.json';
import { getComparisonRows } from '@/utils/missionComparison';

function MissionColumn({ label, mission, selectedId, onChange, onOpen }) {
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <label className="block font-mono text-[9px] uppercase tracking-wider text-white/45">
        {label}
        <select
          value={selectedId}
          onChange={onChange}
          aria-label={`${label} mission`}
          className="mt-2 w-full rounded border border-white/15 bg-[#08090c] px-2 py-2 text-xs text-white outline-none focus:border-[#00f3ff]/70"
        >
          {equipment.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
        </select>
      </label>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={`font-mono text-[10px] uppercase tracking-wider ${mission.body === 'Mars' ? 'text-[#ffb703]' : 'text-[#00f3ff]'}`}>
          {mission.body}
        </span>
        <button type="button" onClick={() => onOpen(mission)} className="rounded border border-white/15 px-2 py-1 font-mono text-[9px] text-white/65 hover:border-[#00f3ff]/60 hover:text-white">
          OPEN IN EXPLORER
        </button>
      </div>
    </div>
  );
}

export default function MissionComparison({ open, onClose, onSelectMission }) {
  const [leftId, setLeftId] = useState(equipment[0].id);
  const [rightId, setRightId] = useState(equipment[1].id);
  const left = equipment.find((mission) => mission.id === leftId) || equipment[0];
  const right = equipment.find((mission) => mission.id === rightId) || equipment[1];
  const rows = useMemo(() => getComparisonRows(left, right), [left, right]);

  if (!open) return null;

  const openMission = (mission) => {
    onSelectMission(mission);
    onClose();
  };

  return (
    <div className="pointer-events-auto fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <section role="dialog" aria-modal="true" aria-label="Mission comparison" className="max-h-[90vh] w-[min(96vw,860px)] overflow-y-auto rounded-xl border border-white/15 bg-[#12141d] p-4 shadow-2xl sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#00f3ff]"><ArrowLeftRight size={13} /> Mission comparison</p>
            <p className="mt-1 text-xs text-white/45">Dataset records // differences highlighted</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close mission comparison" className="text-white/50 hover:text-white"><X size={18} /></button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <MissionColumn label="Mission one" mission={left} selectedId={leftId} onChange={(event) => setLeftId(event.target.value)} onOpen={openMission} />
          <MissionColumn label="Mission two" mission={right} selectedId={rightId} onChange={(event) => setRightId(event.target.value)} onOpen={openMission} />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
          <div className="grid grid-cols-[minmax(96px,0.7fr)_minmax(0,1fr)_minmax(0,1fr)] bg-white/[0.04] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-white/40">
            <span>Field</span><span className="truncate">{left.name}</span><span className="truncate">{right.name}</span>
          </div>
          {rows.map((row) => (
            <div key={row.key} className={`grid grid-cols-[minmax(96px,0.7fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 border-t border-white/10 px-3 py-2 text-xs ${row.differs ? 'bg-[#00f3ff]/[0.04]' : ''}`}>
              <span className="font-mono text-[9px] uppercase text-white/45">{row.label}</span>
              <span className="break-words text-white/80">{row.leftValue}</span>
              <span className="break-words text-white/80">{row.rightValue}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
