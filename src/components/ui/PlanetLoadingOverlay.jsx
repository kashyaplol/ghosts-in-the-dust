import { AlertTriangle, LoaderCircle, Orbit } from 'lucide-react';
import { motion } from 'framer-motion';
import { ASSET_STATES } from '@/utils/assetStatus';

const copy = {
  Moon: {
    title: 'INITIALIZING LUNAR SURFACE',
    subtitle: 'Loading NASA lunar surface cartography',
    accent: '#00f3ff',
    stages: ['Establishing lunar surface data', 'Preparing planetary material', 'Mapping surface coordinates'],
  },
  Mars: {
    title: 'INITIALIZING MARTIAN SURFACE',
    subtitle: 'Loading Mars planetary cartography',
    accent: '#ffb703',
    stages: ['Establishing planetary surface data', 'Preparing Martian material', 'Mapping surface coordinates'],
  },
};

export default function PlanetLoadingOverlay({ body, status }) {
  if (status !== ASSET_STATES.LOADING && status !== ASSET_STATES.FAILED) return null;
  const content = copy[body];
  const failed = status === ASSET_STATES.FAILED;
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 bottom-0 top-[88px] z-[25] flex items-center justify-center bg-[#08090c]/75 p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
      aria-label={failed ? `${body} surface fallback active` : content.title}
    >
      <div className="w-[min(90vw,440px)] rounded-xl border border-white/10 bg-[#12141d]/90 p-7 text-center shadow-2xl backdrop-blur-md">
        {failed ? (
          <AlertTriangle className="mx-auto text-[#ffb703]" size={22} />
        ) : (
          <LoaderCircle className="mx-auto animate-spin" style={{ color: content.accent }} size={22} />
        )}
        <p className="mt-4 font-mono text-xs font-bold tracking-[0.2em]" style={{ color: content.accent }}>
          {failed ? `${body.toUpperCase()} SURFACE UNAVAILABLE` : content.title}
        </p>
        <p className="mt-3 text-sm text-white/60">
          {failed ? 'NASA texture unavailable. Procedural surface active.' : content.subtitle}
        </p>
        <div className="mt-6 space-y-2 text-left">
          {content.stages.map((stage, index) => (
            <div key={stage} className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-white/45">
              <Orbit size={12} style={{ color: index === 0 ? content.accent : undefined }} />
              {stage}
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-[9px] uppercase tracking-widest text-white/30">
          {failed ? 'Continuing with local planetary fallback' : 'Awaiting texture decode and GPU upload'}
        </p>
      </div>
    </motion.div>
  );
}
