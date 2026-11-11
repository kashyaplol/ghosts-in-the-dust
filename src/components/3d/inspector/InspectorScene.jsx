import { OrbitControls } from '@react-three/drei';
import HardwareFallback from '@/components/3d/inspector/HardwareFallback';
import HardwareModel, {
  hasHardwareModel,
} from '@/components/3d/inspector/HardwareModel';
import TextureFallbackBoundary from '@/components/3d/TextureFallbackBoundary';

export default function InspectorScene({ equipment, wireframe, autoRotate }) {
  return (
    <>
      <color attach="background" args={['#08090c']} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <pointLight position={[-3, 1, 2]} intensity={2} color="#00f3ff" />
      {hasHardwareModel(equipment.id) ? (
        <TextureFallbackBoundary
          fallback={<HardwareFallback wireframe={wireframe} autoRotate={autoRotate} />}
        >
          <HardwareModel
            equipment={equipment}
            wireframe={wireframe}
            autoRotate={autoRotate}
          />
        </TextureFallbackBoundary>
      ) : (
        <HardwareFallback wireframe={wireframe} autoRotate={autoRotate} />
      )}
      <OrbitControls enableDamping autoRotate={false} minDistance={2} maxDistance={6} />
    </>
  );
}
