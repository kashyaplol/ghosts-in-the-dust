export const BODY_THEMES = {
  Moon: {
    label: 'Moon',
    accent: '#c8d0dc',
    dotClass: 'bg-lunar-silver',
    textClass: 'text-lunar-silver',
    borderClass: 'border-lunar-silver/40',
  },
  Mars: {
    label: 'Mars',
    accent: '#c96a42',
    dotClass: 'bg-mars-copper',
    textClass: 'text-mars-copper',
    borderClass: 'border-mars-copper/45',
  },
};

export const STATUS_META = {
  'Lost Contact': {
    color: '#d45b5b',
    textClass: 'text-alert-red',
    glyph: '▲',
    heading: 'Cause of Signal Loss',
  },
  Decommissioned: {
    color: '#d49a45',
    textClass: 'text-solar-amber',
    glyph: '■',
    heading: 'Decommissioning Details',
  },
  Operational: {
    color: '#67c5d9',
    textClass: 'text-ice-accent',
    glyph: '●',
    heading: 'Current Mission Status',
  },
  'Mission Complete': {
    color: '#c8d0dc',
    textClass: 'text-lunar-silver',
    glyph: '◆',
    heading: 'Mission Completion',
  },
};

export function getBodyTheme(body) {
  return BODY_THEMES[body] || BODY_THEMES.Moon;
}

export function getStatusMeta(status) {
  return STATUS_META[status] || {
    color: '#d49a45',
    textClass: 'text-solar-amber',
    glyph: '●',
    heading: 'Current Mission Status',
  };
}

export function formatCoordinates(latitude, longitude) {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return 'Coordinates unavailable';
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(2)}°${latDir}, ${Math.abs(longitude).toFixed(2)}°${lonDir}`;
}

export function isOperationalMission(mission) {
  return mission?.status === 'Operational';
}

export function getLastSignalDisplay(mission) {
  if (!mission) return 'UNAVAILABLE';
  if (isOperationalMission(mission) || !mission.lastSignalDate) {
    return isOperationalMission(mission) ? 'ACTIVE / OPERATIONAL' : 'UNAVAILABLE';
  }
  return mission.lastSignalDate;
}

export function getOperationalLifespan(landedDate, lastSignalDate, status) {
  if (status === 'Operational' || !landedDate || !lastSignalDate) {
    return status === 'Operational' ? 'Ongoing' : 'Unavailable';
  }
  const start = new Date(`${landedDate}T00:00:00Z`);
  const end = new Date(`${lastSignalDate}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 'Unavailable';
  }
  const elapsedDays = Math.max(0, Math.round((end - start) / 86400000));
  const years = Math.floor(elapsedDays / 365.25);
  const days = Math.round(elapsedDays - years * 365.25);
  return years ? `${years}y ${days}d` : `${elapsedDays}d`;
}
