import { Minus, Plus } from 'lucide-react';
import { useCallback, useRef } from 'react';
import {
  MAX_ZOOM_DISTANCE,
  MIN_ZOOM_DISTANCE,
  distanceToZoomRatio,
  formatZoomLevel,
  zoomRatioToDistance,
} from '@/utils/cameraZoom';

export default function ZoomControl({
  distance,
  onZoomSet,
  onZoomStep,
  telemetryOpen,
  hideOnMobile,
}) {
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const ratio = distanceToZoomRatio(distance);
  const percent = Math.round(ratio * 100);

  const updateFromClientY = useCallback((clientY) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const nextRatio = Math.min(1, Math.max(0, (rect.bottom - clientY) / Math.max(1, rect.height)));
    onZoomSet(zoomRatioToDistance(nextRatio), false);
  }, [onZoomSet]);

  const handlePointerDown = (event) => {
    event.preventDefault();
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromClientY(event.clientY);
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;
    updateFromClientY(event.clientY);
  };

  const handlePointerUp = (event) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault();
      onZoomStep(1);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault();
      onZoomStep(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      onZoomSet(MAX_ZOOM_DISTANCE, true);
    } else if (event.key === 'End') {
      event.preventDefault();
      onZoomSet(MIN_ZOOM_DISTANCE, true);
    }
  };

  const visibility = hideOnMobile ? 'hidden md:flex' : 'flex';
  const rightOffset = telemetryOpen ? 'right-3 md:right-[372px]' : 'right-3 md:right-5';

  return (
    <aside
      className={`instrument-panel pointer-events-auto fixed top-1/2 z-30 -translate-y-1/2 flex-col items-center gap-1.5 rounded-md px-1.5 py-2 transition-[right] duration-200 ${visibility} ${rightOffset}`}
      aria-label="Camera zoom control"
    >
      <span
        aria-hidden="true"
        className="text-[9px] font-medium uppercase tracking-[0.16em] text-ink-muted"
      >
        ZOOM
      </span>
      <button
        type="button"
        onClick={() => onZoomStep(1)}
        disabled={ratio >= 0.995}
        aria-label="Zoom in"
        title="Zoom in"
        className="inline-flex h-7 w-7 items-center justify-center rounded text-ink-secondary transition-colors hover:bg-panel-elevated hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-accent/75 disabled:pointer-events-none disabled:opacity-30"
      >
        <Plus size={14} aria-hidden="true" />
      </button>

      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Camera zoom"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={formatZoomLevel(distance)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="relative flex h-32 w-7 cursor-ns-resize touch-none select-none items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-accent/75"
      >
        <div className="relative h-28 w-[3px] rounded-full bg-white/15">
          <div
            className="absolute bottom-0 left-0 w-full rounded-full bg-ice-accent/80"
            style={{ height: `${percent}%` }}
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 h-2.5 w-4 -translate-x-1/2 rounded-sm border border-ice-accent bg-panel-dark shadow-sm"
            style={{ bottom: `calc(${percent}% - 5px)` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onZoomStep(-1)}
        disabled={ratio <= 0.005}
        aria-label="Zoom out"
        title="Zoom out"
        className="inline-flex h-7 w-7 items-center justify-center rounded text-ink-secondary transition-colors hover:bg-panel-elevated hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-accent/75 disabled:pointer-events-none disabled:opacity-30"
      >
        <Minus size={14} aria-hidden="true" />
      </button>

      <span
        aria-hidden="true"
        className="mt-0.5 font-mono text-[10px] tabular-data text-ink-muted"
      >
        {formatZoomLevel(distance)}
      </span>
    </aside>
  );
}
