import { useMemo, useRef, useState } from 'react';
import equipment from '@/data/equipment.json';
import { filterMissions, getLandingYears, getMissionStatuses } from '@/utils/missionSearch';

export default function useMissionSearch(onSelectMission) {
  const [query, setQuery] = useState('');
  const [body, setBody] = useState('All');
  const [status, setStatus] = useState('All');
  const [year, setYear] = useState('All');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);
  const statuses = useMemo(() => getMissionStatuses(equipment), []);
  const years = useMemo(() => getLandingYears(equipment), []);
  const results = useMemo(
    () => filterMissions(equipment, { body, query, status, year }),
    [body, query, status, year],
  );

  const clearAll = () => {
    setQuery('');
    setBody('All');
    setStatus('All');
    setYear('All');
    setHighlightedIndex(0);
  };
  const navigate = (direction) => {
    if (!results.length) return;
    setHighlightedIndex((index) => (
      (index + direction + results.length) % results.length
    ));
  };
  const selectHighlighted = () => {
    const mission = results[highlightedIndex];
    if (mission) onSelectMission(mission);
  };
  const setQueryAndReset = (value) => {
    setQuery(value);
    setHighlightedIndex(0);
  };
  const setFilter = (setter) => (event) => {
    setter(event.target.value);
    setHighlightedIndex(0);
  };

  return {
    body,
    clearAll,
    filtersActive: body !== 'All' || status !== 'All' || year !== 'All',
    highlightedIndex,
    inputRef,
    navigate,
    query,
    resultCount: results.length,
    results,
    selectHighlighted,
    setBody: setFilter(setBody),
    setQuery: setQueryAndReset,
    setStatus: setFilter(setStatus),
    setYear: setFilter(setYear),
    statuses,
    status,
    years,
    year,
  };
}
