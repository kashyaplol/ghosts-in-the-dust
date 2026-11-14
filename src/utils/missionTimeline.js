function getDateValue(mission) {
  const value = Date.parse(mission?.landedDate || '');
  return Number.isNaN(value) ? null : value;
}

export function getTimelineMissions(missions) {
  return missions
    .map((mission, index) => ({ mission, index, date: getDateValue(mission) }))
    .sort((first, second) => {
      if (first.date === null && second.date === null) return first.index - second.index;
      if (first.date === null) return 1;
      if (second.date === null) return -1;
      return first.date - second.date || first.index - second.index;
    })
    .map(({ mission }) => mission);
}

export function filterTimelineMissions(missions, body = 'All') {
  return body === 'All' ? missions : missions.filter((mission) => mission.body === body);
}

export function getTimelineDate(mission) {
  return getDateValue(mission) === null ? 'DATE UNAVAILABLE' : mission.landedDate;
}
