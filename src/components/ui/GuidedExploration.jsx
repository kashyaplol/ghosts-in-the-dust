import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Headphones, Pause, Play, Scan, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import equipment from '@/data/equipment.json';
import { useSpaceContext } from '@/context/SpaceContext';
import { ASSET_STATES } from '@/utils/assetStatus';
import { getHardwareImage } from '@/utils/hardwareImages';
import { hasHardwareModel } from '@/utils/models';
import { getGuidedMissions } from '@/utils/guidedMissions';
import GuidedIntroduction from '@/components/ui/GuidedIntroduction';

const readyStates = [ASSET_STATES.LOADED, ASSET_STATES.FAILED, ASSET_STATES.FALLBACK];

export default function GuidedExploration({
  open,
  activeBody,
  selectedEquipmentId,
  textureStatus,
  rendererReady,
  onCameraAction,
  onExit,
  onOpenInspector,
  onPlayAudio,
}) {
  const { selectEquipment } = useSpaceContext();
  const missions = useMemo(() => getGuidedMissions(equipment), []);
  const [intro, setIntro] = useState(true);
  const [showList, setShowList] = useState(false);
  const [journeyActive, setJourneyActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [index, setIndex] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const requestedMission = useRef(null);
  const mission = missions[index];
  const canUseHardware = hasHardwareModel(mission?.id) || Boolean(getHardwareImage(mission?.id));
  const surfaceReady = rendererReady && readyStates.includes(textureStatus);

  useEffect(() => {
    if (!open) return undefined;
    setIntro(true);
    setShowList(false);
    setJourneyActive(false);
    setPaused(false);
    setIndex(0);
    setCameraReady(false);
    requestedMission.current = null;
    return undefined;
  }, [open]);

  useEffect(() => {
    if (!open || !journeyActive || paused || !mission) return undefined;
    if (requestedMission.current !== mission.id) {
      requestedMission.current = mission.id;
      setCameraReady(false);
      selectEquipment(mission.id);
      return undefined;
    }
    if (activeBody !== mission.body || selectedEquipmentId !== mission.id || !surfaceReady) return undefined;
    onCameraAction('focus');
    const timer = window.setTimeout(() => setCameraReady(true), 760);
    return () => window.clearTimeout(timer);
  }, [
    activeBody,
    journeyActive,
    mission,
    onCameraAction,
    open,
    paused,
    selectEquipment,
    selectedEquipmentId,
    surfaceReady,
  ]);

  if (!open) return null;

  const startJourney = (startIndex) => {
    setIndex(startIndex);
    setIntro(false);
    setShowList(false);
    setJourneyActive(true);
    setPaused(false);
    requestedMission.current = null;
  };
  const moveTo = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= missions.length) return;
    setIndex(nextIndex);
    setPaused(false);
    requestedMission.current = null;
  };
  const accent = mission?.body === 'Mars' ? '#ffb703' : '#00f3ff';

  return (
    <AnimatePresence mode="wait">
      {intro ? (
        <GuidedIntroduction
          key="intro"
          missions={missions}
          showList={showList}
          onToggleList={() => setShowList((value) => !value)}
          onStart={startJourney}
          onChoose={startJourney}
          onExit={onExit}
        />
      ) : (
        <motion.section
          key="journey"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          className="pointer-events-auto fixed bottom-6 left-6 z-[45] max-h-[72vh] w-[min(90vw,430px)] overflow-y-auto rounded-xl border bg-[#12141d]/95 p-5 shadow-2xl backdrop-blur-md"
          style={{ borderColor: `${accent}55` }}
          aria-label="Guided mission exploration"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: accent }}>Guided exploration // {index + 1}/{missions.length}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{mission.name}</h2>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/45">{mission.body} · landed {mission.landedDate}</p>
            </div>
            <button type="button" onClick={onExit} aria-label="Exit guided exploration" className="text-white/50 hover:text-white"><X size={18} /></button>
          </div>

          <div className="mt-4 flex gap-1" aria-label={`Mission ${index + 1} of ${missions.length}`}>
            {missions.map((item, itemIndex) => <span key={item.id} className="h-1 flex-1 rounded" style={{ backgroundColor: itemIndex <= index ? accent : 'rgba(255,255,255,0.12)' }} />)}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/75">{mission.primaryMission}</p>
          <div className="mt-4 rounded border border-white/10 bg-black/10 p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">Documented status</p>
            <p className="mt-1 text-sm" style={{ color: accent }}>{mission.status}</p>
          </div>
          <div className="mt-4 rounded border border-white/10 p-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">Narrative transmission</p>
            <p className="mt-2 text-sm italic leading-relaxed text-white/70">&ldquo;{mission.narrativeTranscript}&rdquo;</p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-white/30">First-person archive narrative · not a live telemetry reading</p>
          </div>
          <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-white/45" role="status">
            <Scan size={13} style={{ color: accent }} />
            {!surfaceReady ? 'Preparing planetary surface' : !cameraReady ? 'Aligning mission coordinates' : 'Mission coordinates acquired'}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {canUseHardware && <button type="button" onClick={onOpenInspector} className="rounded border border-[#00f3ff]/40 px-3 py-2 font-mono text-[10px] text-[#00f3ff] hover:bg-[#00f3ff]/10">INSPECT HARDWARE</button>}
            {mission.narrativeTranscript?.trim() && <button type="button" onClick={onPlayAudio} className="flex items-center justify-center gap-2 rounded border border-[#ffb703]/40 px-3 py-2 font-mono text-[10px] text-[#ffb703] hover:bg-[#ffb703]/10"><Headphones size={13} /> FINAL HOURS</button>}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
            <button type="button" onClick={() => moveTo(index - 1)} disabled={index === 0} className="flex items-center gap-1 rounded px-2 py-2 font-mono text-[10px] text-white/60 hover:bg-white/10 disabled:opacity-30"><ArrowLeft size={13} /> PREVIOUS</button>
            <button type="button" onClick={() => setPaused((value) => !value)} className="flex items-center gap-1 rounded border border-white/15 px-3 py-2 font-mono text-[10px] text-white/75 hover:border-white/40">{paused ? <Play size={13} /> : <Pause size={13} />} {paused ? 'RESUME' : 'PAUSE'}</button>
            <button type="button" onClick={() => moveTo(index + 1)} disabled={index === missions.length - 1} className="flex items-center gap-1 rounded px-2 py-2 font-mono text-[10px] text-white/60 hover:bg-white/10 disabled:opacity-30">NEXT <ArrowRight size={13} /></button>
          </div>
          <button type="button" onClick={() => moveTo(index + 1)} disabled={index === missions.length - 1} className="mt-2 w-full rounded border border-[#ffb703]/30 px-3 py-2 font-mono text-[10px] tracking-wider text-[#ffb703] hover:bg-[#ffb703]/10 disabled:opacity-30">SKIP MISSION</button>
          <button type="button" onClick={onExit} className="mt-3 w-full font-mono text-[10px] uppercase tracking-wider text-white/35 hover:text-white">Exit journey</button>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
