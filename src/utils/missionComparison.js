export const comparisonFields = [
  { key: 'body', label: 'Planetary body' },
  { key: 'landedDate', label: 'Landing date' },
  { key: 'missionType', label: 'Mission type' },
  { key: 'primaryMission', label: 'Mission objective' },
  { key: 'status', label: 'Status' },
  { key: 'mass', label: 'Mass', section: 'Technical specifications' },
  { key: 'powerSource', label: 'Power source', section: 'Technical specifications' },
  { key: 'totalDistance', label: 'Total distance', section: 'Technical specifications' },
];

export function getComparisonValue(mission, key) {
  if (!mission) return 'NOT AVAILABLE';
  if (key === 'missionType') return mission.missionType || 'NOT DOCUMENTED';
  if (key in mission) return mission[key] || 'NOT AVAILABLE';
  return mission.technicalSpecs?.[key] || 'NOT AVAILABLE';
}

export function getComparisonRows(left, right) {
  return comparisonFields.map((field) => {
    const leftValue = getComparisonValue(left, field.key);
    const rightValue = getComparisonValue(right, field.key);
    return {
      ...field,
      leftValue,
      rightValue,
      differs: leftValue !== rightValue,
    };
  });
}
