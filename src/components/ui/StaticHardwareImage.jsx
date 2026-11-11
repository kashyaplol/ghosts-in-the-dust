import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getHardwareImage } from '@/utils/hardwareImages';

export default function StaticHardwareImage({ equipment, onError, onLoaded }) {
  const image = getHardwareImage(equipment.id);
  const [scale, setScale] = useState(1);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setScale(1);
    setStatus('loading');
  }, [equipment.id]);

  if (!image || status === 'error') {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#ffb703]">
            STATIC IMAGE UNAVAILABLE
          </p>
          <p className="mt-2 text-sm text-white/50">
            No verified visual asset is bundled for this mission.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-[#08090c]">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
        {status === 'loading' && (
          <p className="absolute font-mono text-xs uppercase tracking-wider text-white/50">
            Loading archival image
          </p>
        )}
        <img
          src={image.path}
          alt={`${equipment.name} ${image.kind.toLowerCase()}`}
          loading="lazy"
          onLoad={() => {
            setStatus('loaded');
            onLoaded?.();
          }}
          onError={() => {
            setStatus('error');
            onError?.();
          }}
          className={`max-h-full max-w-full object-contain transition-transform duration-300 ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}
          style={{ transform: `scale(${scale})` }}
        />
      </div>
      <div className="flex items-center justify-center gap-2 border-t border-white/10 p-3">
        <button type="button" onClick={() => setScale((value) => Math.max(1, value - 0.2))} aria-label="Zoom out" className="rounded border border-white/10 p-2 text-white/70 hover:text-white">
          <Minus size={14} />
        </button>
        <button type="button" onClick={() => setScale(1)} aria-label="Reset image zoom" className="rounded border border-white/10 p-2 text-white/70 hover:text-white">
          <RotateCcw size={14} />
        </button>
        <button type="button" onClick={() => setScale((value) => Math.min(2.5, value + 0.2))} aria-label="Zoom in" className="rounded border border-white/10 p-2 text-white/70 hover:text-white">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
