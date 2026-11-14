import { Crosshair, Globe2, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

const actions = [
  { type: 'reset', label: 'Reset view', icon: RotateCcw, key: 'R' },
  { type: 'focus', label: 'Focus mission', icon: Crosshair, key: 'F' },
  { type: 'explore', label: 'Explore planet', icon: Globe2, key: 'G' },
];

export default function CameraActions({ hasSelection, onAction }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      const action = actions.find(({ key }) => key.toLowerCase() === event.key.toLowerCase());
      if (!action || (action.type === 'focus' && !hasSelection)) return;
      event.preventDefault();
      onAction(action.type);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasSelection, onAction]);

  return (
    <nav
      className="pointer-events-auto fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-1 rounded-lg border border-white/10 bg-[#12141d]/85 p-1 shadow-xl backdrop-blur-md"
      aria-label="Camera navigation"
    >
      {actions.map(({ type, label, icon: Icon }) => {
        const disabled = type === 'focus' && !hasSelection;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onAction(type)}
            disabled={disabled}
            aria-label={label}
            title={`${label} (${type === 'reset' ? 'R' : type === 'focus' ? 'F' : 'G'})`}
            className="rounded p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-[#00f3ff] disabled:cursor-not-allowed disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-[#00f3ff]/70"
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
