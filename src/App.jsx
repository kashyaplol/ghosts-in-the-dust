import { useEffect, useState } from 'react';
import CanvasContainer from '@/components/3d/CanvasContainer';
import AudioPlayer from '@/components/ui/AudioPlayer';
import Header from '@/components/ui/Header';
import HardwareInspector from '@/components/ui/HardwareInspector';
import TelemetryHUD from '@/components/ui/TelemetryHUD';
import TutorialOverlay from '@/components/ui/TutorialOverlay';
import useOnboarding from '@/hooks/useOnboarding';
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
  const { isOpen: isTutorialOpen, finish, replay } = useOnboarding();

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
      />
      <div className="pointer-events-none fixed bottom-4 left-4 z-20 rounded border border-white/10 bg-[#12141d]/80 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-white/50">
        {textureStatus === 'loaded'
          ? `${activeBody} NASA surface texture active`
          : textureStatus === 'loading'
            ? `${activeBody} surface texture loading`
            : `${activeBody} procedural surface fallback — NASA texture unavailable`}
      </div>
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col">
        <Header onReplayTutorial={replay} />
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
      <TutorialOverlay open={isTutorialOpen} onFinish={finish} />
    </main>
  );
}
