import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Header from '@/components/ui/Header';
import PlanetGlobe from '@/components/3d/PlanetGlobe';

export default function App() {
  const [activeBody, setActiveBody] = useState('Moon');
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);

  useEffect(() => {
    setSelectedEquipmentId(null);
  }, [activeBody]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-space-black">
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col">
        <Header
          activeBody={activeBody}
          onToggleBody={setActiveBody}
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

