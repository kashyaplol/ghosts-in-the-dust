import { ChevronDown, Filter, Globe2, Search, X } from 'lucide-react';

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="flex items-center gap-1 font-mono text-[9px] uppercase text-white/50">
      {label}
      <span className="relative">
        <select
          value={value}
          onChange={onChange}
          className="appearance-none rounded border border-white/10 bg-[#12141d] py-1 pl-2 pr-6 text-[10px] text-white/80 outline-none focus:border-[#00f3ff]/60"
          aria-label={`${label} filter`}
        >
          <option value="All">All</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-1 top-1.5 text-white/40" size={11} />
      </span>
    </label>
  );
}

export default function MissionSearch({
  search,
  open,
  onOpen,
  onDismiss,
  onSelectMission,
}) {
  const {
    body, clearAll, filtersActive, highlightedIndex, inputRef, query,
    resultCount, results, setBody, setQuery, setStatus, setYear, statuses, status, years, year,
  } = search;
  const visible = open && (query.trim() || filtersActive);

  return (
    <div className="relative w-full sm:w-auto">
      <label htmlFor="mission-search" className="sr-only">Search missions</label>
      <Search className="absolute left-3 top-2.5 text-white/40" size={15} />
      <input
        ref={inputRef}
        id="mission-search"
        value={query}
        onFocus={onOpen}
        onChange={(event) => { onOpen(); setQuery(event.target.value); }}
        placeholder="SEARCH MISSIONS"
        className="w-full rounded border border-white/10 bg-[#12141d]/85 py-2 pl-9 pr-9 font-mono text-xs text-white outline-none transition focus:border-[#00f3ff]/60 sm:w-56"
        aria-controls="mission-results"
        aria-expanded={Boolean(visible)}
        aria-autocomplete="list"
      />
      {(query || filtersActive) && (
        <button type="button" onClick={clearAll} className="absolute right-2 top-2 text-white/40 hover:text-white" aria-label="Clear all search and filters">
          <X size={15} />
        </button>
      )}
      {visible && (
        <div id="mission-results" className="absolute left-0 right-0 top-11 z-50 min-w-[min(90vw,360px)] rounded border border-white/10 bg-[#12141d] p-2 shadow-xl">
          <div className="mb-2 flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
            <Filter size={12} className="text-[#00f3ff]" />
            <SelectFilter label="Planet" value={body} options={['Moon', 'Mars']} onChange={setBody} />
            <SelectFilter label="Status" value={status} options={statuses} onChange={setStatus} />
            <SelectFilter label="Year" value={year} options={years} onChange={setYear} />
            <span className="ml-auto font-mono text-[9px] text-white/40">{resultCount} RESULTS</span>
          </div>
          {results.length ? results.map((mission, index) => (
            <button
              type="button"
              key={mission.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onSelectMission(mission)}
              className={`flex w-full items-start gap-2 rounded px-2 py-2 text-left ${index === highlightedIndex ? 'bg-[#00f3ff]/10 text-[#00f3ff]' : 'text-white/80 hover:bg-white/10'}`}
              role="option"
              aria-selected={index === highlightedIndex}
            >
              <Globe2 size={15} className="mt-0.5 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs">{mission.name}</span>
                <span className="block font-mono text-[9px] uppercase text-white/40">{mission.body} · {mission.landedDate} · {mission.status}</span>
              </span>
            </button>
          )) : (
            <p className="px-2 py-3 font-mono text-xs text-white/40">NO MISSIONS MATCH CURRENT FILTERS</p>
          )}
          <p className="mt-2 border-t border-white/10 pt-2 font-mono text-[9px] text-white/30">↑↓ NAVIGATE · ENTER SELECT · ESC DISMISS</p>
        </div>
      )}
    </div>
  );
}
