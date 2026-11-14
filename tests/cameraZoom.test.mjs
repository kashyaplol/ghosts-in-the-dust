import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_DESKTOP_DISTANCE,
  MAX_ZOOM_DISTANCE,
  MIN_ZOOM_DISTANCE,
  clampZoomDistance,
  distanceToZoomRatio,
  formatZoomLevel,
  getResponsiveDistance,
  stepZoomDistance,
  zoomRatioToDistance,
} from '../src/utils/cameraZoom.js';

test('clamps camera distance within OrbitControls min and max bounds', () => {
  assert.equal(clampZoomDistance(1.2), MIN_ZOOM_DISTANCE);
  assert.equal(clampZoomDistance(MAX_ZOOM_DISTANCE + 3), MAX_ZOOM_DISTANCE);
  assert.equal(clampZoomDistance(5.55), 5.55);
});

test('adapts framing distance for desktop and mobile viewports without exceeding bounds', () => {
  const desktop = getResponsiveDistance(DEFAULT_DESKTOP_DISTANCE, { width: 1440, height: 900 });
  assert.equal(desktop, DEFAULT_DESKTOP_DISTANCE);
  const portrait = getResponsiveDistance(DEFAULT_DESKTOP_DISTANCE, { width: 390, height: 844 });
  assert.ok(portrait > desktop);
  assert.ok(portrait <= MAX_ZOOM_DISTANCE);
});

test('converts between camera distance and zoom ratio consistently', () => {
  assert.equal(distanceToZoomRatio(MIN_ZOOM_DISTANCE), 1);
  assert.equal(distanceToZoomRatio(MAX_ZOOM_DISTANCE), 0);
  assert.ok(
    Math.abs(zoomRatioToDistance(0.5) - (MIN_ZOOM_DISTANCE + MAX_ZOOM_DISTANCE) / 2) < 1e-9,
  );
  assert.equal(formatZoomLevel(MIN_ZOOM_DISTANCE), '100%');
  assert.equal(formatZoomLevel(MAX_ZOOM_DISTANCE), '0%');
});

test('steps zoom in and out respecting limits', () => {
  assert.equal(stepZoomDistance(5.5, 1), 5);
  assert.equal(stepZoomDistance(5.5, -1), 6);
  assert.equal(stepZoomDistance(MIN_ZOOM_DISTANCE, 1), MIN_ZOOM_DISTANCE);
  assert.equal(stepZoomDistance(MAX_ZOOM_DISTANCE, -1), MAX_ZOOM_DISTANCE);
});
