import { ChevronDown, Search, X } from 'lucide-react';
import { BodyTag } from '@/components/ui/primitives';

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] text-ink-secondary">
      <span>{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={onChange}
          className="h-7 appearance-none rounded border border-white/12 bg-panel-dark pl-2 pr-6 font-mono text-[11px] text-ink-primary outline-none transition-colors focus:border-ice-accent/70"
          aria-label={`${label} filter`}
        >
          <option value="All">All</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1.5 top-2 text-ink-muted" size={11} aria-hidden="true" />
      </span>
    </label>
  );
}

export default function MissionSearch({
  search,
  open,
  onOpen,
  onSelectMission,
}) {
  const {
    body, clearAll, filtersActive, highlightedIndex, inputRef, query,
    resultCount, results, setBody, setQuery, setStatus, setYear, statuses, status, years, year,
  } = search;
  const visible = open && (query.trim() || filtersActive);

  return (
    <div className="relative flex-1 sm:w-56 sm:flex-none">
      <label htmlFor="mission-search" className="sr-only">Search missions</label>
      <Search className="pointer-events-none absolute left-2.5 top-2 text-ink-muted" size={14} aria-hidden="true" />
      <input
        ref={inputRef}
        id="mission-search"
        value={query}
        onFocus={onOpen}
        onChange={(event) => {
          onOpen();
          setQuery(event.target.value);
        }}
        placeholder="Search missions"
        className="h-8 w-full rounded-md border border-white/12 bg-panel-recessed pl-8 pr-8 text-xs text-ink-primary placeholder:text-ink-muted outline-none transition-colors focus:border-ice-accent/65 focus:bg-panel-elevated"
        aria-controls="mission-results"
        aria-expanded={Boolean(visible)}
        aria-autocomplete="list"
      />
      {!(query || filtersActive) && (
        <kbd
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1.5 hidden rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] leading-none text-ink-muted sm:inline-block"
        >
          /
        </kbd>
      )}
      {(query || filtersActive) && (
        <button
          type="button"
          onClick={clearAll}
          className="absolute right-2 top-2 text-ink-muted transition-colors hover:text-ink-primary focus-visible:outline-none focus-visible:text-ice-accent"
          aria-label="Clear all search and filters"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
      {visible && (
        <div
          id="mission-results"
          className="instrument-panel absolute left-0 right-0 top-10 z-50 min-w-[min(92vw,390px)] rounded-lg p-3"
        >
          <div className="mb-2.5 flex flex-wrap items-center gap-2 border-b border-white/10 pb-2.5">
            <SelectFilter label="Body" value={body} options={['Moon', 'Mars']} onChange={setBody} />
            <SelectFilter label="Status" value={status} options={statuses} onChange={setStatus} />
            <SelectFilter label="Year" value={year} options={years} onChange={setYear} />
            <span className="ml-auto font-mono text-[11px] tabular-data text-ink-muted">
              {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </span>
          </div>

          <div className="max-h-64 divide-y divide-white/[0.06] overflow-y-auto archive-scroll">
            {results.length ? results.map((mission, index) => {
              const active = index === highlightedIndex;
              return (
                <button
                  type="button"
                  key={mission.id}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => onSelectMission(mission)}
                  className={`flex w-full items-center justify-between gap-3 px-2.5 py-2.5 text-left transition-colors ${
                    active ? 'bg-ice-accent/12 text-ink-primary' : 'text-ink-primary hover:bg-white/[0.04]'
                  }`}
                  role="option"
                  aria-selected={active}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium">{mission.name}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-secondary">
                      <BodyTag body={mission.body} className="text-[11px]" />
                      <span aria-hidden="true" className="text-ink-muted">·</span>
                      <span className="font-mono tabular-data text-ink-muted">{mission.landedDate}</span>
                      <span aria-hidden="true" className="text-ink-muted">·</span>
                      <span className="text-ink-secondary">{mission.status}</span>
                    </span>
                  </span>
                </button>
              );
            }) : (
              <p className="px-2 py-4 text-center text-xs text-ink-muted">
                No missions match the current filters.
              </p>
            )}
          </div>

          <p className="mt-2 border-t border-white/10 pt-2 font-mono text-[10px] text-ink-muted">
            Up/Down navigate · Enter select · Esc dismiss
          </p>
        </div>
      )}
    </div>
  );
}
