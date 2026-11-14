import { useCallback, useEffect, useState } from 'react';
import CanvasContainer from '@/components/3d/CanvasContainer';
import AudioPlayer from '@/components/ui/AudioPlayer';
import Header from '@/components/ui/Header';
import HardwareInspector from '@/components/ui/HardwareInspector';
import TelemetryHUD from '@/components/ui/TelemetryHUD';
import TutorialOverlay from '@/components/ui/TutorialOverlay';
import CameraActions from '@/components/ui/CameraActions';
import ShortcutGuide from '@/components/ui/ShortcutGuide';
import useOnboarding from '@/hooks/useOnboarding';
import useMissionSearch from '@/hooks/useMissionSearch';
import useKeyboardShortcuts from '@/hooks/useKeyboardShortcuts';
import { useSpaceContext } from '@/context/SpaceContext';

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
  const [textureStatus, setTextureStatus] = useState('loading');
  const [cameraAction, setCameraAction] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutGuideOpen, setShortcutGuideOpen] = useState(false);
  const { isOpen: isTutorialOpen, finish, replay } = useOnboarding();
  const requestCameraAction = useCallback((type) => {
    setCameraAction({ type, nonce: Date.now() });
  }, []);
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

  useEffect(() => {
    setTextureStatus('loading');
  }, [activeBody]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-space-black">
      <CanvasContainer
        activeBody={activeBody}
        selectedEquipmentId={selectedEquipmentId}
        onSelectEquipment={selectEquipment}
        onTextureStatus={setTextureStatus}
        cameraAction={cameraAction}
      />
      <CameraActions
        hasSelection={Boolean(selectedEquipmentId)}
        onAction={requestCameraAction}
      />
      <div className="pointer-events-none fixed bottom-4 left-4 z-20 rounded border border-white/10 bg-[#12141d]/80 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/50">
        {textureStatus === 'loaded'
          ? `${activeBody} NASA surface texture active`
          : textureStatus === 'loading'
            ? `${activeBody} surface texture loading`
            : `${activeBody} procedural surface fallback — NASA texture unavailable`}
      </div>
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col">
        <Header
          onReplayTutorial={replay}
          onToggleShortcuts={toggleShortcutGuide}
          search={search}
          searchOpen={searchOpen}
          onOpenSearch={() => setSearchOpen(true)}
          onDismissSearch={closeSearch}
          onSelectMission={selectMission}
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
      <TutorialOverlay open={isTutorialOpen} onFinish={finish} />
    </main>
  );
}
