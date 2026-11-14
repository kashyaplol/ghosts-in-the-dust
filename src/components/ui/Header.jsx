import { ArrowLeftRight, Clock3, Compass, HelpCircle, Keyboard } from 'lucide-react';
import equipment from '@/data/equipment.json';
import { useSpaceContext } from '@/context/SpaceContext';
import MissionSearch from '@/components/ui/MissionSearch';
import { Button } from '@/components/ui/primitives';

const BODY_COUNTS = {
  Moon: equipment.filter((item) => item.body === 'Moon').length,
  Mars: equipment.filter((item) => item.body === 'Mars').length,
};

export default function Header({
  onReplayTutorial,
  onToggleShortcuts,
  search,
  searchOpen,
  onOpenSearch,
  onDismissSearch,
  onSelectMission,
  onStartGuidedExploration,
  onToggleTimeline,
  onToggleComparison,
  guidedOpen,
  timelineOpen,
  comparisonOpen,
}) {
  const { activeBody, switchBody } = useSpaceContext();

  return (
    <header className="pointer-events-auto relative z-40 w-full border-b border-white/10 bg-[#0d1015]/94 px-4 py-2.5 sm:px-6 sm:py-3">
      <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-nowrap lg:gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="min-w-0">
            <p className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-ink-muted sm:block">
              Planetary Archaeology Archive
            </p>
            <h1 className="truncate font-display text-lg font-semibold tracking-tight text-ink-primary sm:text-xl">
              Ghosts in the Dust
            </h1>
          </div>

          <div
            data-tutorial="planet-selector"
            role="group"
            aria-label="Planetary archive selector"
            className="flex items-center rounded-md border border-white/12 bg-panel-recessed p-0.5"
          >
            {['Moon', 'Mars'].map((body) => {
              const active = body === activeBody;
              const activeStyle = body === 'Mars'
                ? 'bg-mars-copper/20 text-ink-primary border-mars-copper/60'
                : 'bg-lunar-silver/15 text-ink-primary border-lunar-silver/50';
              return (
                <button
                  key={body}
                  type="button"
                  onClick={() => switchBody(body)}
                  aria-pressed={active}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-[4px] border px-3 text-xs font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ice-accent/75 ${
                    active ? activeStyle : 'border-transparent text-ink-secondary hover:text-ink-primary'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${body === 'Mars' ? 'bg-mars-copper' : 'bg-lunar-silver'}`}
                  />
                  <span>{body}</span>
                  <span className="font-mono text-[10px] tabular-data text-ink-muted">
                    {BODY_COUNTS[body]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-2 lg:w-auto lg:flex-nowrap lg:justify-end">
          <MissionSearch
            search={search}
            open={searchOpen}
            onOpen={onOpenSearch}
            onDismiss={onDismissSearch}
            onSelectMission={onSelectMission}
          />

          <div className="flex items-center gap-1.5">
            <Button
              variant={guidedOpen ? 'selected' : 'amber'}
              size="sm"
              onClick={onStartGuidedExploration}
              aria-label="Guided exploration"
              aria-pressed={Boolean(guidedOpen)}
            >
              <Compass size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Guided</span>
            </Button>

            <Button
              variant={timelineOpen ? 'selected' : 'secondary'}
              size="sm"
              onClick={onToggleTimeline}
              aria-label="Show historical mission timeline"
              aria-pressed={Boolean(timelineOpen)}
            >
              <Clock3 size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Timeline</span>
            </Button>

            <Button
              variant={comparisonOpen ? 'selected' : 'secondary'}
              size="sm"
              onClick={onToggleComparison}
              aria-label="Compare missions"
              aria-pressed={Boolean(comparisonOpen)}
            >
              <ArrowLeftRight size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Compare</span>
            </Button>

            <span className="mx-0.5 hidden h-4 w-px bg-white/10 sm:inline-block" aria-hidden="true" />

            <Button
              variant="icon"
              size="icon-sm"
              onClick={onToggleShortcuts}
              aria-label="Show keyboard shortcuts"
              title="Keyboard shortcuts (?)"
              className="!h-8 !w-8"
            >
              <Keyboard size={14} aria-hidden="true" />
            </Button>

            <Button
              variant="tertiary"
              size="sm"
              onClick={onReplayTutorial}
              aria-label="Replay tutorial"
              data-tutorial="help"
              className="px-2"
            >
              <HelpCircle size={14} aria-hidden="true" />
              <span className="hidden md:inline">Help</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
