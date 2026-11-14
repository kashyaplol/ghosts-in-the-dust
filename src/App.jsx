import { useCallback, useLayoutEffect, useState } from 'react';
import CanvasContainer from '@/components/3d/CanvasContainer';
import AudioPlayer from '@/components/ui/AudioPlayer';
import Header from '@/components/ui/Header';
import HardwareInspector from '@/components/ui/HardwareInspector';
import TelemetryHUD from '@/components/ui/TelemetryHUD';
import TutorialOverlay from '@/components/ui/TutorialOverlay';
import CameraActions from '@/components/ui/CameraActions';
import ShortcutGuide from '@/components/ui/ShortcutGuide';
import LoadingScreen from '@/components/ui/LoadingScreen';
import AssetStatus from '@/components/ui/AssetStatus';
import PlanetLoadingOverlay from '@/components/ui/PlanetLoadingOverlay';
import GuidedExploration from '@/components/ui/GuidedExploration';
import MissionTimeline from '@/components/ui/MissionTimeline';
import useOnboarding from '@/hooks/useOnboarding';
import useMissionSearch from '@/hooks/useMissionSearch';
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts';
import { useSpaceContext } from '@/context/SpaceContext';
import { ASSET_STATES } from '@/utils/assetStatus';

export default function App() {
  const {
    activeBody,
    selectedEquipment,
    selectedEquipmentId,
    isInspectorOpen,
    isPlayingAudio,
    isAudioOpen,
    clearSelection,
    openInspector,
    closeInspector,
    selectEquipment,
    startAudio,
    stopAudio,
    closeAudio,
  } = useSpaceContext();
  const [textureStatuses, setTextureStatuses] = useState({
    Moon: ASSET_STATES.LOADING,
    Mars: ASSET_STATES.NOT_REQUESTED,
  });
  const [rendererReady, setRendererReady] = useState(false);
  const [cameraAction, setCameraAction] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutGuideOpen, setShortcutGuideOpen] = useState(false);
  const [guidedOpen, setGuidedOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const { isOpen: isTutorialOpen, finish, replay } = useOnboarding();
  const requestCameraAction = useCallback((type) => {
    setCameraAction({ type, nonce: Date.now() });
  }, []);
  const handleRendererReady = useCallback(() => setRendererReady(true), []);
  const selectMission = useCallback((mission) => {
    selectEquipment(mission.id);
    setSearchOpen(false);
  }, [selectEquipment]);
  const search = useMissionSearch(selectMission);
  const focusSearch = useCallback(() => {
    setSearchOpen(true);
    window.requestAnimationFrame(() => search.inputRef.current?.focus());
  }, [search.inputRef]);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const toggleShortcutGuide = useCallback(() => setShortcutGuideOpen((open) => !open), []);
  useKeyboardShortcuts({
    inputRef: search.inputRef,
    isTutorialOpen,
    isInspectorOpen,
    isAudioOpen,
    isShortcutGuideOpen: shortcutGuideOpen,
    searchOpen,
    hasSearchResults: Boolean(search.query.trim() || search.filtersActive),
    hasSelection: Boolean(selectedEquipmentId),
    onCameraAction: requestCameraAction,
    onClearSearch: search.clearAll,
    onDismissSearch: closeSearch,
    onFocusSearch: focusSearch,
    onNavigateSearch: search.navigate,
    onSelectSearch: search.selectHighlighted,
    onCloseInspector: closeInspector,
    onCloseAudio: closeAudio,
    onCloseShortcutGuide: () => setShortcutGuideOpen(false),
    onToggleShortcutGuide: toggleShortcutGuide,
    onCloseSelection: clearSelection,
  });

  useLayoutEffect(() => {
    setTextureStatuses((current) => ({ ...current, [activeBody]: ASSET_STATES.LOADING }));
  }, [activeBody]);
  const handleTextureStatus = useCallback((body, status) => {
    setTextureStatuses((current) => ({ ...current, [body]: status }));
  }, []);
  const currentTextureStatus = textureStatuses[activeBody];
  const loadingVisible = !rendererReady;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-space-black">
      <CanvasContainer
        activeBody={activeBody}
        selectedEquipmentId={selectedEquipmentId}
        onSelectEquipment={selectEquipment}
        cameraAction={cameraAction}
        onTextureStatus={handleTextureStatus}
        onRendererReady={handleRendererReady}
        textureStatus={currentTextureStatus}
      />
      <CameraActions
        hasSelection={Boolean(selectedEquipmentId)}
        onAction={requestCameraAction}
      />
      <AssetStatus body={activeBody} status={currentTextureStatus} />
      <LoadingScreen
        visible={loadingVisible}
        ready={rendererReady}
        stage={!rendererReady ? 'Initializing planetary renderer' : 'Loading planetary surface assets'}
      />
      {rendererReady && (
        <PlanetLoadingOverlay body={activeBody} status={currentTextureStatus} />
      )}
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col">
        <Header
          onReplayTutorial={replay}
          onToggleShortcuts={toggleShortcutGuide}
          search={search}
          searchOpen={searchOpen}
          onOpenSearch={() => setSearchOpen(true)}
          onDismissSearch={closeSearch}
          onSelectMission={selectMission}
          onStartGuidedExploration={() => setGuidedOpen(true)}
          onToggleTimeline={() => setTimelineOpen((open) => !open)}
        />
        <TelemetryHUD
          selectedEquipment={selectedEquipment}
          onClose={clearSelection}
          onOpenInspector={openInspector}
          onPlayAudio={startAudio}
        />
      </div>
      {isInspectorOpen && (
        <HardwareInspector
          equipment={selectedEquipment}
          onClose={closeInspector}
        />
      )}
      {isAudioOpen && (
        <AudioPlayer
          equipment={selectedEquipment}
          isPlaying={isPlayingAudio}
          onPlay={startAudio}
          onStop={stopAudio}
          onClose={closeAudio}
        />
      )}
      {shortcutGuideOpen && <ShortcutGuide onClose={() => setShortcutGuideOpen(false)} />}
      <MissionTimeline
        open={timelineOpen}
        selectedEquipmentId={selectedEquipmentId}
        onSelectMission={(mission) => {
          selectMission(mission);
          setTimelineOpen(false);
        }}
        onClose={() => setTimelineOpen(false)}
      />
      <GuidedExploration
        open={guidedOpen}
        activeBody={activeBody}
        selectedEquipmentId={selectedEquipmentId}
        textureStatus={currentTextureStatus}
        rendererReady={rendererReady}
        onCameraAction={requestCameraAction}
        onExit={() => setGuidedOpen(false)}
        onOpenInspector={openInspector}
        onPlayAudio={startAudio}
      />
      <TutorialOverlay open={isTutorialOpen} onFinish={finish} />
    </main>
  );
}
