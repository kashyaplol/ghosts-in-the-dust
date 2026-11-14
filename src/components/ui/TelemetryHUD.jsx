import { AnimatePresence, motion } from 'framer-motion';
import { Box, Radio } from 'lucide-react';
import { BodyTag, Button, PanelHeader, StatusIndicator } from '@/components/ui/primitives';
import {
  formatCoordinates,
  getOperationalLifespan,
  getStatusMeta,
} from '@/utils/missionTheme';

export default function TelemetryHUD({
  selectedEquipment,
  onClose,
  onOpenInspector,
  onPlayAudio,
}) {
  const statusMeta = selectedEquipment ? getStatusMeta(selectedEquipment.status) : null;

  return (
    <AnimatePresence mode="wait">
      {selectedEquipment && (
        <motion.section
          data-tutorial="telemetry"
          key={selectedEquipment.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="instrument-panel pointer-events-auto fixed right-4 top-[92px] z-30 flex max-h-[calc(100vh-10.75rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg sm:right-5 sm:w-[344px] lg:top-[72px] lg:max-h-[calc(100vh-5.75rem)]"
          aria-label={`${selectedEquipment.name} telemetry`}
        >
          <div className="shrink-0 border-b border-white/10 px-4 pb-3 pt-4">
            <PanelHeader
              eyebrow="Mission Telemetry"
              eyebrowClass="text-ink-muted"
              title={selectedEquipment.name}
              onClose={onClose}
              closeLabel="Close mission telemetry"
            >
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-ink-secondary">
                <BodyTag body={selectedEquipment.body} />
                <span aria-hidden="true" className="text-ink-muted">·</span>
                <span className="font-mono text-[11px] tabular-data text-ink-muted">
                  {formatCoordinates(selectedEquipment.latitude, selectedEquipment.longitude)}
                </span>
              </div>
            </PanelHeader>

            <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-2.5">
              <span className="text-xs text-ink-muted">Status</span>
              <StatusIndicator status={selectedEquipment.status} />
            </div>
          </div>

          <div className="archive-scroll min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-3.5">
            <dl className="grid grid-cols-3 gap-2.5 border-b border-white/[0.07] pb-3.5">
              <div>
                <dt className="text-[11px] text-ink-muted">Landed</dt>
                <dd className="mt-1 font-mono text-xs tabular-data text-ink-primary">
                  {selectedEquipment.landedDate}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-ink-muted">Last signal</dt>
                <dd className="mt-1 font-mono text-xs tabular-data text-ink-primary">
                  {selectedEquipment.lastSignalDate}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-ink-muted">Lifespan</dt>
                <dd className="mt-1 font-mono text-xs tabular-data text-ink-primary">
                  {getOperationalLifespan(
                    selectedEquipment.landedDate,
                    selectedEquipment.lastSignalDate,
                  )}
                </dd>
              </div>
            </dl>

            <div>
              <h3 className={`text-xs font-medium ${statusMeta.textClass}`}>
                {statusMeta.heading}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                {selectedEquipment.causeOfDeath}
              </p>
            </div>

            <div className="border-t border-white/[0.07] pt-3.5">
              <h3 className="text-xs font-medium text-ink-primary">Technical Specifications</h3>
              <dl className="mt-2 divide-y divide-white/[0.06]">
                {[
                  ['Dry mass', selectedEquipment.technicalSpecs.mass],
                  ['Power', selectedEquipment.technicalSpecs.powerSource],
                  ['Traverse', selectedEquipment.technicalSpecs.totalDistance],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-1.5">
                    <dt className="shrink-0 text-xs text-ink-muted">{label}</dt>
                    <dd className="text-right font-mono text-xs tabular-data text-ink-primary">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="border-t border-white/[0.07] pt-3.5">
              <h3 className="text-xs font-medium text-ink-primary">Primary Mission</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                {selectedEquipment.primaryMission}
              </p>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-white/10 bg-panel-recessed/70 px-4 py-3">
            <Button
              data-tutorial="inspect-button"
              variant="primary"
              size="md"
              onClick={onOpenInspector}
              className="w-full"
            >
              <Box size={14} aria-hidden="true" />
              Inspect Hardware
            </Button>
            <Button
              data-tutorial="transmission-button"
              variant="secondary"
              size="md"
              onClick={onPlayAudio}
              className="w-full"
            >
              <Radio size={14} aria-hidden="true" className="text-solar-amber" />
              Final Hours
            </Button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
