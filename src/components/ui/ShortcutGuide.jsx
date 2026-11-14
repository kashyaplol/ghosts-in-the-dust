import { Button, PanelHeader } from '@/components/ui/primitives';

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
    <aside
      className="instrument-panel pointer-events-auto fixed right-4 top-28 z-[60] w-[calc(100vw-2rem)] rounded-lg p-5 sm:right-6 lg:top-20 sm:w-[360px]"
      role="dialog"
      aria-label="Keyboard shortcuts"
    >
      <PanelHeader
        eyebrow="Navigation"
        eyebrowClass="text-ice-accent"
        title="Keyboard Shortcuts"
        onClose={onClose}
        closeLabel="Close keyboard shortcuts"
      />
      <dl className="mt-4 divide-y divide-white/[0.07]">
        {shortcuts.map(([key, action, context]) => (
          <div key={key} className="grid grid-cols-[64px_1fr] items-center gap-3 py-2.5">
            <dt className="rounded border border-white/15 bg-panel-recessed px-2 py-1 text-center font-mono text-[11px] text-ink-primary">
              {key}
            </dt>
            <dd>
              <p className="text-xs font-medium text-ink-primary">{action}</p>
              <p className="mt-0.5 text-[11px] text-ink-muted">{context}</p>
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex justify-end border-t border-white/[0.08] pt-3">
        <Button variant="tertiary" size="sm" onClick={onClose}>
          Done
        </Button>
      </div>
    </aside>
  );
}
