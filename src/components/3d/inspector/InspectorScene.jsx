import { Suspense, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import HardwareFallback from '@/components/3d/inspector/HardwareFallback';
import HardwareModel from '@/components/3d/inspector/HardwareModel';
import TextureFallbackBoundary from '@/components/3d/TextureFallbackBoundary';
import { hasHardwareModel } from '@/utils/models';

function LoadingFallback({ wireframe, autoRotate, onLoading }) {
  useEffect(() => onLoading?.(), [onLoading]);
  return <HardwareFallback wireframe={wireframe} autoRotate={autoRotate} />;
}

export default function InspectorScene({
  equipment,
  wireframe,
  autoRotate,
  onLoading,
  onLoaded,
  onFailed,
}) {
  return (
    <>
      <color attach="background" args={['#08090c']} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <pointLight position={[-3, 1, 2]} intensity={2} color="#00f3ff" />
      {hasHardwareModel(equipment.id) ? (
        <TextureFallbackBoundary
          key={equipment.id}
          resetKey={equipment.id}
          onError={onFailed}
          fallback={<HardwareFallback wireframe={wireframe} autoRotate={autoRotate} />}
        >
          <Suspense
            fallback={(
              <LoadingFallback
                wireframe={wireframe}
                autoRotate={autoRotate}
                onLoading={onLoading}
              />
            )}
          >
            <HardwareModel
              equipment={equipment}
              wireframe={wireframe}
              autoRotate={autoRotate}
              onLoaded={onLoaded}
            />
          </Suspense>
        </TextureFallbackBoundary>
      ) : (
        <HardwareFallback wireframe={wireframe} autoRotate={autoRotate} />
      )}
      <OrbitControls enableDamping autoRotate={false} minDistance={2} maxDistance={6} />
    </>
  );
}
