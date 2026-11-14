import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const steps = [
  { title: 'WELCOME', body: 'Explore abandoned lunar and Martian missions, inspect their hardware, and listen to their final transmissions.', target: null },
  { title: 'PLANETARY EXPLORATION', body: 'Use the Moon and Mars selector to move between planetary archives.', target: '[data-tutorial="planet-selector"]' },
  { title: 'CAMERA CONTROLS', body: 'Left-click and drag to rotate. Use the scroll wheel to zoom. The camera returns to a stable orbit after each mission fly-to.', target: 'canvas' },
  { title: 'MISSION MARKERS', body: 'Glowing markers identify historical landing sites. Click one to open its telemetry.', target: 'canvas' },
  { title: 'TELEMETRY HUD', body: 'Review landing dates, status, technical specifications, operational lifespan, and cause-of-signal-loss analysis.', target: '[data-tutorial="telemetry"]' },
  { title: 'HARDWARE INSPECTOR', body: 'Inspect available interactive 3D models or verified static mission images from the telemetry panel.', target: '[data-tutorial="inspect-button"]' },
  { title: 'FINAL HOURS', body: 'Open a mission transmission to hear a synthesized historical narrative and follow its transcript progress.', target: '[data-tutorial="transmission-button"]' },
  { title: 'COMPLETION', body: 'You are ready to explore the archive. You can reopen this guide at any time with HELP.', target: null },
];

function getTargetRect(selector) {
  if (!selector) return null;
  const element = document.querySelector(selector);
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return { top: rect.top - 8, left: rect.left - 8, width: rect.width + 16, height: rect.height + 16 };
}

export default function TutorialOverlay({ open, onFinish }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const closeRef = useRef(null);
  const current = steps[step];
  const progress = `${step + 1}/${steps.length}`;

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
      ? { top: Math.min(rect.top + rect.height + 20, window.innerHeight - 280) }
      : { top: '50%', transform: 'translate(-50%, -50%)' }
  ), [rect]);

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[70] bg-[#020308]/75 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="First-time exploration tutorial"
      >
        {rect && <div className="pointer-events-none fixed rounded-xl border border-[#00f3ff] shadow-[0_0_0_9999px_rgba(2,3,8,0.72),0_0_24px_rgba(0,243,255,0.5)]" style={rect} />}
        <motion.section
          className="pointer-events-auto absolute left-1/2 w-[min(92vw,460px)] -translate-x-1/2 rounded-xl border border-[#00f3ff]/30 bg-[#12141d]/95 p-6 shadow-2xl backdrop-blur-md"
          style={cardPosition}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          key={step}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-[#00f3ff]">ARCHIVE ORIENTATION // {progress}</p>
              <h2 className="mt-3 text-xl font-semibold tracking-widest text-white">{current.title}</h2>
            </div>
            <button ref={closeRef} type="button" onClick={() => onFinish('skipped')} className="rounded p-2 text-white/50 hover:bg-white/10 hover:text-white" aria-label="Skip tutorial">
              <X size={18} />
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/70">{current.body}</p>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" onClick={() => onFinish('skipped')} className="font-mono text-xs uppercase tracking-wider text-white/50 hover:text-white">
              Skip
            </button>
            <div className="flex gap-2">
              {step > 0 && <button type="button" onClick={() => setStep((value) => value - 1)} className="flex items-center gap-1 rounded border border-white/10 px-3 py-2 font-mono text-xs text-white/70 hover:border-white/30"><ArrowLeft size={14} /> PREVIOUS</button>}
              <button type="button" onClick={() => (step === steps.length - 1 ? onFinish('completed') : setStep((value) => value + 1))} className="flex items-center gap-1 rounded bg-[#00f3ff] px-4 py-2 font-mono text-xs font-bold text-[#08090c] hover:bg-white">
                {step === 0 ? 'START EXPLORATION' : step === steps.length - 1 ? 'EXPLORE NOW' : 'NEXT'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}
