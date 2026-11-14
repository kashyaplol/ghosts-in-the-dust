export const MIN_ZOOM_DISTANCE = 3;
export const MAX_ZOOM_DISTANCE = 11;
export const DEFAULT_DESKTOP_DISTANCE = 5.85;
export const FOCUS_DESKTOP_DISTANCE = 5.65;
export const EXPLORE_DESKTOP_DISTANCE = 6.5;
export const ZOOM_STEP_DISTANCE = 0.5;

export function clampZoomDistance(distance) {
  if (!Number.isFinite(distance)) return DEFAULT_DESKTOP_DISTANCE;
  return Math.min(MAX_ZOOM_DISTANCE, Math.max(MIN_ZOOM_DISTANCE, distance));
}

export function getResponsiveDistance(baseDistance, aspect = 1.6) {
  if (!Number.isFinite(aspect) || aspect >= 1) {
    return clampZoomDistance(baseDistance);
  }
  const scaleFactor = Math.max(0.55, Math.min(1, aspect * 1.2));
  return clampZoomDistance(baseDistance / scaleFactor);
}

export function distanceToZoomRatio(distance) {
  const clamped = clampZoomDistance(distance);
  return (MAX_ZOOM_DISTANCE - clamped) / (MAX_ZOOM_DISTANCE - MIN_ZOOM_DISTANCE);
}

export function zoomRatioToDistance(ratio) {
  const clampedRatio = Number.isFinite(ratio) ? Math.min(1, Math.max(0, ratio)) : 0.5;
  return clampZoomDistance(
    MAX_ZOOM_DISTANCE - clampedRatio * (MAX_ZOOM_DISTANCE - MIN_ZOOM_DISTANCE),
  );
}

export function stepZoomDistance(distance, direction) {
  const step = direction >= 0 ? -ZOOM_STEP_DISTANCE : ZOOM_STEP_DISTANCE;
  return clampZoomDistance(distance + step);
}

export function formatZoomLevel(distance) {
  return `${Math.round(distanceToZoomRatio(distance) * 100)}%`;
}
