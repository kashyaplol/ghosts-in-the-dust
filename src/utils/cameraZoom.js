export const MIN_ZOOM_DISTANCE = 3;
export const MAX_ZOOM_DISTANCE = 12.5;
export const DEFAULT_DESKTOP_DISTANCE = 6.5;
export const FOCUS_DESKTOP_DISTANCE = 6.0;
export const EXPLORE_DESKTOP_DISTANCE = 6.8;
export const ZOOM_STEP_DISTANCE = 0.5;
export const PLANET_FRAMING_RADIUS = 2.05;

const HALF_FOV_TAN = Math.tan((45 * Math.PI) / 360);

export function clampZoomDistance(distance) {
  if (!Number.isFinite(distance)) return DEFAULT_DESKTOP_DISTANCE;
  return Math.min(MAX_ZOOM_DISTANCE, Math.max(MIN_ZOOM_DISTANCE, distance));
}

export function getResponsiveDistance(baseDistance, viewport = 1.6, fitFullSphere = true) {
  const isObject = viewport && typeof viewport === 'object';
  const rawAspect = isObject
    ? viewport.width / Math.max(1, viewport.height)
    : viewport;
  const aspect = Number.isFinite(rawAspect) && rawAspect > 0 ? rawAspect : 1.6;
  const height = isObject && Number.isFinite(viewport.height)
    ? Math.max(320, viewport.height)
    : (aspect < 1 ? 844 : 900);
  const width = isObject && Number.isFinite(viewport.width)
    ? Math.max(280, viewport.width)
    : aspect * height;

  const headerClearance = width < 1024 ? 96 : 58;
  const dockClearance = 64;
  const verticalBreathing = width < 1024 ? 20 : 24;
  const horizontalMargin = width < 640 ? 14 : 24;

  const usableHalfY = Math.max(80, height / 2 - Math.max(headerClearance, dockClearance) - verticalBreathing);
  const usableHalfX = Math.max(80, width / 2 - horizontalMargin);
  const tanY = (usableHalfY / (height / 2)) * HALF_FOV_TAN;
  const tanX = (usableHalfX / (width / 2)) * aspect * HALF_FOV_TAN;
  const limitingTan = Math.max(0.05, Math.min(tanX, tanY));
  const minFitDistance = PLANET_FRAMING_RADIUS * Math.sqrt(1 + 1 / (limitingTan * limitingTan));

  if (fitFullSphere) {
    return clampZoomDistance(Math.max(baseDistance, minFitDistance));
  }
  const viewportScale = Math.max(1, minFitDistance / DEFAULT_DESKTOP_DISTANCE);
  return clampZoomDistance(baseDistance * viewportScale);
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
