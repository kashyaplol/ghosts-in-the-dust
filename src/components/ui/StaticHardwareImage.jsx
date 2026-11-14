import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getHardwareImage } from '@/utils/hardwareImages';
import { Button } from '@/components/ui/primitives';

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
      <div className="flex h-full items-center justify-center bg-space-black p-8 text-center">
        <div>
          <p className="font-mono text-xs font-medium tracking-wider text-solar-amber">
            Static Image Unavailable
          </p>
          <p className="mt-2 text-sm text-ink-secondary">
            No verified visual asset is bundled for this mission.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col bg-space-black">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4">
        {status === 'loading' && (
          <p className="absolute font-mono text-xs text-ink-muted">
            Loading archival image...
          </p>
        )}
        <img
          src={image.path}
          alt={`${equipment.name} ${image.kind.toLowerCase()}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => {
            setStatus('loaded');
            onLoaded?.();
          }}
          onError={() => {
            setStatus('error');
            onError?.();
          }}
          className={`max-h-full max-w-full object-contain transition-[opacity,transform] duration-200 ${status === 'loading' ? 'opacity-0' : 'opacity-100'}`}
          style={{ transform: `scale(${scale})` }}
        />
      </div>
      <div className="flex items-center justify-center gap-2 border-t border-white/10 bg-panel-dark/80 px-4 py-2.5">
        <Button
          variant="icon"
          size="icon-sm"
          onClick={() => setScale((value) => Math.max(1, Number((value - 0.2).toFixed(1))))}
          aria-label="Zoom out"
        >
          <Minus size={14} aria-hidden="true" />
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setScale(1)}
          aria-label="Reset image zoom"
          className="font-mono tabular-data"
        >
          <RotateCcw size={13} aria-hidden="true" />
          {Math.round(scale * 100)}%
        </Button>
        <Button
          variant="icon"
          size="icon-sm"
          onClick={() => setScale((value) => Math.min(2.5, Number((value + 0.2).toFixed(1))))}
          aria-label="Zoom in"
        >
          <Plus size={14} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
