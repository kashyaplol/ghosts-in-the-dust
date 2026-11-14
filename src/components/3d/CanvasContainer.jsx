import { Suspense, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MOUSE } from 'three';
import equipment from '@/data/equipment.json';
import PlanetGlobe from '@/components/3d/PlanetGlobe';
import PlanetAtmosphere from '@/components/3d/PlanetAtmosphere';
import DeepSpaceBackground from '@/components/3d/DeepSpaceBackground';
import PlanetLighting from '@/components/3d/PlanetLighting';
import CameraController from '@/components/3d/CameraController';
import { latLongToVector3 } from '@/utils/coordinates';

export default function CanvasContainer({
  activeBody,
  selectedEquipmentId,
  onSelectEquipment,
  onTextureStatus,
  cameraAction,
  onRendererReady,
  textureStatus,
}) {
  const controlsRef = useRef();
  const selected = equipment.find((item) => item.id === selectedEquipmentId);
  const target = useMemo(() => (
    selected ? latLongToVector3(selected.latitude, selected.longitude, 2.05) : null
  ), [selected]);

  return (
    <Canvas
      data-tutorial="canvas"
      className="pointer-events-auto"
      style={{ touchAction: 'none' }}
      camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, logarithmicDepthBuffer: true }}
      onCreated={() => onRendererReady?.()}
    >
      <color attach="background" args={['#08090c']} />
      <DeepSpaceBackground />
      <PlanetLighting />
      <Suspense fallback={null}>
        <PlanetGlobe
          activeBody={activeBody}
          selectedEquipmentId={selectedEquipmentId}
          onSelectEquipment={onSelectEquipment}
          onTextureStatus={onTextureStatus}
          textureStatus={textureStatus}
        />
        <PlanetAtmosphere body={activeBody} />
      </Suspense>
      <CameraController target={target} action={cameraAction} controlsRef={controlsRef} />
      <OrbitControls
        ref={controlsRef}
        enableRotate
        enableZoom
        enablePan={false}
        enableDamping
        rotateSpeed={0.7}
        zoomSpeed={0.8}
        minDistance={3}
        maxDistance={8}
        autoRotate={!selectedEquipmentId}
        autoRotateSpeed={0.5}
        mouseButtons={{
          LEFT: MOUSE.ROTATE,
          MIDDLE: MOUSE.DOLLY,
          RIGHT: MOUSE.PAN,
        }}
      />
    </Canvas>
  );
}
