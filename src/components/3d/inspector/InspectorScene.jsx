import { OrbitControls } from '@react-three/drei';
import HardwareFallback from '@/components/3d/inspector/HardwareFallback';

export default function InspectorScene({ wireframe, autoRotate }) {
  return (
    <>
      <color attach="background" args={['#08090c']} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <pointLight position={[-3, 1, 2]} intensity={2} color="#00f3ff" />
      <HardwareFallback wireframe={wireframe} autoRotate={autoRotate} />
      <OrbitControls enableDamping autoRotate={false} minDistance={2} maxDistance={6} />
    </>
  );
}

