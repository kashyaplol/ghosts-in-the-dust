import { Keyboard, X } from 'lucide-react';

const shortcuts = [
  ['/', 'Focus mission search', 'Global, outside text fields'],
  ['R', 'Reset camera view', 'Global, outside text fields'],
  ['F', 'Focus selected mission', 'When a mission is selected'],
  ['G', 'Explore full planet', 'Global, outside text fields'],
  ['↑ / ↓', 'Navigate search results', 'Mission search focused'],
  ['Enter', 'Select highlighted mission', 'Mission search focused'],
  ['Esc', 'Close topmost panel', 'Global'],
];

export default function ShortcutGuide({ onClose }) {
  return (
    <aside className="pointer-events-auto fixed right-5 top-24 z-[60] w-[min(92vw,360px)] rounded-xl border border-glass-border bg-panel-dark/95 p-5 shadow-2xl backdrop-blur-md" role="dialog" aria-label="Keyboard shortcuts">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#00f3ff]"><Keyboard size={15} /> Keyboard shortcuts</h2>
        <button type="button" onClick={onClose} aria-label="Close keyboard shortcuts" className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"><X size={16} /></button>
      </div>
      <dl className="mt-4 space-y-3">
        {shortcuts.map(([key, action, context]) => (
          <div key={key} className="grid grid-cols-[64px_1fr] gap-3">
            <dt className="rounded border border-white/10 px-2 py-1 text-center font-mono text-[10px] text-white/80">{key}</dt>
            <dd><p className="text-xs text-white/80">{action}</p><p className="font-mono text-[9px] uppercase text-white/35">{context}</p></dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
