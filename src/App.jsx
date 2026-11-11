import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import equipment from '@/data/equipment.json';
import Header from '@/components/ui/Header';
import PlanetGlobe from '@/components/3d/PlanetGlobe';
import TelemetryHUD from '@/components/ui/TelemetryHUD';

export default function App() {
  const [activeBody, setActiveBody] = useState('Moon');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setSelectedEquipmentId(null);
    setIsInspectorOpen(false);
    setIsPlayingAudio(false);
  }, [activeBody]);

  const selectedEquipment =
    equipment.find((item) => item.id === selectedEquipmentId) || null;

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-space-black">
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col">
        <Header
          activeBody={activeBody}
          onToggleBody={setActiveBody}
        />
        <TelemetryHUD
          selectedEquipment={selectedEquipment}
          onClose={() => setSelectedEquipmentId(null)}
          onOpenInspector={() => setIsInspectorOpen(true)}
          onPlayAudio={() => setIsPlayingAudio(true)}
        />
      </div>

      <Canvas
        className="pointer-events-auto"
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#08090c']} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 4, 5]} intensity={3} />
        <pointLight position={[-4, -2, 3]} intensity={1.5} color="#00f3ff" />
        <PlanetGlobe
          activeBody={activeBody}
          selectedEquipmentId={selectedEquipmentId}
          onSelectEquipment={setSelectedEquipmentId}
        />
      </Canvas>
    </main>
  );
}
