import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { BodyTag, Button, PanelHeader } from '@/components/ui/primitives';

function MissionList({ missions, onChoose }) {
  return (
    <ol className="archive-scroll mt-4 max-h-56 divide-y divide-white/[0.06] overflow-y-auto border-t border-white/10 pt-2">
      {missions.map((mission, index) => (
        <li key={mission.id}>
          <button
            type="button"
            onClick={() => onChoose(index)}
            className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2.5 text-left transition-colors hover:bg-panel-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-accent/75"
          >
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 font-mono text-[11px] tabular-data text-ink-muted">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span aria-hidden="true">·</span>
                <BodyTag body={mission.body} className="text-[11px]" />
              </span>
              <span className="mt-0.5 block truncate text-sm font-medium text-ink-primary">
                {mission.name}
              </span>
            </span>
            <ArrowRight size={14} className="shrink-0 text-ink-muted" aria-hidden="true" />
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="instrument-panel pointer-events-auto fixed left-4 top-28 z-[45] w-[calc(100vw-2rem)] rounded-lg p-5 sm:left-6 lg:top-20 sm:w-[400px] sm:p-6"
      role="dialog"
      aria-modal="false"
      aria-label="Guided exploration introduction"
    >
      <PanelHeader
        eyebrow="Archive Expedition"
        eyebrowClass="text-solar-amber"
        title="Abandoned but Not Forgotten"
        onClose={onExit}
        closeLabel="Exit guided exploration"
      />
      <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
        Follow the chronological arc of robotic explorers across the Moon and Mars, from Apollo Tranquility Base to Jezero Crater.
      </p>
      <div className="mt-5 grid gap-2.5">
        <Button variant="primary" size="lg" onClick={() => onStart(0)} className="w-full">
          <Compass size={15} aria-hidden="true" />
          START JOURNEY
        </Button>
        <Button variant="secondary" size="md" onClick={onToggleList} className="w-full">
          {showList ? 'HIDE MISSION LIST' : 'VIEW MISSION LIST'}
        </Button>
      </div>
      {showList && <MissionList missions={missions} onChoose={onChoose} />}
      <div className="mt-4 flex justify-end border-t border-white/[0.08] pt-3">
        <Button variant="tertiary" size="sm" onClick={onExit}>
          Exit
        </Button>
      </div>
    </motion.section>
  );
}
