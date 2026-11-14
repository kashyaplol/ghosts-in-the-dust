import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Box, Headphones, Pause, Play, Scan } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import equipment from '@/data/equipment.json';
import { useSpaceContext } from '@/context/SpaceContext';
import { ASSET_STATES } from '@/utils/assetStatus';
import { getHardwareImage } from '@/utils/hardwareImages';
import { hasHardwareModel } from '@/utils/models';
import { getGuidedMissions } from '@/utils/guidedMissions';
import { getBodyTheme } from '@/utils/missionTheme';
import GuidedIntroduction from '@/components/ui/GuidedIntroduction';
import { BodyTag, Button, PanelHeader, StatusIndicator } from '@/components/ui/primitives';

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
  }, [activeBody, journeyActive, mission, onCameraAction, open, paused, selectEquipment, selectedEquipmentId, surfaceReady]);

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
  const bodyTheme = getBodyTheme(mission?.body);

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
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="instrument-panel archive-scroll pointer-events-auto fixed bottom-16 left-4 z-[45] max-h-[calc(100vh-10.75rem)] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg p-4 sm:left-5 sm:w-[376px] lg:bottom-5 lg:max-h-[76vh]"
          aria-label="Guided mission exploration"
        >
          <PanelHeader
            eyebrow={`Guided Exploration · ${index + 1} of ${missions.length}`}
            eyebrowClass="text-solar-amber"
            title={mission.name}
            onClose={onExit}
            closeLabel="Exit guided exploration"
          >
            <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-secondary">
              <BodyTag body={mission.body} />
              <span aria-hidden="true" className="text-ink-muted">·</span>
              <span className="font-mono text-[11px] tabular-data text-ink-muted">Landed {mission.landedDate}</span>
            </div>
          </PanelHeader>
          <div className="mt-4 flex gap-1" aria-label={`Mission ${index + 1} of ${missions.length}`}>
            {missions.map((item, itemIndex) => (
              <span key={item.id} className="h-1 flex-1 rounded-sm transition-colors duration-200" style={{ backgroundColor: itemIndex <= index ? bodyTheme.accent : 'rgba(255,255,255,0.1)' }} />
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{mission.primaryMission}</p>
          <div className="mt-4 flex items-center justify-between border-y border-white/[0.08] py-2.5">
            <span className="text-xs text-ink-muted">Documented status</span>
            <StatusIndicator status={mission.status} />
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-ink-primary">Narrative transmission</p>
            <blockquote className="mt-1.5 text-sm italic leading-relaxed text-ink-secondary">&ldquo;{mission.narrativeTranscript}&rdquo;</blockquote>
            <p className="mt-1.5 text-[11px] text-ink-muted">First-person archive narrative · not a live telemetry reading</p>
          </div>
          <p className="mt-4 flex items-center gap-2 font-mono text-[11px] text-ink-secondary" role="status">
            <Scan size={13} style={{ color: bodyTheme.accent }} aria-hidden="true" />
            {!surfaceReady ? 'Preparing planetary surface' : !cameraReady ? 'Aligning mission coordinates' : 'Mission coordinates acquired'}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {canUseHardware && (
              <Button variant="secondary" size="sm" onClick={onOpenInspector}>
                <Box size={13} aria-hidden="true" className="text-ice-accent" /> Inspect Hardware
              </Button>
            )}
            {mission.narrativeTranscript?.trim() && (
              <Button variant="amber" size="sm" onClick={onPlayAudio}>
                <Headphones size={13} aria-hidden="true" /> Final Hours
              </Button>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-4">
            <Button variant="tertiary" size="sm" onClick={() => moveTo(index - 1)} disabled={index === 0}>
              <ArrowLeft size={13} aria-hidden="true" /> PREVIOUS
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setPaused((value) => !value)}>
              {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
              {paused ? 'RESUME' : 'PAUSE'}
            </Button>
            <Button variant="tertiary" size="sm" onClick={() => moveTo(index + 1)} disabled={index === missions.length - 1}>
              NEXT <ArrowRight size={13} aria-hidden="true" />
            </Button>
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <Button variant="secondary" size="sm" onClick={() => moveTo(index + 1)} disabled={index === missions.length - 1} className="flex-1">
              SKIP MISSION
            </Button>
            <Button variant="tertiary" size="sm" onClick={onExit}>Exit journey</Button>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
