import { useMemo, useState } from 'react';
import equipment from '@/data/equipment.json';
import { BodyTag, PanelHeader } from '@/components/ui/primitives';
import { getBodyTheme } from '@/utils/missionTheme';
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
      className="instrument-panel pointer-events-auto fixed left-4 top-28 z-[44] flex max-h-[calc(100vh-12rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg sm:left-6 lg:top-20 lg:max-h-[calc(100vh-7rem)] sm:w-[376px]"
      aria-label="Historical mission timeline"
    >
      <div className="shrink-0 border-b border-white/10 px-5 pb-4 pt-5">
        <PanelHeader
          eyebrow="Landing Chronology"
          eyebrowClass="text-ice-accent"
          title="Mission Timeline"
          onClose={onClose}
          closeLabel="Close historical mission timeline"
        >
          <p className="mt-1 text-xs text-ink-secondary">
            Ordered archive records from earliest to most recent deployment.
          </p>
        </PanelHeader>

        <div
          className="mt-4 inline-flex items-center rounded-md border border-white/12 bg-panel-recessed p-0.5"
          role="group"
          aria-label="Timeline planet filter"
        >
          {filters.map((filter) => {
            const active = body === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setBody(filter)}
                aria-pressed={active}
                className={`h-7 rounded-[4px] px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-accent/75 ${
                  active
                    ? 'bg-panel-elevated text-ink-primary shadow-sm'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      <ol
        className="archive-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4"
        aria-label="Missions in chronological order"
      >
        {missions.map((mission, index) => {
          const selected = mission.id === selectedEquipmentId;
          const bodyTheme = getBodyTheme(mission.body);
          const isLast = index === missions.length - 1;
          return (
            <li key={mission.id} className="relative flex gap-3.5">
              <div className="flex flex-col items-center pt-1.5" aria-hidden="true">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full border-2 bg-panel-dark"
                  style={{
                    borderColor: selected ? '#67c5d9' : bodyTheme.accent,
                    backgroundColor: selected ? '#67c5d9' : '#0d1015',
                  }}
                />
                {!isLast && <span className="mt-1 w-px flex-1 bg-white/10" />}
              </div>

              <button
                type="button"
                onClick={() => onSelectMission(mission)}
                aria-current={selected ? 'true' : undefined}
                className={`mb-2.5 flex-1 rounded-md border px-3.5 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-accent/75 ${
                  selected
                    ? 'border-ice-accent/55 bg-ice-accent/10'
                    : 'border-white/[0.08] bg-panel-recessed/50 hover:border-white/20 hover:bg-panel-elevated/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="flex items-center gap-1.5 font-mono tabular-data text-ink-muted">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span aria-hidden="true">·</span>
                    <BodyTag body={mission.body} className="text-[11px]" />
                  </span>
                  <span className="font-mono tabular-data text-ink-muted">
                    {getTimelineDate(mission)}
                  </span>
                </div>
                <span className="mt-1 block text-sm font-medium text-ink-primary">
                  {mission.name}
                </span>
              </button>
            </li>
          );
        })}
        {!missions.length && (
          <p className="py-6 text-center text-xs text-ink-muted">
            No missions recorded for this filter.
          </p>
        )}
      </ol>
    </section>
  );
}
