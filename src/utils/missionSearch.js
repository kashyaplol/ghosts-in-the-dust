export function getMissionSearchText(mission) {
  return [
    mission.id,
    mission.name,
    mission.body,
    mission.status,
    mission.primaryMission,
    mission.causeOfDeath,
    mission.technicalSpecs.mass,
    mission.technicalSpecs.powerSource,
    mission.technicalSpecs.totalDistance,
    mission.narrativeTranscript,
  ].join(' ').toLowerCase();
}

export function filterMissions(missions, { query = '', body = 'All', status = 'All', year = 'All' }) {
  const normalizedQuery = query.trim().toLowerCase();
  return missions.filter((mission) => (
    (!normalizedQuery || getMissionSearchText(mission).includes(normalizedQuery))
    && (body === 'All' || mission.body === body)
    && (status === 'All' || mission.status === status)
    && (year === 'All' || mission.landedDate.startsWith(year))
  ));
}

export function getMissionStatuses(missions) {
  return [...new Set(missions.map((mission) => mission.status))];
}

export function getLandingYears(missions) {
  return [...new Set(missions.map((mission) => mission.landedDate.slice(0, 4)))].sort();
}
