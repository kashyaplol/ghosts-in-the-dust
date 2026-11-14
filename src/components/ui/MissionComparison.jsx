import { ArrowUpRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import equipment from '@/data/equipment.json';
import { BodyTag, Button, PanelHeader } from '@/components/ui/primitives';
import { getComparisonRows } from '@/utils/missionComparison';

function MissionColumn({ label, mission, selectedId, onChange, onOpen }) {
  return (
    <div className="min-w-0 rounded-md border border-white/10 bg-panel-recessed/80 p-3.5">
      <label className="block text-[11px] font-medium text-ink-muted">
        {label}
        <select
          value={selectedId}
          onChange={onChange}
          aria-label={`${label} mission`}
          className="mt-2 h-9 w-full rounded-md border border-white/12 bg-panel-dark px-2.5 text-xs font-medium text-ink-primary outline-none transition-colors focus:border-ice-accent/70"
        >
          {equipment.map((option) => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
      </label>
      <div className="mt-3 flex items-center justify-between gap-2">
        <BodyTag body={mission.body} />
        <Button variant="secondary" size="sm" onClick={() => onOpen(mission)}>
          Open in Explorer
          <ArrowUpRight size={13} aria-hidden="true" />
        </Button>
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
    <div className="pointer-events-auto fixed inset-0 z-[60] flex items-center justify-center bg-space-black/80 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Mission comparison"
        className="instrument-panel archive-scroll max-h-[90vh] w-[min(96vw,880px)] overflow-y-auto rounded-lg p-5 sm:p-6"
      >
        <PanelHeader
          eyebrow="Comparative Analysis"
          eyebrowClass="text-ice-accent"
          title="Mission Comparison"
          onClose={onClose}
          closeLabel="Close mission comparison"
        >
          <p className="mt-1 text-xs text-ink-secondary">
            Side-by-side archival records with differing fields highlighted.
          </p>
        </PanelHeader>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <MissionColumn
            label="Mission one"
            mission={left}
            selectedId={leftId}
            onChange={(event) => setLeftId(event.target.value)}
            onOpen={openMission}
          />
          <MissionColumn
            label="Mission two"
            mission={right}
            selectedId={rightId}
            onChange={(event) => setRightId(event.target.value)}
            onOpen={openMission}
          />
        </div>

        <div className="mt-5 overflow-hidden rounded-md border border-white/10">
          <div className="grid grid-cols-[minmax(108px,0.75fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 bg-panel-recessed px-4 py-2.5 text-[11px] font-medium text-ink-muted">
            <span>Parameter</span>
            <span className="truncate text-ink-primary">{left.name}</span>
            <span className="truncate text-ink-primary">{right.name}</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.key}
              className={`grid grid-cols-[minmax(108px,0.75fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-t border-white/[0.08] px-4 py-3 text-xs ${
                row.differs ? 'bg-ice-accent/[0.05]' : ''
              }`}
            >
              <span className="flex items-start gap-2 text-ink-muted">
                {row.differs && (
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ice-accent"
                  />
                )}
                <span>{row.label}</span>
              </span>
              <span className="break-words leading-relaxed text-ink-primary tabular-data">
                {row.leftValue}
              </span>
              <span className="break-words leading-relaxed text-ink-primary tabular-data">
                {row.rightValue}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
