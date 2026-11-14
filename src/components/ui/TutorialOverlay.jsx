import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, PanelHeader } from '@/components/ui/primitives';

const steps = [
  { title: 'Planetary Archaeology Archive', body: 'Explore abandoned lunar and Martian missions, inspect their hardware, and listen to their final transmissions.', target: null },
  { title: 'Planetary Archive Switch', body: 'Use the Moon and Mars selector in the top bar to switch between planetary archives.', target: '[data-tutorial="planet-selector"]' },
  { title: 'Orbital Camera Controls', body: 'Drag to orbit the planet and scroll to zoom. Use the bottom instrument dock to reset, focus, or explore.', target: 'canvas' },
  { title: 'Surface Mission Beacons', body: 'Surface beacons mark historical landing sites. Select any beacon to fly to the site and open its telemetry.', target: 'canvas' },
  { title: 'Telemetry Dossier', body: 'Review landing dates, operational lifespan, technical specifications, and cause-of-signal-loss analysis.', target: '[data-tutorial="telemetry"]' },
  { title: 'Hardware Inspector', body: 'Inspect interactive 3D models or verified archival mission photography directly from the telemetry dossier.', target: '[data-tutorial="inspect-button"]' },
  { title: 'Final Hours Log', body: 'Open a mission transmission to listen to a synthesized historical narrative and read the full transcript.', target: '[data-tutorial="transmission-button"]' },
  { title: 'Ready to Explore', body: 'You are ready to begin investigating the archive. Reopen this orientation anytime from Help.', target: null },
];

function getTargetRect(selector) {
  if (!selector) return null;
  const element = document.querySelector(selector);
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { top: rect.top - 6, left: rect.left - 6, width: rect.width + 12, height: rect.height + 12 };
}

export default function TutorialOverlay({ open, onFinish }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const closeRef = useRef(null);
  const current = steps[step];
  const progress = `${step + 1} of ${steps.length}`;

  useEffect(() => {
    if (!open) return undefined;
    setStep(0);
    closeRef.current?.focus();
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const update = () => setRect(getTargetRect(current.target));
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [current.target, open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onFinish('skipped');
      if (event.key === 'ArrowRight' || event.key === 'Enter') setStep((value) => Math.min(value + 1, steps.length - 1));
      if (event.key === 'ArrowLeft') setStep((value) => Math.max(value - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onFinish, open]);

  const cardPosition = useMemo(() => (
    rect
      ? { top: Math.min(Math.max(rect.top + rect.height + 16, 84), window.innerHeight - 260) }
      : { top: '50%', transform: 'translate(-50%, -50%)' }
  ), [rect]);

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[70] bg-space-black/70 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="First-time exploration tutorial"
      >
        {rect && (
          <div
            className="pointer-events-none fixed rounded-md border border-ice-accent/75 shadow-[0_0_0_9999px_rgba(7,8,11,0.72)]"
            style={rect}
          />
        )}
        <motion.section
          className="instrument-panel pointer-events-auto absolute left-1/2 w-[min(92vw,440px)] -translate-x-1/2 rounded-lg p-6"
          style={cardPosition}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          key={step}
        >
          <PanelHeader
            eyebrow={`Archive Orientation · ${progress}`}
            eyebrowClass="text-ice-accent"
            title={current.title}
            onClose={() => onFinish('skipped')}
            closeLabel="Skip tutorial"
            closeRef={closeRef}
          />
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{current.body}</p>

          <div className="mt-5 flex gap-1" aria-hidden="true">
            {steps.map((item, idx) => (
              <span
                key={item.title}
                className={`h-0.5 flex-1 rounded-full ${idx <= step ? 'bg-ice-accent' : 'bg-white/12'}`}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <Button variant="tertiary" size="sm" onClick={() => onFinish('skipped')}>
              Skip
            </Button>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <Button variant="secondary" size="sm" onClick={() => setStep((value) => value - 1)}>
                  <ArrowLeft size={13} aria-hidden="true" />
                  Previous
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => (step === steps.length - 1 ? onFinish('completed') : setStep((value) => value + 1))}
              >
                {step === 0 ? 'Start Exploration' : step === steps.length - 1 ? 'Enter Archive' : 'Next'}
                <ArrowRight size={13} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
