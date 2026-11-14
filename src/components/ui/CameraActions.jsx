import { Crosshair, Globe2, RotateCcw } from 'lucide-react';

const actions = [
  { type: 'reset', shortLabel: 'Reset', label: 'Reset view', icon: RotateCcw, key: 'R' },
  { type: 'focus', shortLabel: 'Focus', label: 'Focus mission', icon: Crosshair, key: 'F' },
  { type: 'explore', shortLabel: 'Orbit', label: 'Explore planet', icon: Globe2, key: 'G' },
];

export default function CameraActions({ hasSelection, onAction }) {
  return (
    <nav
      className="instrument-panel pointer-events-auto fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-md p-1 sm:bottom-5"
      aria-label="Camera navigation"
    >
      {actions.map(({ type, shortLabel, label, icon: Icon, key }) => {
        const disabled = type === 'focus' && !hasSelection;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onAction(type)}
            disabled={disabled}
            aria-label={label}
            title={`${label} (${key})`}
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] px-3 text-xs font-medium text-ink-secondary whitespace-nowrap transition-colors duration-150 hover:bg-panel-elevated hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-accent/75 disabled:pointer-events-none disabled:opacity-30"
          >
            <Icon size={14} aria-hidden="true" className="text-ice-accent/80" />
            <span>{shortLabel}</span>
            <kbd
              aria-hidden="true"
              className="hidden rounded border border-white/10 px-1 py-0.5 font-mono text-[9px] leading-none text-ink-muted sm:inline-block"
            >
              {key}
            </kbd>
          </button>
        );
      })}
    </nav>
  );
}
