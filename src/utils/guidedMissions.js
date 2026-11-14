export function getGuidedMissions(missions) {
  return [...missions].sort((first, second) => (
    first.landedDate.localeCompare(second.landedDate)
  ));
}
