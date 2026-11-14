import { AlertTriangle, LoaderCircle, Orbit } from 'lucide-react';
import { motion } from 'framer-motion';
import { ASSET_STATES } from '@/utils/assetStatus';

const copy = {
  Moon: {
    title: 'INITIALIZING LUNAR SURFACE',
    subtitle: 'Loading lunar surface cartography',
    accent: '#c8d0dc',
    stages: ['Establishing lunar surface data', 'Preparing planetary material', 'Mapping surface coordinates'],
  },
  Mars: {
    title: 'INITIALIZING MARTIAN SURFACE',
    subtitle: 'Loading Mars planetary cartography',
    accent: '#c96a42',
    stages: ['Establishing planetary surface data', 'Preparing Martian material', 'Mapping surface coordinates'],
  },
};

export default function PlanetLoadingOverlay({ body, status }) {
  if (status !== ASSET_STATES.LOADING && status !== ASSET_STATES.FAILED) return null;
  const content = copy[body];
  const failed = status === ASSET_STATES.FAILED;
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 bottom-0 top-[64px] z-[25] flex items-center justify-center bg-space-black/75 p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
      aria-label={failed ? `${body} surface fallback active` : content.title}
    >
      <div className="instrument-panel w-[min(90vw,420px)] rounded-lg p-7 text-center">
        {failed ? (
          <AlertTriangle className="mx-auto text-solar-amber" size={22} aria-hidden="true" />
        ) : (
          <LoaderCircle className="mx-auto animate-spin" style={{ color: content.accent }} size={22} aria-hidden="true" />
        )}
        <p className="mt-4 font-mono text-xs font-medium tracking-[0.14em]" style={{ color: content.accent }}>
          {failed ? `${body.toUpperCase()} SURFACE UNAVAILABLE` : content.title}
        </p>
        <p className="mt-2.5 text-sm text-ink-secondary">
          {failed ? 'Surface texture unavailable. Procedural surface active.' : content.subtitle}
        </p>
        <div className="mt-5 divide-y divide-white/[0.06] border-t border-white/[0.08] pt-2 text-left">
          {content.stages.map((stage, index) => (
            <div key={stage} className="flex items-center gap-3 py-2 text-xs text-ink-muted">
              <Orbit size={12} style={{ color: index === 0 ? content.accent : undefined }} aria-hidden="true" />
              <span>{stage}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-[10px] text-ink-muted">
          {failed ? 'Continuing with local planetary fallback' : 'Awaiting texture decode and GPU upload'}
        </p>
      </div>
    </motion.div>
  );
}
