import { Suspense, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import equipment from '@/data/equipment.json';
import PlanetGlobe from '@/components/3d/PlanetGlobe';
import PlanetAtmosphere from '@/components/3d/PlanetAtmosphere';
import CameraController from '@/components/3d/CameraController';
import { latLongToVector3 } from '@/utils/coordinates';

function LoadingGlobe() {
  return (
    <mesh>
      <sphereGeometry args={[2, 24, 24]} />
      <meshStandardMaterial color="#252936" wireframe />
    </mesh>
  );
}

export default function CanvasContainer({
  activeBody,
  selectedEquipmentId,
  onSelectEquipment,
  onTextureStatus,
}) {
  const controlsRef = useRef();
  const selected = equipment.find((item) => item.id === selectedEquipmentId);
  const target = useMemo(() => (
    selected ? latLongToVector3(selected.latitude, selected.longitude, 2.05) : null
  ), [selected]);

  return (
    <Canvas
      className="pointer-events-auto"
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.75]}
    >
      <color attach="background" args={['#08090c']} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 4, 5]} intensity={3} />
      <pointLight position={[-4, -2, 3]} intensity={1.5} color="#00f3ff" />
      <Suspense fallback={<LoadingGlobe />}>
        <PlanetGlobe
          activeBody={activeBody}
          selectedEquipmentId={selectedEquipmentId}
          onSelectEquipment={onSelectEquipment}
          onTextureStatus={onTextureStatus}
        />
        <PlanetAtmosphere color={activeBody === 'Moon' ? '#00f3ff' : '#ffb703'} />
      </Suspense>
      <CameraController target={target} controlsRef={controlsRef} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        minDistance={3}
        maxDistance={8}
        autoRotate={!selectedEquipmentId}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
