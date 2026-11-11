import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Rotate3D, X } from 'lucide-react';
import InspectorScene from '@/components/3d/inspector/InspectorScene';
import { hasHardwareModel } from '@/utils/models';
import { getHardwareImage } from '@/utils/hardwareImages';
import StaticHardwareImage from '@/components/ui/StaticHardwareImage';

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
    <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <section
        className="w-full max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-[#12141d] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${equipment.name} hardware inspector`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ffb703]">
              {modelState === 'loaded' && 'INTERACTIVE 3D MODEL'}
              {modelState === 'loading' && 'Loading GLB Hardware Profile'}
              {modelState === 'failed' && 'GLB Load Failed — Fallback Profile'}
              {modelState === 'image-loading' && 'Loading NASA Archival Image'}
              {modelState === 'image-loaded' && 'NASA ARCHIVAL IMAGE'}
              {modelState === 'image-error' && 'STATIC IMAGE ERROR — HONEST FALLBACK'}
              {modelState === 'no-model' && 'MINIMAL FALLBACK PROFILE'}
            </p>
            <h2 className="mt-1 text-lg text-white">{equipment.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-white/50 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#00f3ff]"
            aria-label="Close hardware inspector"
          >
            <X size={20} />
          </button>
        </div>
        <div className="h-[min(60vh,480px)]">
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
          <p className="max-w-md text-xs leading-relaxed text-white/50">
            {modelState === 'loaded' && 'Verified local GLB asset loaded for interactive inspection.'}
            {modelState === 'loading' && 'Loading the selected local GLB asset; fallback geometry remains visible until ready.'}
            {modelState === 'failed' && 'The selected GLB could not be loaded. Interactive low-poly fallback geometry is active.'}
            {modelState === 'image-loading' && 'Loading a verified NASA archival image for this mission.'}
            {modelState === 'image-loaded' && `${getHardwareImage(equipment.id).attribution}.`}
            {(modelState === 'image-error' || modelState === 'no-model') && 'No verified visual asset is available. Minimal fallback geometry is active.'}
          </p>
          {hasHardwareModel(equipment.id) && <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAutoRotate((value) => !value)}
              className={`flex items-center gap-2 rounded border px-3 py-2 font-mono text-xs ${autoRotate ? 'border-[#00f3ff]/50 text-[#00f3ff]' : 'border-white/10 text-white/60'}`}
            >
              <Rotate3D size={14} /> AUTO-ROTATE
            </button>
            <button
              type="button"
              onClick={() => setWireframe((value) => !value)}
              className={`rounded border px-3 py-2 font-mono text-xs ${wireframe ? 'border-[#ffb703]/50 text-[#ffb703]' : 'border-white/10 text-white/60'}`}
            >
              WIREFRAME
            </button>
          </div>}
        </div>
      </section>
    </div>
  );
}
