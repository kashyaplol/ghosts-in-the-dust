import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Grid3x3, Rotate3D } from 'lucide-react';
import InspectorScene from '@/components/3d/inspector/InspectorScene';
import { hasHardwareModel } from '@/utils/models';
import { getHardwareImage } from '@/utils/hardwareImages';
import StaticHardwareImage from '@/components/ui/StaticHardwareImage';
import { BodyTag, Button, PanelHeader } from '@/components/ui/primitives';

const MODEL_STATES = {
  loaded: 'Interactive 3D Model',
  loading: 'Loading GLB Hardware Profile',
  failed: 'GLB Load Failed — Fallback Geometry',
  'image-loading': 'Loading Archival Imagery',
  'image-loaded': 'Archival Mission Photograph',
  'image-error': 'Static Image Unavailable — Fallback',
  'no-model': 'Procedural Fallback Geometry',
};

export default function HardwareInspector({ equipment, onClose }) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [modelState, setModelState] = useState(
    hasHardwareModel(equipment?.id) ? 'loading' : getHardwareImage(equipment?.id) ? 'image-loading' : 'no-model',
  );

  useEffect(() => {
    setModelState(hasHardwareModel(equipment?.id) ? 'loading' : getHardwareImage(equipment?.id) ? 'image-loading' : 'no-model');
    setWireframe(false);
    setAutoRotate(true);
  }, [equipment?.id]);

  if (!equipment) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-space-black/82 p-4">
      <section
        className="instrument-panel w-full max-w-3xl overflow-hidden rounded-lg"
        role="dialog"
        aria-modal="true"
        aria-label={`${equipment.name} hardware inspector`}
      >
        <div className="border-b border-white/10 px-5 py-4">
          <PanelHeader
            eyebrow={MODEL_STATES[modelState] || 'Hardware Inspector'}
            eyebrowClass="text-solar-amber"
            title={equipment.name}
            onClose={onClose}
            closeLabel="Close hardware inspector"
          >
            <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-muted">
              <BodyTag body={equipment.body} />
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-data">{equipment.technicalSpecs.mass}</span>
            </div>
          </PanelHeader>
        </div>

        <div className="h-[min(58vh,460px)] bg-space-black">
          {hasHardwareModel(equipment.id) ? (
            <Canvas camera={{ position: [0, 0.5, 3.5], fov: 40 }}>
              <Suspense fallback={null}>
                <InspectorScene
                  equipment={equipment}
                  wireframe={wireframe}
                  autoRotate={autoRotate}
                  onLoading={() => setModelState('loading')}
                  onLoaded={() => setModelState('loaded')}
                  onFailed={() => setModelState('failed')}
                />
              </Suspense>
            </Canvas>
          ) : (
            <StaticHardwareImage
              equipment={equipment}
              onLoaded={() => setModelState('image-loaded')}
              onError={() => setModelState('image-error')}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-panel-recessed/70 px-5 py-3.5">
          <p className="max-w-md text-xs leading-relaxed text-ink-secondary">
            {modelState === 'loaded' && 'Verified local GLB asset loaded for 360° interactive inspection.'}
            {modelState === 'loading' && 'Loading local GLB asset; procedural geometry remains active until ready.'}
            {modelState === 'failed' && 'The local GLB could not be decoded. Procedural fallback geometry is active.'}
            {modelState === 'image-loading' && 'Loading verified archival photograph for this mission.'}
            {modelState === 'image-loaded' && `${getHardwareImage(equipment.id).attribution}.`}
            {(modelState === 'image-error' || modelState === 'no-model') && 'No verified visual asset is available. Procedural fallback geometry is active.'}
          </p>
          {hasHardwareModel(equipment.id) && (
            <div className="flex items-center gap-2">
              <Button
                variant={autoRotate ? 'selected' : 'secondary'}
                size="sm"
                onClick={() => setAutoRotate((value) => !value)}
                aria-pressed={autoRotate}
              >
                <Rotate3D size={14} aria-hidden="true" />
                Auto-Rotate
              </Button>
              <Button
                variant={wireframe ? 'amber' : 'secondary'}
                size="sm"
                onClick={() => setWireframe((value) => !value)}
                aria-pressed={wireframe}
              >
                <Grid3x3 size={14} aria-hidden="true" />
                Wireframe
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
