import CanvasContainer from '@/components/3d/CanvasContainer';
import AudioPlayer from '@/components/ui/AudioPlayer';
import Header from '@/components/ui/Header';
import HardwareInspector from '@/components/ui/HardwareInspector';
import TelemetryHUD from '@/components/ui/TelemetryHUD';
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

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-space-black">
      <CanvasContainer
        activeBody={activeBody}
        selectedEquipmentId={selectedEquipmentId}
        onSelectEquipment={selectEquipment}
      />
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col">
        <Header />
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
    </main>
  );
}
